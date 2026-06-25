export const heroClass =
  "mx-auto max-w-5xl px-6 py-16 md:flex md:items-start md:justify-between md:gap-12";
export const heroContentClass = "min-w-0";
export const heroBadgeClass = "mb-4";
export const heroTitleClass = "max-w-2xl";
export const heroIntroClass = "mt-5 max-w-prose";
export const heroActionsClass = "mt-7";

/**
 * Mobile: a wrapped row below the content. md+: a right-aligned vertical column
 * floating beside the content (ragged left edge mirrors the design's scatter).
 */
export const heroTabsClass =
  "mt-10 flex flex-wrap gap-3 md:mt-2 md:shrink-0 md:flex-col md:flex-nowrap md:items-end";

/** Per-tab background colour is supplied by the consumer via `tab.className`. */
export const heroTabClass =
  "inline-flex items-center gap-2 rounded-lg border border-ink px-3 py-2 font-mono text-xs font-bold text-fg shadow-brutal";

export const heroTabIconClass = "size-4";

/** Staggered float variants, cycled per tab so they bob out of sync. */
export const heroTabFloat = [
  "motion-safe:animate-floaty",
  "motion-safe:animate-floaty-2",
  "motion-safe:animate-floaty-3",
  "motion-safe:animate-floaty-4",
];
