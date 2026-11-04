const TEXT_GAP = 16;

type Resolver = () => number;

const resolvers = new Map<string, Resolver>();
let settle: () => void = () => undefined;
let pending: string | null = null;

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

function jump(scene: HTMLElement): void {
  const top = resolvers.get(scene.id)?.() ?? layoutTop(scene);
  window.scrollTo({ top, behavior: 'instant' });
  settle();
}

function jumpIfPending(): void {
  const scene = pending ? document.getElementById(pending) : null;
  if (scene) jump(scene);
}

export function setLandingResolver(id: string, resolver: Resolver): void {
  resolvers.set(id, resolver);
  if (pending === id) jumpIfPending();
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
    jump(scene);
    scene.setAttribute('tabindex', '-1');
    scene.focus({ preventScroll: true });
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
