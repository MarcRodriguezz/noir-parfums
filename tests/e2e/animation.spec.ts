import { expect, test, type Page } from '@playwright/test';
import { PAGE_END, scrollToY, trackPosition } from './helpers';

const SETTLE = 1000;

function wipeProgress(page: Page): Promise<number> {
  return page
    .locator('[data-layer-reverse]')
    .evaluate((layer) => Number((layer as HTMLElement).dataset['progress'] ?? 'NaN'));
}

test.describe('cinema profile', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('activates and plays the intro through to full opacity', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'cinema');
    await expect(page.locator('[data-intro-photo]')).toHaveCSS('opacity', '1', { timeout: 5000 });
    await expect(page.locator('h1')).toBeVisible();
  });

  test('holds the stage in place while its track scrolls', async ({ page }) => {
    await page.goto('/');
    const track = await trackPosition(page, '.shot-track--essence');
    expect(track.run).toBeGreaterThan(2000);
    await scrollToY(page, track.top + track.run / 2);
    await page.waitForTimeout(SETTLE);
    const top = await page
      .locator('.shot-track--essence > .shot-stage')
      .evaluate((stage) => stage.getBoundingClientRect().top);
    expect(top).toBe(0);
  });

  test('walks through the olfactive notes one at a time and back', async ({ page }) => {
    await page.goto('/');
    const track = await trackPosition(page, '.shot-track--essence');
    const opacity = (id: string): Promise<number> =>
      page
        .locator(`[data-note="${id}"]`)
        .evaluate((note) => Number(getComputedStyle(note).opacity));
    const at = async (fraction: number): Promise<void> => {
      await scrollToY(page, track.top + track.run * fraction);
      await page.waitForTimeout(SETTLE);
    };

    await at(0.33);
    expect(await opacity('top')).toBeGreaterThan(0.9);
    expect(await opacity('heart')).toBeLessThan(0.1);

    await at(0.74);
    expect(await opacity('base')).toBeGreaterThan(0.9);
    expect(await opacity('top')).toBeLessThan(0.1);

    await at(0.33);
    expect(await opacity('top')).toBeGreaterThan(0.9);
    expect(await opacity('base')).toBeLessThan(0.1);
  });

  test('the next stage stays invisible until its frame matches', async ({ page }) => {
    await page.goto('/');
    const track = await trackPosition(page, '.shot-track--essence');
    const stageOpacity = (): Promise<number> =>
      page
        .locator('.shot-track--essence > .shot-stage')
        .evaluate((stage) => Number(getComputedStyle(stage).opacity));

    await scrollToY(page, track.top - 200);
    await page.waitForTimeout(300);
    expect(await stageOpacity()).toBe(0);

    await scrollToY(page, track.top + 5);
    await page.waitForTimeout(300);
    expect(await stageOpacity()).toBe(1);
  });

  test('the front to reverse transition is driven by scroll and reversible', async ({ page }) => {
    await page.goto('/');
    const track = await trackPosition(page, '.shot-track--revelation');

    await scrollToY(page, track.top + 5);
    await page.waitForTimeout(SETTLE);
    expect(await wipeProgress(page)).toBe(0);

    await scrollToY(page, track.top + track.run * 0.42);
    await page.waitForTimeout(SETTLE);
    const middle = await wipeProgress(page);
    expect(middle).toBeGreaterThan(0.1);
    expect(middle).toBeLessThan(0.9);

    await scrollToY(page, track.top + track.run);
    await page.waitForTimeout(SETTLE);
    expect(await wipeProgress(page)).toBe(1);
    await expect(page.locator('[data-revelation-heading]')).toHaveCSS('opacity', '1');

    await scrollToY(page, track.top + 5);
    await page.waitForTimeout(SETTLE);
    expect(await wipeProgress(page)).toBe(0);
  });

  test('particles only run while their canvas is on screen', async ({ page }) => {
    await page.goto('/');
    const canvas = page.locator('[data-particles]');
    await expect(canvas).toHaveAttribute('data-count', '60');
    const track = await trackPosition(page, '.shot-track--essence');
    await scrollToY(page, track.top + track.run / 2);
    await expect(canvas).toHaveAttribute('data-running', 'true');
    await scrollToY(page, PAGE_END);
    await expect(canvas).toHaveAttribute('data-running', 'false');
  });

  test('resizing across profiles tears down and rebuilds the motion', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'cinema');
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'handheld');
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'cinema');
    expect(errors).toEqual([]);
  });
});

test.describe('handheld profile', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test('keeps only one short held track, for the reverse transition', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'handheld');
    const essence = await page
      .locator('.essence')
      .evaluate((stage) => getComputedStyle(stage).position);
    expect(essence).toBe('relative');
    const track = await trackPosition(page, '.shot-track--revelation');
    expect(track.run).toBeLessThanOrEqual(844 * 1.2);
  });

  test('keeps the notes readable in normal flow', async ({ page }) => {
    await page.goto('/#essence');
    const note = page.locator('[data-note="heart"]');
    await note.scrollIntoViewIfNeeded();
    await expect(note).toBeInViewport();
    await expect(note).toHaveCSS('opacity', '1', { timeout: 4000 });
  });

  test('runs the reverse transition', async ({ page }) => {
    await page.goto('/');
    const track = await trackPosition(page, '.shot-track--revelation');
    await scrollToY(page, track.top + track.run);
    await page.waitForTimeout(SETTLE);
    expect(await wipeProgress(page)).toBe(1);
  });
});
