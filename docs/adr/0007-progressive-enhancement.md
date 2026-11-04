# 7. Layer animation over complete HTML

**Status:** Accepted

## Context

Cinematic pages often sacrifice performance and accessibility. Here, animation cannot be the only way to reach the content.

## Decision

- The HTML holds all the content and is correct without animation CSS.
- GSAP is imported dynamically, and never with reduced motion.
- Only the visible scene is set up at startup. The rest uses `requestIdleCallback` with a 300 ms limit.
- Content is hidden with `opacity`, so it stays in the accessibility tree.
- Images have explicit dimensions and load lazily, except the first.
- A 5 second timer returns the page to static mode if the script never runs.

## Alternatives considered

- **Content hidden until animation reveals it:** a script failure would leave a blank page.
- **Loading GSAP at startup:** penalizes visitors who never need it.
- **Creating all triggers at once:** produces long tasks during loading.
- **Hiding with `visibility` or `autoAlpha`:** removes content from the accessibility tree.

## Consequences

- No information is lost with reduced motion or without JavaScript.
- Screen readers reach the notes even when they are not visible, in markup order.
- Accessibility tests run mainly with reduced motion, because some text is temporarily at opacity 0 in other states.
- The intro fades a full-screen image for over two seconds, which lowers Lighthouse scores. This is accepted as the central moment of the page.
- CSS masks cost more to paint than plain images, but are the only way to blend photos with built-in backgrounds.
