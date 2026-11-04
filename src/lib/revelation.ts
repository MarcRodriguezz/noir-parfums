const BAND_TRAVEL_START = 110;
const BAND_TRAVEL_END = -110;

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function revealClipPath(progress: number): string {
  const hidden = (1 - clamp01(progress)) * 100;
  return `inset(0% 0% 0% ${hidden.toFixed(2)}%)`;
}

export function shadowBandPercent(progress: number): number {
  const p = clamp01(progress);
  return BAND_TRAVEL_START + (BAND_TRAVEL_END - BAND_TRAVEL_START) * p;
}
