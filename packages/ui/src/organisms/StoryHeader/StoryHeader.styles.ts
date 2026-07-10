export const storyHeaderClass =
  "relative z-20 flex items-center justify-between gap-4 px-6 py-5 sm:px-10 lg:px-14";

// 19px per the design doc (vs. the shared Navbar brand's 16px `text-lg`) — a
// genuine one-off since no token sits at 19px; otherwise identical grammar
// (font-heading, extrabold, tight tracking) to how home's Navbar renders its
// brand, just one step larger. `tracking-snug` (-.02em) is the theme's exact
// match for the doc's measured letter-spacing here.
export const storyHeaderBrandClass =
  "font-heading text-[19px] font-extrabold tracking-snug text-fg no-underline transition-colors hover:text-brand-violet";

/* `py-3.5`/`-my-3.5` grow the clickable box to a ~44px-tall hit area without
   touching the link's rendered text size or the header's own layout height —
   the negative margin cancels the padding's footprint so surrounding
   elements sit exactly where they would without it (the classic
   invisible-hit-area-expansion trick). Was 116×16px (critique: below the
   24px minimum) with no padding at all. */
export const storyHeaderBackLinkClass =
  "inline-flex items-center gap-1.5 py-3.5 -my-3.5 font-mono text-xs font-bold tracking-wide text-fg-soft no-underline transition-colors hover:text-brand-violet";
