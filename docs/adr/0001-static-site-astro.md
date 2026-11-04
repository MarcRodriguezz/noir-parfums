# 1. Build a static site with Astro

**Status:** Accepted

## Context

The site is a single-story landing page with no dynamic data, accounts or payments. Its main technical cost is animation, and the content must remain accessible without it.

## Decision

Use Astro with static output, `.astro` components and strict TypeScript. Do not use a client framework.

## Alternatives considered

- **Next.js or React:** adds a runtime that would manage no state here.
- **Astro with Preact islands:** a smaller runtime, but still no state to manage.
- **Plain HTML and Vite:** no components or image optimization.
- **Three.js or WebGL:** allows a real 3D rotation, but requires a 3D model of the bottle.
- **Lenis:** replaces native scrolling, while `sticky` and `scrub` already provide the smoothness needed.

## Consequences

- Initial JavaScript is minimal, and scroll behavior stays native.
- Components and image optimization are available at build time.
- Complex client state would require adding islands.
- The bottle cannot truly rotate.
