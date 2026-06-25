import type { ComponentPropsWithoutRef, ElementType } from "react";

export type LinkVariant = "nav" | "inline" | "cta" | "primary";

/** Props for the {@link Link} atom. Extends native `<a>` attributes. */
export interface LinkProps extends ComponentPropsWithoutRef<"a"> {
  variant?: LinkVariant;
  /**
   * Render as a different element/component (e.g. `next/link`) while keeping the
   * Link styling. Defaults to a native `<a>`.
   */
  as?: ElementType;
}
