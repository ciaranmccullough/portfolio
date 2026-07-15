/* `isolate` gives the -z-10 background layer its own stacking context, so it
   stays contained within this section instead of interacting with sibling
   sections' own z-indexed layers. */
export const caseStudyHeroClass =
  "relative isolate flex min-h-[84vh] flex-col justify-center overflow-hidden";

export const caseStudyHeroBackgroundClass =
  "pointer-events-none absolute inset-0 -z-10 overflow-hidden";

/* The media layer IS the design doc's masked top-right band (visible roughly
   x:44-90%, y:0-52% of the hero — which at desktop size is a ~1024px-wide
   16:9 area): anchored top-right, width-capped and aspect-locked, so the
   image renders at roughly its natural scale. Sizing the layer `inset-0`
   instead would cover-stretch the ~1K CMS asset across the whole hero
   (2x+ upscale on wide screens — visibly soft/stretched) only to mask most
   of it away again. The double mask-image (mask-composite: intersect) fades
   the band to nothing at its left/right edges and below its midline, so the
   image bleeds in from the top-right instead of ending in a hard edge.
   Genuine one-offs with no equivalent token (see design-spec section A). */
export const caseStudyHeroBackgroundMediaClass =
  "absolute top-0 right-0 aspect-video w-full max-w-5xl opacity-[.52] [mask-composite:intersect] [mask-image:linear-gradient(to_right,transparent_0%,#000_44%,#000_90%,transparent_100%),linear-gradient(to_top,transparent_0%,#000_48%)]";

/* Flat cream wash held over the whole masked band — the source's first
   overlay stop (a uniform tint, not a gradient). */
export const caseStudyHeroWashFlatClass = "absolute inset-0 bg-paper/34";

/* Horizontal cream fade: near-opaque at the left edge of the visible band,
   fading to transparent by 62% across — softens the mask's left edge on top
   of the hard cutoff above. */
export const caseStudyHeroWashLeftClass =
  "absolute inset-0 bg-gradient-to-r from-paper from-0% via-paper/45 via-36% to-transparent to-62%";

/* Bottom fade to solid paper — stays fully transparent until just past the
   midline, then resolves to solid paper by the foot of the hero. */
export const caseStudyHeroWashBottomClass =
  "absolute inset-0 bg-gradient-to-b from-transparent from-54% to-paper";

/* `[--rise-scale:1]` cancels the shared `rise` keyframe's default scale-in
   (see theme.css) for every rise child below — the hero's load-time reveal
   is opacity/translateY only, no scale (design-spec E), unlike the Cookie
   Banner which relies on that same keyframe's default. Set once here so it
   cascades to eyebrow/title/standfirst/meta/scroll-cue via inheritance. */
export const caseStudyHeroContentClass =
  "relative mx-auto w-full max-w-7xl px-6 py-5 sm:px-10 lg:px-14 [--rise-scale:1]";

/* Load-time entrance, step 1 of 5 (see design-spec E: `.rise`/`.r2`-`.r5`
   stagger, eyebrow → title → standfirst → meta row → scroll cue). */
export const caseStudyHeroEyebrowClass = "mb-4 motion-safe:animate-hero-rise";

/* Step 2 of 5. */
export const caseStudyHeroTitleClass = "mt-4 motion-safe:animate-hero-rise-2";

/* Standfirst: fluid statement-adjacent scale (measured off the design doc —
   see design-spec section A), bigger than the `body` Text variant tops out
   at, so this is rendered as a plain `<p>` with its own type classes rather
   than through the Text atom (avoids stacking a conflicting `text-lg` class
   the atom's `body` variant would otherwise apply). Step 3 of 5 of the hero
   entrance stagger. */
export const caseStudyHeroDescriptionClass =
  "mt-5 max-w-[44ch] font-body text-[clamp(18px,2.2vw,24px)] leading-[1.45] text-fg-muted motion-safe:animate-hero-rise-3";

/* `m-0` cancels the <dl>'s default block margin so the row's spacing is
   controlled entirely by `mt-9`, matching every other section's rhythm.
   Step 4 of 5 of the hero entrance stagger. */
export const caseStudyHeroMetaClass =
  "m-0 mt-9 flex flex-wrap gap-x-10 gap-y-3 font-mono text-xs font-bold text-fg motion-safe:animate-hero-rise-4";

export const caseStudyHeroMetaItemClass = "flex flex-col gap-1";

/* `fg-faint` (#9a9486 on paper) measures 2.68:1 — fails WCAG AA's 4.5:1 body
   text minimum (PRODUCT.md's AA pledge). `fg-soft` (#6a6776) clears it. */
export const caseStudyHeroMetaLabelClass = "text-[11px] text-fg-soft";

/* `m-0` cancels the <dd>'s default inline-start margin. */
export const caseStudyHeroMetaValueClass = "m-0";

/* Step 5 of 5 of the hero entrance stagger — the rise plays on this wrapper,
   distinct from the arrow's own continuous `motion-safe:animate-floaty` bob
   below, so the one-shot entrance and the infinite bob compose on separate
   elements instead of colliding on the `animation` shorthand of one. */
export const caseStudyHeroScrollCueClass =
  "mt-12 flex items-center gap-2 font-mono text-xs font-bold tracking-wide text-fg-soft motion-safe:animate-hero-rise-5";

/* Reuses the existing floaty token (rather than a new bespoke keyframe) for
   the cue's gentle bob — see design-spec E's own note that this is a strong
   generalization candidate. */
export const caseStudyHeroScrollCueArrowClass = "motion-safe:animate-floaty";
