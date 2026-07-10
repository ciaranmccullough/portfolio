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

export const storyWalkthroughGridClass =
  "grid grid-cols-1 gap-10 md:grid-cols-[minmax(280px,0.85fr)_1fr] md:gap-16";

export const storyWalkthroughPhoneColClass = "mx-auto w-full md:mx-0";

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
