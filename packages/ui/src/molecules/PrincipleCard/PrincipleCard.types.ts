import type { ComponentPropsWithoutRef, ReactNode } from "react";

export type PrincipleCardTone = "violet" | "orange" | "green";

/**
 * Props for the {@link PrincipleCard} molecule. Renders an `<li>`; place
 * inside the ordered list rendered by the `Principles` organism (or any
 * list).
 */
export interface PrincipleCardProps extends Omit<
  ComponentPropsWithoutRef<"li">,
  "title"
> {
  /**
   * Large ordinal numeral, e.g. `"01"`. Pre-formatted by the caller (no
   * implicit zero-padding) so the component stays presentational. Decorative
   * — hidden from assistive tech, since the surrounding list already conveys
   * order and `title` carries the real content.
   */
  index: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Accent colour for the numeral. Defaults to `violet`. */
  tone?: PrincipleCardTone;
}
