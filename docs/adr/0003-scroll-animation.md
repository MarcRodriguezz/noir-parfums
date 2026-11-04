# 3. Drive animation with GSAP and sticky stages

**Status:** Accepted

## Context

The story depends on scrolling and must be reversible. It has to work with flat photographs, without blocking the scroll or hiding content from assistive technology.

## Decision

- Use GSAP with ScrollTrigger and `scrub`.
- Hold scenes with `position: sticky`.
- Hand off between scenes on identical frames.
- Change from front to reverse behind a shadow band.
- Define Cinema and Handheld profiles with `gsap.matchMedia`.
- Declare landing frames as labels on each timeline.

## Alternatives considered

- **ScrollTrigger `pin`:** adds containers and moves elements from JavaScript. With `sticky`, the page height is defined by CSS, so nothing shifts on load.
- **CSS scroll-driven animations:** not available in all target browsers with the same level of control.
- **Fake rotation with `rotateY`:** reveals the trick on a flat photograph.
- **Cross-fade:** exposes the difference between the two photographs.
- **The same experience on mobile:** long holds get in the way of touch scrolling.
- **Stored scroll positions for landing frames:** go stale when a track height changes.

## Consequences

- Profile thresholds exist in both TypeScript and CSS, and must match.
- GSAP adds about 120 KB uncompressed, and only when animation runs.
- Changing a camera move means checking the next scene's opening frame.
- Handoffs can be noticeable with very abrupt scrolling, because `scrub` smooths with a delay.
- GSAP uses its own no-charge license rather than an open source one.
