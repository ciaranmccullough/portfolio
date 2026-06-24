import type { ComponentPropsWithoutRef } from "react";

export type EyebrowTone = "violet" | "orange" | "green";

/** Props for the {@link Eyebrow} atom. Extends native `<p>` attributes. */
export interface EyebrowProps extends ComponentPropsWithoutRef<"p"> {
  /** Colour-codes the kicker per section. */
  tone?: EyebrowTone;
}
