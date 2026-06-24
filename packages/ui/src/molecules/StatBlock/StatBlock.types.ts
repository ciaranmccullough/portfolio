import type { ComponentPropsWithoutRef, ReactNode } from "react";

/** Props for the {@link StatBlock} molecule. Renders an `<li>`. */
export interface StatBlockProps extends Omit<
  ComponentPropsWithoutRef<"li">,
  "value"
> {
  /** The headline number / metric. */
  value: ReactNode;
  /** The supporting label. */
  label: ReactNode;
}
