import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

test.describe('mobile menu', () => {
  test('is closed and out of the focus order at first', async ({ page }) => {
    await page.goto('/');
    const toggle = page.getByRole('button', { name: 'Menu' });
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(page.getByRole('navigation', { name: 'Main' })).toBeHidden();
  });

  test('opens, locks the page behind it and closes with Escape', async ({ page }) => {
    await page.goto('/');
    const toggle = page.locator('[data-menu-toggle]');
    await toggle.tap();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(toggle).toHaveText(/Close/);
    await expect(page.getByRole('navigation', { name: 'Main' }).getByRole('link')).toHaveCount(4);
    expect(await page.locator('main').evaluate((main) => (main as HTMLElement).inert)).toBe(true);
    await expect(page.locator('html')).toHaveClass(/menu-open/);

    await page.keyboard.press('Escape');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toBeFocused();
    expect(await page.locator('main').evaluate((main) => (main as HTMLElement).inert)).toBe(false);
  });

  test('closes and travels when a link is tapped', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Menu' }).tap();
    await page
      .getByRole('navigation', { name: 'Main' })
      .getByRole('link', { name: 'The Craft' })
      .tap();
    await expect(page).toHaveURL(/#craft$/);
    await expect(page.getByRole('navigation', { name: 'Main' })).toBeHidden();
    await expect(page.locator('html')).not.toHaveClass(/menu-open/);
    await expect(page.locator('#craft h2')).toBeInViewport({ timeout: 8000 });
  });

  test('is replaced by inline links on wider screens', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/');
    await expect(page.locator('[data-menu-toggle]')).toBeHidden();
    await expect(page.getByRole('navigation', { name: 'Main' }).getByRole('link')).toHaveCount(4);
  });
});
