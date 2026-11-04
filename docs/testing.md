# Testing

## Running the tests

```bash
npx playwright install chromium   # first run only
npm run verify
```

`verify` runs type checks, linting, formatting, unit tests, the build and browser tests. Browser tests run against `dist/`, so run `npm run build` first when you run `npm run test:e2e` alone.

CI runs the same checks on every push to `main` and on every pull request.

## Test layers

| Layer         | Tool             | Coverage                                         |
| ------------- | ---------------- | ------------------------------------------------ |
| Types         | `astro check`    | Strict TypeScript in `.ts` and `.astro` files    |
| Style         | ESLint, Prettier | TypeScript and Astro rules, formatting           |
| Unit          | Vitest           | Prices, reservations, animation math, content    |
| Browser       | Playwright       | Real behavior in Chromium against the built site |
| Accessibility | axe              | Automatable WCAG 2.2 A and AA rules              |

## Browser test suites

| File                     | Checks                                                                              |
| ------------------------ | ----------------------------------------------------------------------------------- |
| `navigation.spec.ts`     | Routes, 404, link transitions, active link, reservation, materials, header backdrop |
| `mobile-menu.spec.ts`    | Touch opening, background lock, Escape, focus return                                |
| `responsive.spec.ts`     | Overflow, console errors and touch targets at each size; text at 200%               |
| `images.spec.ts`         | Loading, dimensions, format, priority and alt text                                  |
| `animation.spec.ts`      | Profiles, holds, notes, scene handoff, reversibility, particles, resizing           |
| `reduced-motion.spec.ts` | No animation download, visible content, working without JavaScript                  |
| `accessibility.spec.ts`  | axe on each page and open menu, skip link, focus, heading hierarchy                 |

Viewports: 320×640, 375×667, 390×844, 768×1024, 1024×768, 1440×900, 1920×1080, 844×390 and 667×375.

## Visual review

Tests do not judge aesthetics. With the preview server running, this saves screenshots at the given widths:

```bash
npm run preview
node scripts/capture.mjs screenshots 390,768,1440
```

## Performance

Measure Lighthouse against the deployed site, not `astro preview`, which does not compress responses. Scores vary between runs, so compare several runs before and after a change.

```bash
npx lighthouse https://noir-parfums.pages.dev --view
```

## Known gaps

- Only Chromium is automated. In Safari and Firefox, check `svh`, `mask-composite` and `position: sticky` first.
- Touch emulation does not cover the dynamic address bar or real safe areas.
- axe does not evaluate contrast on every frame of an animation.
- Screen readers have not been tested.
- Browser zoom is approximated with a reduced viewport.
