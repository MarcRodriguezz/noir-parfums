import { gsap } from 'gsap';
import { holdUntilArrival, landOnLabel } from './shot';

const CAMERA_OPENING = { scale: 1.34, y: '6%' };
const FIRST_NOTE_FULLY_VISIBLE = 1.65;

export function essenceCinema(): void {
  holdUntilArrival('.shot-track--essence', '.shot-track--essence > .shot-stage');
  const notes = gsap.utils.toArray<HTMLElement>('[data-note]');
  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: '.shot-track--essence',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
    },
  });

  gsap.set('[data-essence-photo]', CAMERA_OPENING);
  gsap.set('[data-essence-photo] [data-particles]', { opacity: 0 });
  gsap.set('.essence-intro', { opacity: 0 });
  gsap.set(notes, { opacity: 0, y: 36 });

  timeline
    .to(
      '[data-essence-photo]',
      { scale: 1, y: 0, xPercent: 20, duration: 1.1, ease: 'power2.inOut' },
      0,
    )
    .to('[data-essence-glow]', { opacity: 1, duration: 1 }, 0.3)
    .to('[data-essence-photo] [data-particles]', { opacity: 1, duration: 0.8 }, 0.4)
    .to('.essence-intro', { opacity: 1, duration: 0.5 }, 0.8);

  notes.forEach((note, index) => {
    const start = 1 + index * 1.25;
    timeline
      .to(note, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, start)
      .fromTo(
        note.querySelector('[data-note-numeral]'),
        { yPercent: -44 },
        { yPercent: -56, duration: 1.25 },
        start,
      )
      .to(note, { opacity: 0, y: -36, duration: 0.35, ease: 'power2.in' }, start + 0.9);
  });

  const closing = 1 + notes.length * 1.25;
  timeline
    .to('.essence-intro', { opacity: 0, duration: 0.3 }, closing - 0.3)
    .to('[data-essence-glow]', { opacity: 0, duration: 0.5 }, closing)
    .to('[data-essence-photo] [data-particles]', { opacity: 0, duration: 0.4 }, closing)
    .to(
      '[data-essence-photo]',
      { xPercent: 0, scale: 1, duration: 0.8, ease: 'power2.inOut' },
      closing,
    )
    .to({}, { duration: 0.25 });

  landOnLabel('essence', timeline, FIRST_NOTE_FULLY_VISIBLE);
}
