import type { ComponentPropsWithoutRef } from "react";

export type IconName = "grid" | "orbit" | "menu" | "arrowUpRight";

/** Props for the {@link Icon} atom. Extends native `<svg>` attributes. */
export interface IconProps extends Omit<
  ComponentPropsWithoutRef<"svg">,
  "children"
> {
  /** Which built-in glyph to render. */
  name: IconName;
  /** Pixel size (width & height). */
  size?: number;
  /** Accessible label. When omitted the icon is decorative (`aria-hidden`). */
  title?: string;
}
