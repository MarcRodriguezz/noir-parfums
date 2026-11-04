import type { Page } from '@playwright/test';

export const WIDTHS = [
  { width: 320, height: 640 },
  { width: 375, height: 667 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
] as const;

export const PAGE_END = 1_000_000;

export async function scrollToY(page: Page, y: number): Promise<void> {
  await page.evaluate((top) => {
    window.scrollTo({ top, behavior: 'instant' });
  }, y);
}

export async function scrollThrough(page: Page, steps = 8): Promise<void> {
  const max = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
  for (let step = 0; step <= steps; step += 1) {
    await scrollToY(page, Math.round((max * step) / steps));
    await page.waitForTimeout(120);
  }
}

export function horizontalOverflow(page: Page): Promise<number> {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
}

export function trackPosition(page: Page, selector: string): Promise<{ top: number; run: number }> {
  return page.evaluate((target) => {
    const element = document.querySelector(target);
    if (!element) throw new Error(`Missing ${target}`);
    const box = element.getBoundingClientRect();
    return { top: box.top + window.scrollY, run: box.height - window.innerHeight };
  }, selector);
}
