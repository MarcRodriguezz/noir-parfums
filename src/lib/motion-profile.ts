const MOTION_OK = '(prefers-reduced-motion: no-preference)';

export const motionQueries = {
  cinema: `${MOTION_OK} and (min-width: 64rem) and (min-height: 37.5rem)`,
  handheld: `${MOTION_OK} and (max-width: 63.99rem), ${MOTION_OK} and (max-height: 37.49rem)`,
  handheldTall: `${MOTION_OK} and (max-width: 63.99rem) and (min-height: 35rem)`,
} as const;

export type MotionProfile = 'cinema' | 'handheld';

export function particleCount(width: number, profile: MotionProfile): number {
  if (profile === 'handheld') return width < 480 ? 18 : 28;
  return Math.min(70, Math.round(width / 24));
}
