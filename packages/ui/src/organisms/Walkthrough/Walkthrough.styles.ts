export const walkthroughClass =
  "mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-14";

export const walkthroughHeaderClass = "mb-9 md:mb-14";

export const walkthroughEyebrowClass = "mb-2.5";

/* 1-col by default, a fixed-ish phone column beside a flexible panels column
   from md — mirrors the design's ≤900px breakpoint (Tailwind's default `md`
   is 768px, close enough without a custom breakpoint token). */
export const walkthroughGridClass =
  "grid grid-cols-1 gap-10 md:grid-cols-[minmax(280px,0.85fr)_1fr] md:gap-16";

/* Pure-CSS `position: sticky` — no JS. This is the load-bearing piece of the
   no-JS/reduced-motion fallback: as the page scrolls past the (fully visible,
   stacked) panels, the phone naturally stays in view beside whichever panel
   the user is reading, without any scroll-jacking logic. A client wrapper can
   layer cross-fade/step-swap behaviour on top later without needing to change
   this positioning. */
export const walkthroughPhoneColClass = "md:sticky md:top-24 md:self-start";

export const walkthroughPanelsClass = "list-none divide-y divide-line-soft";
