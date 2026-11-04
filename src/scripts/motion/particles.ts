import { particleCount, type MotionProfile } from '@/lib/motion-profile';
import { createParticle, stepParticle, type Bounds } from '@/lib/particles';

const MAX_PIXEL_RATIO = 1.5;
const MAX_FRAME_SECONDS = 0.05;

export function startParticles(profile: MotionProfile): () => void {
  const canvas = document.querySelector<HTMLCanvasElement>('[data-particles]');
  const context = canvas?.getContext('2d');
  if (!canvas || !context) return () => undefined;

  const bounds: Bounds = { width: 0, height: 0 };
  let particles = [] as ReturnType<typeof createParticle>[];
  let frame = 0;
  let lastTime = 0;
  let visible = false;

  const resize = (): void => {
    const ratio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
    bounds.width = canvas.clientWidth;
    bounds.height = canvas.clientHeight;
    canvas.width = Math.round(bounds.width * ratio);
    canvas.height = Math.round(bounds.height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = particleCount(bounds.width, profile);
    particles = Array.from({ length: count }, () => createParticle(bounds));
    canvas.dataset['count'] = String(count);
  };

  const draw = (time: number): void => {
    const delta = Math.min((time - lastTime) / 1000, MAX_FRAME_SECONDS);
    lastTime = time;
    context.clearRect(0, 0, bounds.width, bounds.height);
    context.fillStyle = '#d9b985';
    for (const particle of particles) {
      stepParticle(particle, delta, bounds);
      context.globalAlpha = particle.alpha;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();
    }
    frame = requestAnimationFrame(draw);
  };

  const sync = (): void => {
    cancelAnimationFrame(frame);
    canvas.dataset['running'] = String(visible && !document.hidden);
    if (visible && !document.hidden) {
      lastTime = performance.now();
      frame = requestAnimationFrame(draw);
    }
  };

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? false;
    sync();
  });
  const resizeObserver = new ResizeObserver(resize);

  resize();
  observer.observe(canvas);
  resizeObserver.observe(canvas);
  document.addEventListener('visibilitychange', sync);

  return () => {
    cancelAnimationFrame(frame);
    observer.disconnect();
    resizeObserver.disconnect();
    document.removeEventListener('visibilitychange', sync);
    context.clearRect(0, 0, bounds.width, bounds.height);
    delete canvas.dataset['running'];
  };
}
