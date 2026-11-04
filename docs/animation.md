# Animation system

## Motion profiles

`src/lib/motion-profile.ts` defines the queries. `gsap.matchMedia` activates a profile and reverts everything when it changes.

| Profile  | Condition                                          | Behavior                         |
| -------- | -------------------------------------------------- | -------------------------------- |
| Cinema   | At least 64 rem wide and 37.5 rem tall             | Continuous shot with held stages |
| Handheld | Everything else                                    | Normal flow with one short hold  |
| None     | `prefers-reduced-motion: reduce`, or no JavaScript | Static content; GSAP not loaded  |

`scenes.css` repeats these conditions as media queries, because track heights must be known before the script loads. Keep both in sync.

## Continuous shot

Each Cinema scene has a tall track containing a `position: sticky` stage. A scrubbed `ScrollTrigger` ties a timeline to the track.

1. The next track overlaps the previous one by 100 svh with a negative margin.
2. `holdUntilArrival` keeps the next stage at opacity 0 until it reaches the top of the window.
3. Each scene ends on the exact frame the next one opens with (`scale: 1.34, y: 6%`), so the handoff is invisible.
4. Timelines end with a stretch without changes, so scrub smoothing settles before the handoff.

The handoff can be briefly noticeable with extremely fast scrolling.

## Scenes

| Scene      | Animation                                        | Purpose                        |
| ---------- | ------------------------------------------------ | ------------------------------ |
| Reveal     | Photo fade and scale                             | Emerges from the dark          |
| Reveal     | Rising mask on the title                         | Typographic reveal             |
| Reveal     | Light sweep across the bottle                    | Suggests a reflection          |
| Reveal     | Light follows the pointer, on fine pointers only | Adds presence                  |
| Reveal     | Camera push on scroll                            | Moves toward the label         |
| Essence    | Camera pull back and sideways move               | Makes room for the text        |
| Essence    | Three notes enter and leave                      | Top, heart and base in order   |
| Essence    | Numerals move more slowly                        | Adds depth                     |
| Essence    | Canvas particles                                 | The fragrance in the air       |
| Revelation | Synchronized clip and shadow band                | Front to reverse change        |
| Revelation | Photos move in opposite directions               | Suggests a change of viewpoint |
| Craft      | Words light up on scroll                         | Sets the reading pace          |
| Craft      | Image clip and parallax                          | Brings in the atmosphere photo |
| Finale     | Light and scale on scroll, mask on the name      | Closes the story               |

### Front to reverse transition

An opaque shadow band crosses the image, and the cut between photographs happens behind its center. `lib/revelation.ts` derives the clip and the band from one progress value, so they always match and the transition is reversible.

### Particles

Canvas 2D circles without `shadowBlur`. The loop stops when the canvas is off screen or the tab is hidden.

## Link transitions

Each scene that hides its text at the top of its track declares a landing frame with `landOnLabel`:

| Scene      | Profile          | Label time | Frame                               |
| ---------- | ---------------- | ---------- | ----------------------------------- |
| Essence    | Cinema           | 1.65       | Title and first note, fully visible |
| Revelation | Cinema, Handheld | 1.25       | Reverse fully shown, with the title |

`landing.ts` then chooses how to get there:

| Trip                      | Transition                                                                     |
| ------------------------- | ------------------------------------------------------------------------------ |
| More than one viewport    | Fade to black in 420 ms, change frame, fade in over 950 ms with a 120 px drift |
| Up to one viewport        | Eased scroll over 900 ms                                                       |
| Reduced motion            | Immediate jump                                                                 |
| Shared URL, back, forward | Immediate jump                                                                 |

- The curtain sits below the header, so the navigation stays visible.
- The curtain waits up to 1.5 s for the destination's images, so lazy loading never shows the wrong photo.
- Scrub tweens are forced to completion behind the curtain, so scenes in between do not replay.
- Scrolling, touching or pressing a key cancels the drift.
- Focus moves to the destination scene.

## Tuned values

| Value                        | Setting          | Reason                                                   |
| ---------------------------- | ---------------- | -------------------------------------------------------- |
| Reveal track                 | 190 svh          | Short, so the first scroll responds at once              |
| Essence track                | 460 svh          | Gives three notes time to be read                        |
| Revelation track             | 340 svh          | Keeps the wipe unhurried, with a pause on the reverse    |
| Handheld Revelation track    | 210 svh          | Keeps the hold short on touch screens                    |
| Handheld hold minimum height | 35 rem           | Landscape phones have no room for a held stage           |
| Cinema minimum width         | 64 rem           | Below this, the title and bottle do not fit side by side |
| Cinema minimum height        | 37.5 rem         | Below this, held stages cut off the notes                |
| Main `scrub`                 | 0.6 s            | Smooth without feeling detached                          |
| Craft `scrub`                | 0.4 s            | Reading needs a closer response than a camera move       |
| Default ease                 | `none`           | Scrubbed position should follow the scroll directly      |
| `ignoreMobileResize`         | `true`           | The address bar should not recalculate triggers          |
| Craft word opacity           | 0.42 to 1        | Keeps large-text AA contrast at all times                |
| Particles                    | 18, 28, up to 70 | Fewer on phones to save battery                          |
| Particle time step cap       | 0.05 s           | Prevents jumps after the tab was hidden                  |
| Canvas pixel ratio cap       | 1.5              | More density adds cost but no visible detail             |
| Idle setup timeout           | 300 ms           | Setup never waits long on a busy page                    |

## Cleanup

- `matchMedia` reverts all animations and triggers created in its context.
- Each profile returns a function that cancels pending tasks, removes listeners, stops particles and clears landing resolvers.
- `main.ts` runs global cleanup on `pagehide`.

## Adding an animation

1. Add a `data-` attribute to the scene's markup.
2. Write any calculation as a pure function in `lib/`, with tests.
3. Create the animation in the scene's module, inside a profile.
4. Check that the unanimated state is readable.
5. Add a landing label if the animation hides the scene's text at the top of its track.
6. Add a test in `tests/e2e/animation.spec.ts` if the behavior can be checked.
