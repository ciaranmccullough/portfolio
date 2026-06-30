import type { ComponentPropsWithoutRef } from "react";

export type EyebrowTone = "violet" | "orange" | "green";

/** Props for the {@link Eyebrow} atom. Extends native `<p>` attributes. */
export interface EyebrowProps extends ComponentPropsWithoutRef<"p"> {
  /** Colour-codes the kicker per section. */
  tone?: EyebrowTone;
  /**
   * Set when the eyebrow sits on a dark surface (e.g. the Contact panel). Uses
   * the bright accent palette, which clears AA on dark; the default palette uses
   * darker `-deep` shades tuned for light surfaces.
   */
  onDark?: boolean;
}
