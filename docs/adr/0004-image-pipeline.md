# 4. Process images at build time

**Status:** Accepted

## Context

The site uses three 1248×832 px JPEG photographs with built-in backgrounds and no transparency.

| File                  | Content                               | Use                     |
| --------------------- | ------------------------------------- | ----------------------- |
| `noir-front.jpg`      | Wide bottle, NOIR label, amber light  | Front view              |
| `noir-reverse.jpg`    | Slightly narrower bottle, blank label | Reverse view            |
| `noir-atmosphere.jpg` | Tall bottle, two lines of light       | Atmosphere in The Craft |

## Decision

Keep the sources in `src/assets/images/`, and let Astro generate widths of 640, 960 and 1248 px in AVIF, WebP and JPEG at quality 88. Blend photo edges into the page with CSS masks.

## Alternatives considered

- **`public/images`:** files would be served unprocessed.
- **A custom script:** duplicates what the build already does, and would mean versioning generated files.
- **Quality 78:** shows banding in the dark gradients.
- **Widths above 1248 px:** add weight but no detail.

## Consequences

- Variants add a few seconds to the build.
- Images lose some sharpness at 1920 px and above.
- The two bottles differ slightly in proportions. The shadow band in [ADR 3](0003-scroll-animation.md) hides the change.
- `public/og-image.jpg` is generated from the front view with `npm run assets:og`.
