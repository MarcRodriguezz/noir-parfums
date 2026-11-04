# 2. Use Tailwind with dedicated scene CSS

**Status:** Accepted

## Context

The interface must feel like an extension of dark, amber-lit photographs. Each scene also has several layouts that depend on combined width, height and motion queries.

## Decision

Use Tailwind CSS for tokens and simple utilities, and dedicated CSS files for everything else. Scene layouts live in `scenes.css`. Use Cormorant for display text and Jost for body text, both hosted with the site.

## Alternatives considered

- **Tailwind utilities only:** the combined media queries become unreadable in markup.
- **Custom CSS only:** no utilities for simple cases.
- **Bodoni Moda:** dramatic, but less legible in light italics.
- **Playfair Display:** closely associated with templates.

## Consequences

- Tokens are CSS variables, available to both utilities and custom CSS.
- There are two styling approaches, with a clear rule for which one to use.
- Font packages add unused subsets to `dist/`, but browsers only download the ones they need.
