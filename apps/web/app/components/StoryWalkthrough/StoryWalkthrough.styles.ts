/* Mirrors @portfolio/ui's Walkthrough.styles.ts header/section rhythm (that
   file isn't exported — styles are package-internal — so kept in sync by
   hand). The pinned layout below has no equivalent in the organism at all:
   it needs a taller-than-content scroll region with a sticky inner viewport,
   which `Walkthrough`'s own natural-height grid doesn't provide. */
export const storyWalkthroughSectionClass =
  "mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-14";

export const storyWalkthroughHeaderClass = "mb-9 md:mb-14";

export const storyWalkthroughEyebrowClass = "mb-2.5";

/* The natively-scrollable "tall" region: its height (items.length * 100vh,
   set inline — a genuine runtime one-off, no static class can express it)
   is how many extra screens of ordinary scrolling it takes to step through
   every panel. No wheel/touch interception anywhere — this is just a very
   tall block behaving like any other scrollable content; only the *styling*
   response (the crossfade below) is scroll-linked. */
export const storyWalkthroughTallClass = "relative";

/* Pins the viewport while the tall region above scrolls past beneath it —
   pure CSS `position: sticky`, the same mechanism (and no-JS fallback
   guarantee) the Walkthrough organism already uses for its phone column. */
export const storyWalkthroughStickyClass =
  "sticky top-0 flex h-screen flex-col justify-center overflow-hidden";

/* `items-center` is load-bearing (design-spec: the mock's phone wrapper is
   `justify-self:center` inside a flex column that's itself vertically
   centred in the pinned viewport, and the copy panel sits in a box the
   grid's own `align-items:center` centres against it). Without it the grid
   defaults to `stretch`: both columns stretch to the row's full height (set
   by whichever of phone/panels is taller for the active item), and each
   column's own intrinsically-sized content then sits top-aligned inside
   that stretched cell instead of centred — the copy reads short against a
   tall empty gutter, and the phone's height no longer matches its own
   natural aspect ratio. Centering both columns as blocks makes their
   vertical *centres* coincide regardless of which one is taller. */
export const storyWalkthroughGridClass =
  "grid grid-cols-1 items-center gap-6 md:grid-cols-[minmax(280px,0.85fr)_1fr] md:gap-16";

/* Height-aware width caps: the pinned viewport is exactly `h-screen` with
   `overflow-hidden`, and at PhoneMockup's natural 320px width the bezel +
   step-progress stack runs ~800px tall — on short viewports (a phone in
   portrait is exactly this case, not just a ~800px laptop window) that
   clips the panel copy straddling the bottom edge. Shrinking the phone on
   short viewports keeps the whole stack inside the pin. (No `max-vh`
   variant exists in Tailwind; arbitrary media queries are the idiomatic
   escape hatch.)

   `mx-auto` at every breakpoint (not just below `md`) matches the mock's
   `justify-self:center`: the phone column's grid track
   (`minmax(280px,.85fr)`) is often wider than the phone itself on large
   viewports, and the progress pips/label live *inside* `PhoneMockup` at the
   phone's own width — so keeping the whole column centred is what keeps the
   pips directly under the phone instead of hugging the track's left edge
   with a gutter of empty space (and the pips) trailing off to one side.

   The two tiers' ranges are written mutually exclusive (`min-height` floor
   on the first) rather than as two independent `max-height` caps — Tailwind
   emits arbitrary-variant rules in its own internal order, not class-list
   order, so when a height matches *both* `max-height` queries at once
   (e.g. 812px matches both ≤900px and ≤820px), whichever rule happens to
   land later in the generated stylesheet silently wins regardless of which
   is visually "more specific" here — that raced the 900px tier in practice.
   Non-overlapping ranges make at most one ever match, so there's nothing
   left to race. */
export const storyWalkthroughPhoneColClass =
  "mx-auto w-full max-w-[320px] [@media(max-height:900px)_and_(min-height:821px)]:max-w-[280px] [@media(max-height:820px)]:max-w-[200px]";

/* All panels share one grid cell ("grid-stack": every child placed at
   row 1/column 1) so they overlap for the crossfade *and* the container
   naturally sizes to the tallest panel — no explicit height and no
   `position: absolute` (which would need a defined height on this element
   to avoid collapsing to zero) required. */
export const storyWalkthroughPanelsClass = "grid list-none";

export const storyWalkthroughPanelLayerClass = "[grid-area:1/1]";

/* Same grid-stack trick for the phone's crossfading screenshots — PhoneMockup
   renders this as the whole content of its (already `relative`, `overflow-
   hidden`) screen slot, so the layers just need to fill and stack within it. */
export const storyWalkthroughImageStackClass = "grid size-full";

/* `relative` so the `next/image fill` inside each layer has a positioned
   ancestor to size against (the image itself carries its own `object-cover`). */
export const storyWalkthroughImageLayerClass =
  "relative [grid-area:1/1] size-full";
