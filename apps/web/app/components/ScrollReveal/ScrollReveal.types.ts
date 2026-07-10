import type { ReactNode } from "react";

/** Visual treatment for a {@link ScrollReveal} — "rise" (fade + translateY,
 *  the default) or "scale" (fade + scale up from slightly smaller), matching
 *  the design's `data-reveal="up"` vs `data-reveal="scale"` treatments. */
export type ScrollRevealVariant = "rise" | "scale";

/** Props for {@link ScrollReveal}. */
export interface ScrollRevealProps {
  children: ReactNode;
  /**
   * 0-based position within a staggered group (e.g. a row of cards). Each
   * increment delays this instance's reveal window slightly so the group
   * reveals in sequence rather than all at once. Omit (or `0`) for no delay.
   */
  staggerIndex?: number;
  /** Defaults to `"rise"`. */
  variant?: ScrollRevealVariant;
}
