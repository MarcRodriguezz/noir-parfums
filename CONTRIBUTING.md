# Contributing

Issues and pull requests are welcome.

## Setup

```bash
npm ci
npx playwright install chromium
npm run dev
```

## Workflow

1. Create a branch from `main`.
2. Make one logical change per commit.
3. Run `npm run verify`.
4. Open a pull request. CI runs the same checks.

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org): `feat:`, `fix:`, `test:`, `docs:`, `ci:`, `chore:`.

## Code conventions

### TypeScript

- Do not use `any` or `@ts-ignore`.
- Access `dataset` with brackets: `element.dataset['motion']`.
- Use the `@/` alias for internal imports.
- Put logic that does not touch the DOM in `src/lib/`, with tests.

### Astro and content

- Do not add a client framework without an ADR.
- Keep product data in `src/data/product.ts`.
- Render images through `Photo.astro` or `<Picture>`, not a plain `<img>` pointing to `public/`.

### CSS

- Take values from `tokens.css`, and add a token for any value that repeats.
- Write mobile first. The layout must be correct without animation.
- Keep scene layout in `scenes.css`.
- Put rules that prepare an animation under `.js`, inside a `prefers-reduced-motion: no-preference` query.

Tailwind's `@variant` generates no rules at the top level of a stylesheet. Use `@media (...) { .js { ... } }` for motion modes.

### Animation

- Animate `transform` and `opacity`. Any other property needs a reason.
- Hide content with `opacity`, never `visibility` or `autoAlpha`, so it stays in the accessibility tree.
- Create every animation inside a `matchMedia` profile, and remove listeners in its cleanup function.
- Keep profile thresholds identical in `lib/motion-profile.ts` and `scenes.css`.
- Check the next scene's opening frame when you change a camera move.
- Check the landing label when you retime a scene.

See [the animation system](docs/animation.md) for details.

### Accessibility

- Use semantic HTML first, and ARIA only when no native element fits.
- Use one `h1` per page, with no skipped heading levels.
- Keep focus visible on every control, and touch targets at 44 px or more.
- Use `alt=""` on repeated images and a real description on informative ones.
- Do not use Bronze for text.

### Performance

- GSAP is the only client dependency. A new one needs an ADR.
- Give priority loading to the first visible image only.
- Defer non-critical setup with `runWhenIdle`.

## Before opening a pull request

- [ ] `npm run verify` passes.
- [ ] Visual changes are reviewed at 320, 390, 768, 1024, 1440 and 1920 px, and on a landscape phone.
- [ ] Animation changes are checked with reduced motion.
- [ ] Documentation matches the code.
- [ ] Significant decisions have an [ADR](docs/adr/README.md).

## Adding a scene

1. Create `src/components/scenes/Name.astro` with complete content and no animation.
2. Add its data to `data/product.ts`, and its link to the navigation if needed.
3. Add the layout to `scenes.css`, starting with normal flow.
4. Give the section an `id` and `data-scene`, and mark where its text starts with `data-landing`.
5. Create the animation in `scripts/motion/` and register it in `motion/index.ts`.
6. Add tests.
