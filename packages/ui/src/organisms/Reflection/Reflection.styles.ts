/* Fluid rhythm measured off the design doc (clamp(60px,12vw,160px) top and
   bottom) — approximated on the Tailwind breakpoint scale; see Principles'
   own identical rationale (this section's clamp caps 10px higher). */
export const reflectionClass =
  "mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-24 lg:px-14 lg:py-32 xl:py-40";

export const reflectionHeaderClass = "mb-9";

export const reflectionEyebrowClass = "mb-2.5";

export const reflectionGridClass =
  "grid list-none grid-cols-1 gap-8 sm:gap-10 md:grid-cols-3";

export const reflectionItemClass = "border-t-2 border-ink pt-5";

/* Card title: measured off the design doc (Bricolage 800, clamp(21px,2.4vw,
   30px), line-height 1.05, letter-spacing -.02em) — appreciably heavier,
   tighter and more fluid than the `h3` Text variant (700, fixed 18px, 1.2
   leading, no tracking), so this is rendered as a plain `<h3>` with its own
   classes rather than through the Text atom (avoids stacking several
   conflicting classes the atom's `h3` variant would otherwise apply).
   `leading-tight` is the theme's own 1.05 token — an exact match. */
export const reflectionTitleClass =
  "font-heading text-[clamp(21px,2.4vw,30px)] font-extrabold leading-tight tracking-snug text-fg";

export const reflectionTitleAccentClass = "text-brand-violet";

/* Card body: measured off the design doc (15.5px, line-height 1.6, same
   14px top offset) — the `body` Text variant is close (16px, leading-relaxed
   already matches at 1.6) but not exact, so this also renders as a plain
   `<p>` rather than through Text, for the same reason as the title above. */
export const reflectionDescriptionClass =
  "mt-3.5 font-body text-[15.5px] leading-relaxed text-fg-muted";
