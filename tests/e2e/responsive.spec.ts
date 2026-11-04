import { expect, test } from '@playwright/test';
import { WIDTHS, horizontalOverflow, scrollThrough, scrollToY } from './helpers';

for (const size of [...WIDTHS, { width: 844, height: 390 }, { width: 667, height: 375 }]) {
  test.describe(`${size.width}x${size.height}`, () => {
    test.use({ viewport: size });

    test('never overflows horizontally and keeps the console clean', async ({ page }) => {
      const problems: string[] = [];
      page.on('pageerror', (error) => problems.push(error.message));
      page.on('console', (message) => {
        if (message.type() === 'error') problems.push(message.text());
      });
      await page.goto('/');
      expect(await horizontalOverflow(page)).toBe(0);
      await scrollThrough(page);
      expect(await horizontalOverflow(page)).toBe(0);
      expect(problems).toEqual([]);
    });

    test('keeps the hero bottle and title inside the first screen', async ({ page }) => {
      await page.goto('/');
      await page.waitForTimeout(3000);
      const title = await page.locator('h1').boundingBox();
      const photo = await page.locator('[data-reveal-photo]').boundingBox();
      if (!title || !photo) throw new Error('Hero is not rendered');
      expect(title.x).toBeGreaterThanOrEqual(0);
      expect(title.x + title.width).toBeLessThanOrEqual(size.width);
      expect(title.y + title.height).toBeLessThanOrEqual(size.height + 1);
      expect(photo.height).toBeGreaterThan(150);
    });

    test('offers touch targets of at least 44 px', async ({ page }) => {
      await page.goto('/');
      const selectors = ['.wordmark', '.scroll-cue', '.material summary', '.edition', '.button'];
      selectors.push(size.width < 768 ? '[data-menu-toggle]' : '[data-nav-link]');
      for (const selector of selectors) {
        const heights = await page
          .locator(selector)
          .evaluateAll((elements) =>
            elements.map((element) => element.getBoundingClientRect().height),
          );
        expect(heights.length, selector).toBeGreaterThan(0);
        heights.forEach((height) => {
          expect(height, selector).toBeGreaterThanOrEqual(44);
        });
      }
    });
  });
}

for (const size of [
  { width: 390, height: 844 },
  { width: 1440, height: 900 },
]) {
  test.describe(`enlarged text at ${size.width}px`, () => {
    test.use({ viewport: size });

    test('keeps the page free of horizontal overflow at 200% font size', async ({ page }) => {
      await page.goto('/');
      await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
      await scrollThrough(page, 5);
      expect(await horizontalOverflow(page)).toBe(0);
    });
  });
}

test.describe('browser zoom', () => {
  test('falls back to the handheld profile on a short effective viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 500 });
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'handheld');
    await scrollToY(page, 800);
    expect(await horizontalOverflow(page)).toBe(0);
  });
});
