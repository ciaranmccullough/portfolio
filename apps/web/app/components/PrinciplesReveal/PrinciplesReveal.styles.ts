/* Mirrors @portfolio/ui's Principles.styles.ts exactly (that file isn't
   exported — styles are a package-internal detail — so these are kept in
   sync by hand). Needed here because per-card scroll-driven stagger means
   this component recomposes PrincipleCard directly instead of rendering the
   Principles organism: PrincipleCard renders its own <li>, and both a
   wrapping <li>-in-<li>-in-<ol> nesting *and* `display: contents` (which
   would strip the wrapper's own box, silently breaking any opacity/transform
   on it) rule out wrapping it in a motion element, so this recomposes the
   section shell instead and applies each card's motion-driven style directly
   to PrincipleCard's own native `style` prop. */
export const principlesRevealSectionClass =
  "mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-24 lg:px-14 lg:py-32 xl:py-36";

export const principlesRevealHeaderClass = "mb-9";

export const principlesRevealEyebrowClass = "mb-2.5";

export const principlesRevealTitleClass = "max-w-[18ch]";

export const principlesRevealGridClass =
  "grid list-none grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3";
