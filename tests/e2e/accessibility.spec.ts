import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const WCAG = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

for (const path of ['/', '/reserved/?size=100', '/no-such-page']) {
  for (const size of [
    { width: 390, height: 844 },
    { width: 1440, height: 900 },
  ]) {
    test.describe(`${path} at ${size.width}px`, () => {
      test.use({ viewport: size, reducedMotion: 'reduce' });

      test('has no detectable WCAG violations', async ({ page }) => {
        await page.goto(path);
        const results = await new AxeBuilder({ page }).withTags(WCAG).analyze();
        expect(results.violations).toEqual([]);
      });
    });
  }
}

test.describe('animated state', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('keeps structure valid with motion on', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(3000);
    const results = await new AxeBuilder({ page })
      .withTags(WCAG)
      .disableRules(['color-contrast'])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('keeps scene content that is not yet shown in the accessibility tree', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'The hour after' })).toHaveCount(1);
    await expect(page.getByRole('heading', { name: /It says nothing/ })).toHaveCount(1);
  });
});

test.describe('open mobile menu', () => {
  test.use({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });

  test('has no detectable WCAG violations', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Menu' }).click();
    const results = await new AxeBuilder({ page }).withTags(WCAG).analyze();
    expect(results.violations).toEqual([]);
  });
});

test.describe('keyboard', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('the first tab stop is a visible skip link that moves focus to main', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to content' });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#main$/);
  });

  test('focus is visibly outlined', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    const outline = await page.evaluate(() => {
      const active = document.activeElement;
      return active ? getComputedStyle(active).outlineStyle : 'none';
    });
    expect(outline).toBe('solid');
  });

  test('heading levels never skip', async ({ page }) => {
    await page.goto('/');
    const levels = await page
      .locator('h1, h2, h3, h4')
      .evaluateAll((headings) => headings.map((heading) => Number(heading.tagName[1])));
    expect(levels[0]).toBe(1);
    levels.slice(1).forEach((level, index) => {
      expect(level - (levels[index] ?? 0)).toBeLessThanOrEqual(1);
    });
  });
});
