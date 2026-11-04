import { gsap } from 'gsap';
import { revealClipPath, shadowBandPercent } from '@/lib/revelation';
import { holdUntilArrival, landOnLabel } from './shot';

const WIPE_START = 0.25;
const WIPE_END = 1.25;

function wipeTimeline(triggerSelector: string, start: string, end: string): gsap.core.Timeline {
  const reverse = document.querySelector<HTMLElement>('[data-layer-reverse]');
  const shadow = document.querySelector<HTMLElement>('[data-shadow]');
  const wipe = { progress: 0 };

  const apply = (): void => {
    if (reverse) reverse.style.clipPath = revealClipPath(wipe.progress);
    if (shadow) shadow.style.transform = `translateX(${shadowBandPercent(wipe.progress)}%)`;
    if (reverse) reverse.dataset['progress'] = wipe.progress.toFixed(3);
  };
  apply();

  const timeline = gsap.timeline({
    scrollTrigger: { trigger: triggerSelector, start, end, scrub: 0.6 },
  });

  timeline
    .to(wipe, { progress: 1, duration: 1, ease: 'sine.inOut', onUpdate: apply }, WIPE_START)
    .fromTo('[data-camera]', { xPercent: 0 }, { xPercent: -4, duration: 1 }, WIPE_START)
    .fromTo('[data-camera-reverse]', { xPercent: 4 }, { xPercent: 0, duration: 1 }, WIPE_START);

  return timeline;
}

export function revelationCinema(): void {
  holdUntilArrival('.shot-track--revelation', '[data-revelation-stage]');
  gsap.set('[data-revelation-heading]', { opacity: 0 });
  const timeline = wipeTimeline('.shot-track--revelation', 'top top', 'bottom bottom')
    .to('[data-revelation-heading]', { opacity: 1, duration: 0.4 }, 0.8)
    .to('[data-camera-reverse]', { scale: 1.06, duration: 0.7 }, WIPE_END);
  landOnLabel('revelation', timeline, WIPE_END);
}

export function revelationHandheld(): void {
  const timeline = wipeTimeline('.shot-track--revelation', 'top top', 'bottom bottom');
  landOnLabel('revelation', timeline, WIPE_END);
}
