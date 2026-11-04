# Design system

Tokens live in `src/styles/tokens.css`. The visual concept is a dark room with one warm light source: almost everything is black, and gold is reserved for what should draw attention.

## Color

| Token              | Value     | Use                             | Contrast on Obsidian |
| ------------------ | --------- | ------------------------------- | -------------------- |
| `--color-obsidian` | `#0c0b0a` | Background                      | -                    |
| `--color-ivory`    | `#e8ded0` | Headings and body text          | 14.8:1               |
| `--color-gold`     | `#c6a675` | Labels, focus and actions       | 8.5:1                |
| `--color-sand`     | `#ad9a85` | Secondary text                  | 7.3:1                |
| `--color-bronze`   | `#79624f` | Dividing lines only, never text | 3.4:1                |
| `--color-espresso` | `#30241e` | Decorative numerals             | -                    |

Obsidian matches the edges of the front photograph, so the photo blends into the page.

## Typography

| Family    | Use                        | Reason                                              |
| --------- | -------------------------- | --------------------------------------------------- |
| Cormorant | Headings, quotes, wordmark | High-contrast editorial serif with a strong italic  |
| Jost      | Body, labels, navigation   | Geometric sans that does not compete with the serif |

Both are variable fonts hosted with the site. Cormorant is used from about 1.5 rem up, because it loses legibility at small sizes.

| Token             | Range           | Use                |
| ----------------- | --------------- | ------------------ |
| `--text-eyebrow`  | 0.75–0.875 rem  | Uppercase labels   |
| `--text-body`     | 1.0625–1.25 rem | Body text          |
| `--text-lead`     | 1.5–2.25 rem    | Quotes and moments |
| `--text-title`    | 2.5–5.5 rem     | Scene titles       |
| `--text-monument` | 2.75–15 rem     | OBSIDIAN name      |

## Spacing

| Token              | Range      | Use                   |
| ------------------ | ---------- | --------------------- |
| `--spacing-gutter` | 1.25–4 rem | Side margins          |
| `--spacing-scene`  | 5–12 rem   | Space between blocks  |
| `--content-width`  | 92 rem     | Maximum content width |

`.wrap` applies the maximum width, margins and device safe areas.

## Breakpoints

| Name    | Value  | Main change                                       |
| ------- | ------ | ------------------------------------------------- |
| Base    | 0      | One column, normal flow                           |
| Tablet  | 48 rem | Inline navigation, notes in three columns         |
| Laptop  | 64 rem | Title on both sides of the bottle, Cinema profile |
| Desktop | 90 rem | Fluid content only                                |

Below 37.5 rem of height, the Handheld profile applies at any width. This covers landscape phones and laptops at high zoom.

## Layout

| Element          | Behavior                                                | Reason                                         |
| ---------------- | ------------------------------------------------------- | ---------------------------------------------- |
| Hero title       | Both sides of the bottle on desktop, below it on mobile | Keeps the bottle whole and centered            |
| Scroll cue       | Bottom left on desktop                                  | Stays clear of the bottle                      |
| Essence bottle   | Moves to the right                                      | Clears the left half for the notes             |
| Notes            | Shared stage on desktop, list on mobile                 | Long holds get in the way of touch scrolling   |
| Revelation title | Left side                                               | Keeps the reverse of the bottle clear          |
| Header           | Clear over photographs, solid over editorial text       | Keeps links legible without cutting the images |
| Photo edges      | Faded with CSS masks                                    | The photos have no transparency                |
| Craft image      | 4:5 on mobile, 16:9 from tablet                         | Fills narrow screens, then forms a wide band   |

## Components

- **Button:** gold border with a fill that rises on hover or focus; at least 56 px tall.
- **Link:** underline that grows from left to right; it also marks the active section.
- **Size option:** card with a visually hidden native radio; focus is drawn on the card.
- **Material:** native `<details>`, usable with keyboard and touch, and without JavaScript.
- **Focus:** 2 px gold outline with a 4 px offset.
- **Touch targets:** at least 44 px.

## Motion tokens

| Token                | Value                             | Use                  |
| -------------------- | --------------------------------- | -------------------- |
| `--duration-micro`   | 240 ms                            | Color changes        |
| `--duration-gesture` | 480 ms                            | Underlines and fills |
| `--ease-cinema`      | `cubic-bezier(0.22, 0.8, 0.2, 1)` | Entrances            |
| `--ease-quiet`       | `cubic-bezier(0.4, 0, 0.2, 1)`    | Neutral transitions  |
