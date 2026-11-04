const TEXT_GAP = 16;
const COVER_MS = 420;
const REVEAL_MS = 950;
const GLIDE_MS = 900;
const ARRIVAL_DRIFT = 120;
const IMAGE_WAIT_MS = 1500;
const EASE_COVER = 'cubic-bezier(0.4, 0, 0.2, 1)';
const EASE_REVEAL = 'cubic-bezier(0.22, 0.8, 0.2, 1)';

type Resolver = () => number;

const resolvers = new Map<string, Resolver>();
let settle: () => void = () => undefined;
let pending: string | null = null;

let curtain: HTMLElement | null = null;
let curtainFade: Animation | null = null;
let covering = false;
let destination: HTMLElement | null = null;
let glideFrame = 0;

function sceneFromHash(hash: string): HTMLElement | null {
  const id = hash.slice(1);
  if (!id) return null;
  const element = document.getElementById(id);
  return element?.matches('[data-scene]') ? element : null;
}

function layoutTop(scene: HTMLElement): number {
  const text = scene.querySelector<HTMLElement>('[data-landing]') ?? scene;
  const header = document.querySelector<HTMLElement>('.site-header')?.offsetHeight ?? 0;
  return text.getBoundingClientRect().top + window.scrollY - header - TEXT_GAP;
}

function landingTop(scene: HTMLElement): number {
  return resolvers.get(scene.id)?.() ?? layoutTop(scene);
}

function scrollInstantly(top: number): void {
  window.scrollTo({ top, behavior: 'instant' });
}

function jump(scene: HTMLElement): void {
  stopGlide();
  scrollInstantly(landingTop(scene));
  settle();
}

function jumpIfPending(): void {
  const scene = pending ? document.getElementById(pending) : null;
  if (scene) jump(scene);
}

function moveFocus(scene: HTMLElement): void {
  scene.setAttribute('tabindex', '-1');
  scene.focus({ preventScroll: true });
}

function stopGlide(): void {
  cancelAnimationFrame(glideFrame);
  glideFrame = 0;
}

function glide(from: number, to: number, duration: number): void {
  stopGlide();
  const start = performance.now();
  const step = (now: number): void => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - (1 - progress) ** 3;
    scrollInstantly(from + (to - from) * eased);
    glideFrame = progress < 1 ? requestAnimationFrame(step) : 0;
  };
  glideFrame = requestAnimationFrame(step);
}

function fadeCurtain(to: number, duration: number, easing: string, done?: () => void): void {
  if (!curtain) {
    curtain = document.createElement('div');
    curtain.className = 'scene-curtain';
    curtain.dataset['sceneCurtain'] = '';
    curtain.setAttribute('aria-hidden', 'true');
    document.body.append(curtain);
  }
  const from = getComputedStyle(curtain).opacity;
  curtainFade?.cancel();
  curtain.style.opacity = String(to);
  curtainFade = curtain.animate([{ opacity: from }, { opacity: to }], { duration, easing });
  curtainFade.onfinish = done ?? null;
}

function arrive(): void {
  covering = false;
  const scene = destination;
  if (!scene) return;

  const before = window.scrollY;
  const target = landingTop(scene);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const drift = target >= before ? -ARRIVAL_DRIFT : ARRIVAL_DRIFT;
  const start = Math.min(Math.max(target + drift, 0), max);

  scrollInstantly(start);
  settle();
  moveFocus(scene);
  glide(start, target, REVEAL_MS);
  fadeCurtain(0, REVEAL_MS, EASE_REVEAL);
}

function imagesReady(scene: HTMLElement): Promise<void> {
  const decoding = [...scene.querySelectorAll('img')].map((image) => {
    image.loading = 'eager';
    return image.decode();
  });
  return Promise.race([
    Promise.allSettled(decoding).then(() => undefined),
    new Promise<void>((resolve) => {
      window.setTimeout(resolve, IMAGE_WAIT_MS);
    }),
  ]);
}

function travelTo(scene: HTMLElement): void {
  destination = scene;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    jump(scene);
    moveFocus(scene);
    return;
  }
  if (covering) return;

  const distance = landingTop(scene) - window.scrollY;
  if (Math.abs(distance) <= window.innerHeight) {
    moveFocus(scene);
    glide(window.scrollY, window.scrollY + distance, GLIDE_MS);
    return;
  }

  covering = true;
  stopGlide();
  const covered = new Promise<void>((resolve) => {
    fadeCurtain(1, COVER_MS, EASE_COVER, resolve);
  });
  void Promise.all([covered, imagesReady(scene)]).then(async () => {
    if (destination && destination !== scene) await imagesReady(destination);
    arrive();
  });
}

export function setLandingResolver(id: string, resolver: Resolver): void {
  resolvers.set(id, resolver);
  if (pending === id && !covering && !glideFrame) jumpIfPending();
}

export function clearLandingResolvers(): void {
  resolvers.clear();
}

export function setLandingSettle(callback: () => void): void {
  settle = callback;
}

export function resetLandingSettle(): void {
  settle = () => undefined;
}

export function initLandings(): void {
  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey) return;
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest<HTMLAnchorElement>('a[href^="#"]');
    const scene = link ? sceneFromHash(link.hash) : null;
    if (!link || !scene) return;

    event.preventDefault();
    if (window.location.hash !== link.hash) window.history.pushState(null, '', link.hash);
    pending = scene.id;
    travelTo(scene);
  });

  window.addEventListener('hashchange', () => {
    const scene = sceneFromHash(window.location.hash);
    if (!scene) return;
    pending = scene.id;
    jump(scene);
  });

  ['wheel', 'touchstart', 'pointerdown', 'keydown'].forEach((type) => {
    window.addEventListener(
      type,
      () => {
        pending = null;
        stopGlide();
      },
      { passive: true },
    );
  });

  const initial = sceneFromHash(window.location.hash);
  if (!initial) return;
  pending = initial.id;
  jump(initial);
  window.addEventListener('load', jumpIfPending, { once: true });
  void document.fonts?.ready.then(jumpIfPending);
}
