import { expect, test } from '@playwright/test';
import { scrollThrough } from './helpers';

test.use({ viewport: { width: 1440, height: 900 } });

test('every image loads, with explicit dimensions and modern formats', async ({ page }) => {
  await page.goto('/');
  await scrollThrough(page);
  await page.waitForLoadState('networkidle');

  const images = await page.locator('img').evaluateAll((elements) =>
    elements.map((element) => {
      const image = element as HTMLImageElement;
      return {
        loaded: image.complete && image.naturalWidth > 0,
        width: image.getAttribute('width'),
        height: image.getAttribute('height'),
        current: image.currentSrc,
      };
    }),
  );

  expect(images.length).toBeGreaterThanOrEqual(5);
  images.forEach((image) => {
    expect(image.loaded, image.current).toBe(true);
    expect(image.width).not.toBeNull();
    expect(image.height).not.toBeNull();
    expect(image.current).toMatch(/\.avif/);
  });
});

test('the hero image is loaded eagerly and later images lazily', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-reveal-photo] img')).toHaveAttribute('loading', 'eager');
  await expect(page.locator('[data-reveal-photo] img')).toHaveAttribute('fetchpriority', 'high');
  await expect(page.locator('[data-craft-figure] img')).toHaveAttribute('loading', 'lazy');
});

test('informative images describe themselves and repeats stay silent', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-reveal-photo] img')).toHaveAttribute('alt', /NOIR/);
  await expect(page.locator('[data-layer-reverse] img')).toHaveAttribute('alt', /reverse/);
  await expect(page.locator('[data-craft-figure] img')).toHaveAttribute('alt', /golden light/);
  await expect(page.locator('[data-essence-photo] img')).toHaveAttribute('alt', '');
});
