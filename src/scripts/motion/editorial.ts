import { gsap } from 'gsap';

export function revealItems(selector: string): void {
  gsap.utils.toArray<HTMLElement>(selector).forEach((item) => {
    gsap.from(item, {
      opacity: 0,
      y: 28,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 88%',
        toggleActions: 'play none none reverse',
      },
    });
  });
}

export function craft(): void {
  gsap.fromTo(
    '[data-word]',
    { opacity: 0.42 },
    {
      opacity: 1,
      stagger: 0.08,
      scrollTrigger: {
        trigger: '[data-words]',
        start: 'top 82%',
        end: 'bottom 48%',
        scrub: 0.4,
      },
    },
  );

  gsap.fromTo(
    '[data-craft-figure]',
    { clipPath: 'inset(12% 8% 12% 8%)' },
    {
      clipPath: 'inset(0% 0% 0% 0%)',
      scrollTrigger: {
        trigger: '[data-craft-figure]',
        start: 'top 92%',
        end: 'top 40%',
        scrub: 0.4,
      },
    },
  );

  gsap.fromTo(
    '[data-craft-parallax]',
    { yPercent: -5 },
    {
      yPercent: 5,
      scrollTrigger: {
        trigger: '[data-craft-figure]',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    },
  );
}

export function finale(): void {
  gsap
    .timeline({
      scrollTrigger: {
        trigger: '#finale',
        start: 'top 75%',
        end: 'top 5%',
        scrub: 0.6,
      },
    })
    .fromTo('[data-finale-glow]', { opacity: 0 }, { opacity: 1 }, 0)
    .fromTo('[data-finale-photo]', { scale: 0.9 }, { scale: 1 }, 0);

  gsap.from('[data-finale-name] .mask-line > span', {
    yPercent: 110,
    duration: 1.4,
    ease: 'power4.out',
    scrollTrigger: {
      trigger: '[data-finale-name]',
      start: 'top 92%',
      toggleActions: 'play none none reverse',
    },
  });
}
