import { gsap } from 'gsap';
import { revealClipPath, shadowBandPercent } from '@/lib/revelation';
import { holdUntilArrival } from './shot';

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
    .to(wipe, { progress: 1, duration: 1, ease: 'sine.inOut', onUpdate: apply }, 0.25)
    .fromTo('[data-camera]', { xPercent: 0 }, { xPercent: -4, duration: 1 }, 0.25)
    .fromTo('[data-camera-reverse]', { xPercent: 4 }, { xPercent: 0, duration: 1 }, 0.25);

  return timeline;
}

export function revelationCinema(): void {
  holdUntilArrival('.shot-track--revelation', '[data-revelation-stage]');
  gsap.set('[data-revelation-heading]', { opacity: 0 });
  wipeTimeline('.shot-track--revelation', 'top top', 'bottom bottom')
    .to('[data-revelation-heading]', { opacity: 1, duration: 0.4 }, 0.8)
    .to('[data-camera-reverse]', { scale: 1.06, duration: 0.7 }, 1.25);
}

export function revelationHandheld(): void {
  wipeTimeline('.shot-track--revelation', 'top top', 'bottom bottom');
}
