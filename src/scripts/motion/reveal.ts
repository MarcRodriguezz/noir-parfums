import { gsap } from 'gsap';

function playIntro(): gsap.core.Timeline {
  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });

  intro
    .fromTo(
      '[data-reveal-glow]',
      { opacity: 0 },
      { opacity: 1, duration: 2.2, ease: 'sine.out' },
      0,
    )
    .fromTo(
      '[data-intro-photo]',
      { opacity: 0, scale: 1.06 },
      { opacity: 1, scale: 1, duration: 2.4 },
      0.2,
    )
    .fromTo(
      '[data-intro] > span',
      { yPercent: 110, y: 0 },
      { yPercent: 0, y: 0, duration: 1.3, stagger: 0.14 },
      0.9,
    )
    .fromTo('[data-intro-fade]', { opacity: 0 }, { opacity: 1, duration: 1.2 }, 1.5)
    .fromTo(
      '[data-sweep]',
      { xPercent: -320, opacity: 0.9 },
      { xPercent: 150, opacity: 0.9, duration: 2.1, ease: 'sine.inOut' },
      1.1,
    )
    .set('[data-sweep]', { opacity: 0 });

  return intro;
}

function followPointer(): () => void {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return () => undefined;

  const stage = document.querySelector<HTMLElement>('[data-scene="reveal"] [data-stage]');
  if (!stage) return () => undefined;

  const glowX = gsap.quickTo('[data-reveal-glow]', 'x', { duration: 1.4, ease: 'power2.out' });
  const glowY = gsap.quickTo('[data-reveal-glow]', 'y', { duration: 1.4, ease: 'power2.out' });
  const copyX = gsap.quickTo('.reveal-title', 'x', { duration: 1.8, ease: 'power2.out' });

  const onMove = (event: PointerEvent): void => {
    const offsetX = event.clientX / window.innerWidth - 0.5;
    const offsetY = event.clientY / window.innerHeight - 0.5;
    glowX(offsetX * 70);
    glowY(offsetY * 40);
    copyX(offsetX * -14);
  };

  stage.addEventListener('pointermove', onMove, { passive: true });
  return () => {
    stage.removeEventListener('pointermove', onMove);
  };
}

export function revealCinema(): () => void {
  playIntro();

  gsap
    .timeline({
      scrollTrigger: {
        trigger: '.shot-track--reveal',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
      },
    })
    .to('[data-reveal-photo]', { scale: 1.34, y: '6%', ease: 'power1.in', duration: 1 }, 0)
    .to('[data-reveal-glow]', { opacity: 0, duration: 0.8 }, 0)
    .to('[data-reveal-copy]', { opacity: 0, duration: 0.45 }, 0)
    .to({}, { duration: 0.15 });

  return followPointer();
}

export function revealHandheld(): void {
  playIntro();

  gsap.to('[data-reveal-photo]', {
    scale: 1.12,
    scrollTrigger: {
      trigger: '#reveal',
      start: 'top top',
      end: 'bottom top',
      scrub: 0.4,
    },
  });
}
