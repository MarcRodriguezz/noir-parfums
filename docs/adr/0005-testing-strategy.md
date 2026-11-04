# 5. Test the built site in a real browser

**Status:** Accepted

## Context

Most of the risk is in the browser: layout, animation and accessibility. The pure logic is small.

## Decision

Use `astro check`, ESLint and Prettier for static checks, Vitest for pure logic, and Playwright with axe against the built site. Run Lighthouse and visual review manually.

## Alternatives considered

- **Jest:** needs more configuration for ESM and TypeScript.
- **Cypress:** weaker support for several viewports and touch emulation in one run.
- **Lighthouse alone for accessibility:** covers fewer states than axe in Playwright.
- **Lighthouse in CI:** a local server without compression gives unrepresentative numbers.
- **Reference screenshots:** random particles and font rendering differences cause false failures.

## Consequences

- Tests cover what is actually published.
- Tests assert behavior such as overflow, reversibility and focus rather than internals.
- Some animation tests use fixed waits for scrub smoothing.
- Visual quality depends on human review.
- Only Chromium is automated, to keep CI fast. Other browsers are on the [roadmap](../roadmap.md).
