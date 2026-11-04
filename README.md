# NOIR PARFUMS

A prototype of a cinematic, scroll-driven product landing page for NOIR Nº 01 — OBSIDIAN, a fictional luxury perfume.

**[Live demo](https://noir-parfums.pages.dev)**

> NOIR PARFUMS is an invented brand. Nothing is sold and no personal data is collected.

## Features

- Continuous scroll-driven shot across the first three scenes, with no visible cuts
- Separate motion profiles for desktop and touch devices
- Complete content without JavaScript or with reduced motion
- Responsive from 320 px, including landscape phones
- WCAG 2.2 AA checks with axe
- Static output with no backend, cookies or third-party requests

## Tech stack

| Area      | Tools                             |
| --------- | --------------------------------- |
| Framework | Astro (static output), TypeScript |
| Styling   | Tailwind CSS, custom CSS          |
| Animation | GSAP, ScrollTrigger, Canvas 2D    |
| Testing   | Vitest, Playwright, axe           |
| Quality   | ESLint, Prettier, GitHub Actions  |
| Hosting   | Cloudflare Pages                  |

## Getting started

Requires Node.js 22.23.4 or later. `.nvmrc` pins the version used in CI.

```bash
npm ci
npm run dev
```

The site runs at http://localhost:4321.

## Scripts

| Command                | Description                          |
| ---------------------- | ------------------------------------ |
| `npm run dev`          | Start the development server         |
| `npm run build`        | Build the static site into `dist/`   |
| `npm run preview`      | Serve `dist/`                        |
| `npm run typecheck`    | Check types                          |
| `npm run lint`         | Run ESLint                           |
| `npm run format`       | Format the code with Prettier        |
| `npm run format:check` | Check formatting                     |
| `npm run test`         | Run unit tests                       |
| `npm run test:e2e`     | Run browser tests against `dist/`    |
| `npm run verify`       | Run all of the checks above in order |
| `npm run assets:og`    | Regenerate the social sharing image  |
| `npm run deploy`       | Publish `dist/` to Cloudflare Pages  |

## Project structure

```
src/
  assets/images/   Source photographs
  components/      Scenes, UI components, header and footer
  data/            Product data and navigation
  layouts/         Base HTML layout
  lib/             Pure, unit-tested logic
  pages/           Routes
  scripts/         Navigation and animation
  styles/          Tokens, base, components and scenes
tests/             Unit and end-to-end tests
scripts/           Development utilities
docs/              Project documentation
```

## Documentation

- [Architecture](docs/architecture.md)
- [Design system](docs/design-system.md)
- [Animation system](docs/animation.md)
- [Testing](docs/testing.md)
- [Deployment](docs/deployment.md)
- [Roadmap](docs/roadmap.md)
- [Architecture decision records](docs/adr/README.md)
- [Contributing](CONTRIBUTING.md)

## Known limitations

- Automated tests run in Chromium only. Safari, Firefox and physical devices are not covered.
- Source photographs are 1248×832 px and lose some sharpness at 1920 px and above.
- The reverse view is a separate photograph, so the bottle's proportions differ slightly.

## License

The code and documentation are available under the [MIT License](LICENSE).

The product photographs in `src/assets/images/` and `public/og-image.jpg` are not covered by this license. Replace them with your own if you reuse the project.

Dependencies keep their own licenses. Cormorant and Jost use the SIL Open Font License 1.1, and GSAP uses its [standard no-charge license](https://gsap.com/standard-license).
