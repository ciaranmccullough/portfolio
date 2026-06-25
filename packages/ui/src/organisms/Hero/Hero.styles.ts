export const heroClass =
  "mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-14 md:flex md:items-start md:justify-between md:gap-12";
export const heroContentClass = "min-w-0";
export const heroBadgeClass = "mb-4";
export const heroTitleClass = "max-w-2xl";
export const heroIntroClass = "mt-5 max-w-prose";
export const heroActionsClass = "mt-7";

/**
 * Mobile: a wrapped row below the content. md+: a fixed-width column beside the
 * content within which the tabs scatter horizontally (see heroTabAlign).
 */
export const heroTabsClass =
  "mt-10 flex flex-wrap gap-3 md:mt-2 md:w-72 md:shrink-0 md:flex-col md:flex-nowrap md:gap-6";

/** Per-tab cross-axis position on md+, mirroring the design's scattered lanes. */
export const heroTabAlign = [
  "md:self-end",
  "md:self-start",
  "md:self-center",
  "md:self-end",
  "md:self-start",
];

/**
 * Per-tab slant on md+, mirroring the design's scattered rotations. Tailwind v4's
 * `rotate-*` sets the `rotate` longhand, so it composes with the float animation's
 * `transform` rather than fighting it. md-gated so the mobile wrapped row stays
 * upright (as in the design).
 */
export const heroTabSlant = [
  "md:rotate-[-6deg]",
  "md:rotate-[7deg]",
  "md:rotate-[5deg]",
  "md:rotate-[-8deg]",
  "md:rotate-[8deg]",
];

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
