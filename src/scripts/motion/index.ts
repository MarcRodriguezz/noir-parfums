import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motionQueries } from '@/lib/motion-profile';
import { clearLandingResolvers, resetLandingSettle, setLandingSettle } from '@/scripts/landing';
import { craft, finale, revealItems } from './editorial';
import { essenceCinema } from './essence';
import { revealCinema, revealHandheld } from './reveal';
import { revelationCinema, revelationHandheld } from './revelation';
import { startParticles } from './particles';
import { runWhenIdle } from './schedule';

export function startMotion(): () => void {
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: 'none' });
  ScrollTrigger.config({ ignoreMobileResize: true });

  const root = document.documentElement;
  const media = gsap.matchMedia();

  setLandingSettle(() => {
    ScrollTrigger.update();
    ScrollTrigger.getAll().forEach((trigger) => {
      const scrub = trigger.getTween() as gsap.core.Tween | 0 | undefined;
      if (scrub) scrub.progress(1);
    });
  });

  media.add(motionQueries.cinema, (context) => {
    root.dataset['motion'] = 'cinema';
    const stopReveal = revealCinema();
    const stopParticles = startParticles('cinema');
    const cancel = runWhenIdle(
      [
        essenceCinema,
        revelationCinema,
        craft,
        finale,
        () => {
          revealItems(
            '.revelation-details [data-reveal-item], .craft [data-reveal-item], .finale [data-reveal-item]',
          );
        },
      ],
      (step) => context.add(step),
    );
    return () => {
      cancel();
      stopReveal();
      stopParticles();
      clearLandingResolvers();
      delete root.dataset['motion'];
    };
  });

  media.add(motionQueries.handheld, (context) => {
    root.dataset['motion'] = 'handheld';
    revealHandheld();
    const stopParticles = startParticles('handheld');
    const cancel = runWhenIdle(
      [
        craft,
        finale,
        () => {
          revealItems('[data-reveal-item]');
        },
      ],
      (step) => context.add(step),
    );
    return () => {
      cancel();
      stopParticles();
      delete root.dataset['motion'];
    };
  });

  media.add(motionQueries.handheldTall, () => {
    revelationHandheld();
    return clearLandingResolvers;
  });

  if (document.fonts?.status !== 'loaded') {
    void document.fonts?.ready.then(() => {
      ScrollTrigger.refresh();
    });
  }

  return () => {
    resetLandingSettle();
    media.revert();
    ScrollTrigger.getAll().forEach((trigger) => {
      trigger.kill();
    });
  };
}
