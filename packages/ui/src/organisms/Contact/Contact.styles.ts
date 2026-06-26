/* Section wrapper — aligns the dark panel with the shared page content width and
   the px-6 gutter used by every other section. `pb` lifts the panel off the
   footer; the top gap comes from the previous section's bottom padding. */
export const contactClass = "mx-auto max-w-7xl px-6 pb-16 sm:px-10 lg:px-14";

/* The dark panel. */
export const contactPanelClass =
  "relative overflow-hidden rounded-2xl bg-ink px-6 py-14 sm:px-10 sm:py-16";

/* Decorative brand-gradient glows — arbitrary one-offs with no token. */
export const contactGlowOneClass =
  "pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(106,71,255,0.55),transparent_70%)]";

export const contactGlowTwoClass =
  "pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(255,88,54,0.45),transparent_70%)]";

/* Pitch + form. Single column until md (≈ the design's 780px breakpoint), then
   a two-column split whose gutter grows with the viewport. */
export const contactGridClass =
  "relative grid grid-cols-1 items-start gap-10 md:grid-cols-2 md:gap-12 lg:gap-14";

/* text-fg-inverse / text-fg-on-dark are declared last in the theme, so they win
   the cascade over the Text atom's baked light-surface colours on this panel. */
export const contactTitleClass = "mt-4 max-w-[16ch] text-fg-inverse";

export const contactIntroClass = "mt-5 max-w-[42ch] text-fg-on-dark";

export const contactSocialsClass = "mt-7 flex list-none gap-5";
