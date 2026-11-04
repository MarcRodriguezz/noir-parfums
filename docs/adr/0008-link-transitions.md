# 8. Fade through black on long link trips

**Status:** Accepted

## Context

Scenes hide their text at the top of their tracks, so navigation links must land further in. The page never cuts while scrolling, so the way links travel should not feel abrupt.

## Decision

Trips longer than one viewport fade to black, change frame and fade back in. Shorter trips use an eased scroll. The curtain uses the Web Animations API, because navigation must work before GSAP loads and when it never does. See [link transitions](../animation.md#link-transitions) for the values.

## Alternatives considered

- **Immediate jump:** a hard cut, used only for reduced motion, shared URLs and back and forward.
- **Smooth scroll all the way:** crosses up to 800 svh, so it is either tedious or flashes through every scene.
- **View Transitions API:** depends on browser support, and snapshots the page while ScrollTrigger calculates the new frame.

## Consequences

- Long trips take about 1.4 seconds, and longer while images load.
- Readers who only use the navigation skip the scene transitions.
- Focus moves to the destination scene, with its outline hidden because the section spans many screens.
- `landing.ts` holds some state, including a guard for clicks during a fade.
