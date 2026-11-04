import { describe, expect, it } from 'vitest';
import { motionQueries, particleCount } from '@/lib/motion-profile';
import { createParticle, stepParticle } from '@/lib/particles';
import { revealClipPath, shadowBandPercent } from '@/lib/revelation';

const bounds = { width: 400, height: 300 };

describe('revelation wipe', () => {
  it('starts fully hidden and ends fully revealed', () => {
    expect(revealClipPath(0)).toBe('inset(0% 0% 0% 100.00%)');
    expect(revealClipPath(1)).toBe('inset(0% 0% 0% 0.00%)');
  });

  it('clamps progress outside the range', () => {
    expect(revealClipPath(-1)).toBe(revealClipPath(0));
    expect(revealClipPath(2)).toBe(revealClipPath(1));
  });

  it('keeps the shadow band off screen at both ends and centred halfway', () => {
    expect(shadowBandPercent(0)).toBeGreaterThanOrEqual(100);
    expect(shadowBandPercent(1)).toBeLessThanOrEqual(-100);
    expect(shadowBandPercent(0.5)).toBeCloseTo(0);
  });
});

describe('particles', () => {
  it('spawns inside the bounds', () => {
    for (let i = 0; i < 50; i += 1) {
      const particle = createParticle(bounds);
      expect(particle.x).toBeGreaterThanOrEqual(0);
      expect(particle.x).toBeLessThanOrEqual(bounds.width);
      expect(particle.y).toBeGreaterThanOrEqual(0);
      expect(particle.y).toBeLessThanOrEqual(bounds.height);
    }
  });

  it('rises over time', () => {
    const particle = createParticle(bounds, () => 0.5);
    const before = particle.y;
    stepParticle(particle, 0.1, bounds, () => 0.5);
    expect(particle.y).toBeLessThan(before);
  });

  it('wraps back to the bottom after leaving the top', () => {
    const particle = createParticle(bounds, () => 0.5);
    particle.y = -5;
    stepParticle(particle, 0.016, bounds, () => 0.25);
    expect(particle.y).toBe(bounds.height + 4);
    expect(particle.x).toBe(100);
  });
});

describe('motion profile', () => {
  it('uses far fewer particles on handheld than on cinema', () => {
    expect(particleCount(390, 'handheld')).toBe(18);
    expect(particleCount(768, 'handheld')).toBe(28);
    expect(particleCount(1440, 'cinema')).toBe(60);
  });

  it('caps particles on very wide screens', () => {
    expect(particleCount(3840, 'cinema')).toBe(70);
  });

  it('never animates under reduced motion', () => {
    Object.values(motionQueries).forEach((query) => {
      query.split(',').forEach((branch) => {
        expect(branch).toContain('(prefers-reduced-motion: no-preference)');
      });
    });
  });
});
