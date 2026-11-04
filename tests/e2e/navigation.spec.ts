import { expect, test, type Page } from '@playwright/test';

test.describe('routes', () => {
  test('home exposes the product and one main heading', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/NOIR Nº 01 — OBSIDIAN/);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toContainText('Beyond');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /fictional/);
    await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', '/favicon.svg');
  });

  test('unknown paths answer with the 404 page', async ({ page }) => {
    const response = await page.goto('/no-such-page');
    expect(response?.status()).toBe(404);
    await expect(page.locator('h1')).toContainText('evaporated');
    await page.getByRole('link', { name: 'Return to the house' }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test('the fictional brand notice is present in the footer', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-disclaimer]')).toContainText('fictional house');
  });
});

test.describe('desktop navigation', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  for (const [label, id] of [
    ['The Essence', 'essence'],
    ['The Revelation', 'revelation'],
    ['The Craft', 'craft'],
    ['Reserve', 'finale'],
  ] as const) {
    test(`${label} scrolls to its scene and marks itself current`, async ({ page }) => {
      await page.goto('/');
      const link = page
        .getByRole('navigation', { name: 'Main' })
        .getByRole('link', { name: label });
      await link.click();
      await expect(page).toHaveURL(new RegExp(`#${id}$`));
      await expect(link).toHaveAttribute('aria-current', 'true', { timeout: 10_000 });
      await expect
        .poll(() =>
          page.evaluate(
            (target) => document.getElementById(target)?.getBoundingClientRect().top ?? Infinity,
            id,
          ),
        )
        .toBeLessThanOrEqual(1);
    });
  }

  test('only one navigation link is current at a time', async ({ page }) => {
    await page.goto('/#revelation');
    await page.waitForTimeout(600);
    await expect(page.locator('[data-nav-link][aria-current="true"]')).toHaveCount(1);
  });
});

const readableText = (page: Page, selector: string): Promise<boolean> =>
  page.evaluate((target) => {
    const element = document.querySelector(target);
    if (!element) return false;
    let opacity = 1;
    for (let node: Element | null = element; node; node = node.parentElement) {
      opacity *= Number(getComputedStyle(node).opacity);
    }
    const box = element.getBoundingClientRect();
    const header = document.querySelector('.site-header')?.getBoundingClientRect().bottom ?? 0;
    return (
      opacity > 0.9 && box.top >= header - 1 && box.bottom <= window.innerHeight && box.height > 0
    );
  }, selector);

test.describe('links land on the frame that shows the text', () => {
  const SCENES = [
    { label: 'The Essence', id: 'essence', text: '#essence-title' },
    { label: 'The Revelation', id: 'revelation', text: '#revelation-title' },
    { label: 'The Craft', id: 'craft', text: '#craft-title' },
    { label: 'Reserve', id: 'finale', text: '#finale-title' },
  ] as const;

  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 1024, height: 768 },
    { width: 768, height: 1024 },
    { width: 390, height: 844 },
    { width: 844, height: 390 },
  ]) {
    test.describe(`at ${viewport.width}x${viewport.height}`, () => {
      test.use({ viewport });

      for (const scene of SCENES) {
        test(`${scene.label} shows its text`, async ({ page }) => {
          await page.goto('/');
          await page.waitForTimeout(1500);
          const toggle = page.locator('[data-menu-toggle]');
          if (await toggle.isVisible()) await toggle.click();
          await page
            .getByRole('navigation', { name: 'Main' })
            .getByRole('link', { name: scene.label })
            .click();
          await expect(page).toHaveURL(new RegExp(`#${scene.id}$`));
          await expect.poll(() => readableText(page, scene.text), { timeout: 5000 }).toBe(true);
        });
      }
    });
  }

  test.describe('on desktop', () => {
    test.use({ viewport: { width: 1440, height: 900 } });

    test('the jump arrives on the final frame at once, without errors', async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto('/');
      await page.waitForTimeout(1500);

      const atClick = await page.evaluate(() => {
        const link = document.querySelector<HTMLAnchorElement>(
          '[data-nav-link][href="#revelation"]',
        );
        const reverse = document.querySelector<HTMLElement>('[data-layer-reverse]');
        link?.click();
        return {
          wipe: Number(reverse?.dataset['progress']),
          focused: document.activeElement?.id,
        };
      });

      expect(atClick.wipe).toBeGreaterThan(0.99);
      expect(atClick.focused).toBe('revelation');
      expect(errors).toEqual([]);
    });

    test('the essence link opens on the first note', async ({ page }) => {
      await page.goto('/');
      await page.waitForTimeout(1500);
      await page.getByRole('link', { name: 'The Essence' }).first().click();
      await expect.poll(() => readableText(page, '[data-note] h3')).toBe(true);
    });

    test('the revelation link opens with the reverse fully shown', async ({ page }) => {
      await page.goto('/');
      await page.waitForTimeout(1500);
      await page.getByRole('link', { name: 'The Revelation' }).first().click();
      await expect
        .poll(() =>
          page
            .locator('[data-layer-reverse]')
            .evaluate((layer) => Number((layer as HTMLElement).dataset['progress'])),
        )
        .toBeGreaterThan(0.99);
    });

    test('a shared link opens on the same frame as a click', async ({ page }) => {
      await page.goto('/#essence');
      await expect.poll(() => readableText(page, '[data-note] h3'), { timeout: 8000 }).toBe(true);
    });

    test('a link jumps back from a later scene', async ({ page }) => {
      await page.goto('/#finale');
      await page.waitForTimeout(1500);
      await page.getByRole('link', { name: 'The Revelation' }).first().click();
      await expect.poll(() => readableText(page, '#revelation-title')).toBe(true);
    });
  });

  test.describe('with reduced motion', () => {
    test.use({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });

    for (const scene of SCENES) {
      test(`${scene.label} shows its text`, async ({ page }) => {
        await page.goto('/');
        await page.getByRole('link', { name: scene.label }).first().click();
        await expect.poll(() => readableText(page, scene.text)).toBe(true);
      });
    }
  });
});

test.describe('reservation call to action', () => {
  test('submits the chosen edition to the confirmation page', async ({ page }) => {
    await page.goto('/#finale');
    await page.getByRole('radio', { name: /50 ml/ }).check({ force: true });
    await page.getByRole('button', { name: 'Reserve your flacon' }).click();
    await expect(page).toHaveURL(/\/reserved\/?\?size=50$/);
    await expect(page.locator('h1')).toContainText('set aside: 50 ml.');
    await expect(page.getByText('nothing has been ordered')).toBeVisible();
  });

  test('defaults to the 100 ml edition', async ({ page }) => {
    await page.goto('/#finale');
    await expect(page.getByRole('radio', { name: /100 ml/ })).toBeChecked();
  });

  test('ignores a forged size on the confirmation page', async ({ page }) => {
    await page.goto('/reserved/?size=<b>999</b>');
    await expect(page.locator('h1')).toHaveText(/set aside\.$/);
  });
});

test.describe('craft materials', () => {
  test('open and close from the keyboard', async ({ page }) => {
    await page.goto('/#craft');
    const glass = page.locator('details.material').first();
    await glass.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(glass).toHaveAttribute('open', '');
    await expect(glass.locator('.material__detail')).toBeVisible();
    await page.keyboard.press('Enter');
    await expect(glass).not.toHaveAttribute('open', '');
  });
});

test.describe('header backdrop', () => {
  const backdropOpacity = (page: Page): Promise<number> =>
    page
      .locator('.site-header')
      .evaluate((header) => Number(getComputedStyle(header, '::before').opacity));

  test.describe('on desktop', () => {
    test.use({ viewport: { width: 1440, height: 900 } });

    test('stays clear over cinematic scenes and turns solid over editorial text', async ({
      page,
    }) => {
      await page.goto('/');
      expect(await backdropOpacity(page)).toBe(0);

      await page.goto('/#essence');
      await page.waitForTimeout(1000);
      expect(await backdropOpacity(page)).toBe(0);

      await page.goto('/#craft');
      await expect.poll(() => backdropOpacity(page), { timeout: 10_000 }).toBeGreaterThan(0.9);
    });
  });

  test.describe('on mobile', () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test('turns solid as soon as the text scrolls beneath it', async ({ page }) => {
      await page.goto('/');
      expect(await backdropOpacity(page)).toBe(0);
      await page.goto('/#essence');
      await expect.poll(() => backdropOpacity(page), { timeout: 10_000 }).toBeGreaterThan(0.9);
    });
  });
});
