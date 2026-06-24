import type { ComponentPropsWithoutRef } from "react";

export type LinkVariant = "nav" | "inline";

/** Props for the {@link Link} atom. Extends native `<a>` attributes. */
export interface LinkProps extends ComponentPropsWithoutRef<"a"> {
  variant?: LinkVariant;
}
