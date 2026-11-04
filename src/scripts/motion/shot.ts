import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setLandingResolver } from '@/scripts/landing';

export function landOnLabel(sceneId: string, timeline: gsap.core.Timeline, time: number): void {
  timeline.addLabel('landing', time);
  setLandingResolver(sceneId, () => timeline.scrollTrigger?.labelToScroll('landing') ?? 0);
}

export function holdUntilArrival(trackSelector: string, stageSelector: string): void {
  const track = document.querySelector<HTMLElement>(trackSelector);
  const stage = document.querySelector<HTMLElement>(stageSelector);
  if (!track || !stage) return;

  const arrive = (arrived: boolean): void => {
    gsap.set(stage, { opacity: arrived ? 1 : 0, pointerEvents: arrived ? 'auto' : 'none' });
  };

  arrive(false);
  ScrollTrigger.create({
    trigger: track,
    start: 'top top',
    end: 'max',
    onToggle: (self) => {
      arrive(self.isActive);
    },
  });
}
