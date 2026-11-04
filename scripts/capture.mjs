import { mkdirSync } from 'node:fs';
import { chromium } from '@playwright/test';

const baseUrl = process.env.BASE_URL ?? 'http://localhost:4321';
const outputDir = process.argv[2] ?? 'screenshots';
const widths = (process.argv[3] ?? '1440').split(',').map(Number);

mkdirSync(outputDir, { recursive: true });
const browser = await chromium.launch();

for (const width of widths) {
  const height =
    width < 768
      ? Math.round(width * 2.1)
      : width < 1024
        ? Math.round(width * 1.33)
        : Math.round(width * 0.62);
  const page = await browser.newPage({ viewport: { width, height } });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto(baseUrl, { waitUntil: 'load' });
  await page.waitForTimeout(3600);
  const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  const max = scrollHeight - height;
  const steps = Number(process.env.STEPS ?? 16);
  for (let step = 0; step <= steps; step += 1) {
    const y = Math.round((max * step) / steps);
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: `${outputDir}/w${width}-${String(step).padStart(2, '0')}.jpg`,
      type: 'jpeg',
      quality: 60,
    });
  }
  console.log(width, 'height', scrollHeight, 'errors', errors.length ? errors : 'none');
  await page.close();
}

await browser.close();
