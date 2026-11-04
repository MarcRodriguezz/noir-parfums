export interface Particle {
  x: number;
  y: number;
  radius: number;
  speed: number;
  phase: number;
  alpha: number;
}

export interface Bounds {
  width: number;
  height: number;
}

export type Random = () => number;

export function createParticle(bounds: Bounds, random: Random = Math.random): Particle {
  const depth = random();
  return {
    x: random() * bounds.width,
    y: random() * bounds.height,
    radius: 0.5 + depth * 1.4,
    speed: 6 + depth * 18,
    phase: random() * Math.PI * 2,
    alpha: 0.15 + depth * 0.55,
  };
}

export function stepParticle(
  particle: Particle,
  deltaSeconds: number,
  bounds: Bounds,
  random: Random = Math.random,
): void {
  particle.y -= particle.speed * deltaSeconds;
  particle.phase += deltaSeconds * 0.6;
  particle.x += Math.sin(particle.phase) * 4 * deltaSeconds;

  if (particle.y < -4) {
    particle.y = bounds.height + 4;
    particle.x = random() * bounds.width;
  }
  if (particle.x < -4) particle.x = bounds.width + 4;
  if (particle.x > bounds.width + 4) particle.x = -4;
}
