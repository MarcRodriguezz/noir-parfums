import { expect, test } from '@playwright/test';
import { horizontalOverflow, scrollThrough } from './helpers';

for (const size of [
  { width: 390, height: 844 },
  { width: 1440, height: 900 },
]) {
  test.describe(`reduced motion at ${size.width}px`, () => {
    test.use({ viewport: size, reducedMotion: 'reduce' });

    test('starts no animation system at all', async ({ page }) => {
      const scripts: string[] = [];
      page.on('request', (request) => {
        if (request.resourceType() === 'script') scripts.push(request.url());
      });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await expect(page.locator('html')).not.toHaveAttribute('data-motion');
      await expect(page.locator('[data-particles]')).not.toHaveAttribute('data-running');
      expect(scripts.filter((url) => /motion/.test(url))).toEqual([]);
    });

    test('shows all content immediately, without tall tracks', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('h1')).toBeVisible();
      for (const selector of [
        '[data-intro-photo]',
        '[data-note="top"]',
        '[data-note="base"]',
        '[data-word]',
      ]) {
        await expect(page.locator(selector).first()).toHaveCSS('opacity', '1');
      }
      const position = await page
        .locator('.essence')
        .evaluate((stage) => getComputedStyle(stage).position);
      expect(position).toBe('relative');
      await scrollThrough(page, 4);
      expect(await horizontalOverflow(page)).toBe(0);
    });

    test('shows the reverse photograph without the transition layers', async ({ page }) => {
      await page.goto('/#revelation');
      await expect(page.locator('[data-layer-reverse] img')).toBeVisible();
      await expect(page.locator('[data-layer-front]')).toBeHidden();
      await expect(page.locator('[data-shadow]')).toBeHidden();
    });
  });
}

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });

  test('all content is available and navigation is inline', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('[data-note="base"]')).toBeVisible();
    await expect(page.getByRole('heading', { name: /It says nothing/ })).toBeVisible();
    await expect(page.locator('[data-menu-toggle]')).toBeHidden();
    await expect(page.getByRole('navigation', { name: 'Main' }).getByRole('link')).toHaveCount(4);
    await expect(page.locator('[data-intro-photo]')).toHaveCSS('opacity', '1');
  });

  test('the reservation form still works', async ({ page }) => {
    await page.goto('/#finale');
    await page.getByRole('button', { name: 'Reserve your flacon' }).click();
    await expect(page).toHaveURL(/size=100$/);
    await expect(page.locator('h1')).toContainText('set aside');
  });
});
