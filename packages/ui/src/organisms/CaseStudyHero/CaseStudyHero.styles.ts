/* `isolate` gives the -z-10 background layer its own stacking context, so it
   stays contained within this section instead of interacting with sibling
   sections' own z-indexed layers. */
export const caseStudyHeroClass =
  "relative isolate flex min-h-[84vh] flex-col justify-center overflow-hidden";

export const caseStudyHeroBackgroundClass =
  "pointer-events-none absolute inset-0 -z-10 overflow-hidden";

/* Fades the image out toward the left edge — a simplified, single-gradient
   stand-in for the source design's double mask-composite trick (see
   design-spec section A). A genuine one-off with no equivalent token. */
export const caseStudyHeroBackgroundMediaClass =
  "absolute inset-0 opacity-50 [mask-image:linear-gradient(to_left,black_35%,transparent_80%)]";

/* Two soft wash layers stacked on top of the (already-masked) image: a
   left-to-right cream fade and a bottom fade to solid paper, so the image
   reads as bleeding in from the top-right and receding to nothing —
   approximates the source's three-stop gradient overlay with plain
   token-based Tailwind gradients instead of literal one-off rgba stops. */
export const caseStudyHeroWashLeftClass =
  "absolute inset-0 bg-gradient-to-r from-paper via-paper/35 to-transparent";

export const caseStudyHeroWashBottomClass =
  "absolute inset-0 bg-gradient-to-b from-transparent to-paper";

export const caseStudyHeroContentClass =
  "relative mx-auto w-full max-w-7xl px-6 py-5 sm:px-10 lg:px-14";

export const caseStudyHeroEyebrowClass = "mb-4";

export const caseStudyHeroTitleClass = "mt-4";

export const caseStudyHeroDescriptionClass = "mt-5 max-w-[44ch]";

/* `m-0` cancels the <dl>'s default block margin so the row's spacing is
   controlled entirely by `mt-9`, matching every other section's rhythm. */
export const caseStudyHeroMetaClass =
  "m-0 mt-9 flex flex-wrap gap-x-10 gap-y-3 font-mono text-xs font-bold text-fg";

export const caseStudyHeroMetaItemClass = "flex flex-col gap-1";

export const caseStudyHeroMetaLabelClass = "text-[11px] text-fg-faint";

/* `m-0` cancels the <dd>'s default inline-start margin. */
export const caseStudyHeroMetaValueClass = "m-0";

export const caseStudyHeroScrollCueClass =
  "mt-12 flex items-center gap-2 font-mono text-xs font-bold tracking-wide text-fg-faint";

/* Reuses the existing floaty token (rather than a new bespoke keyframe) for
   the cue's gentle bob — see design-spec E's own note that this is a strong
   generalization candidate. */
export const caseStudyHeroScrollCueArrowClass = "motion-safe:animate-floaty";
