import type { ComponentPropsWithoutRef, ReactNode } from "react";

/**
 * Props for the {@link Icon} atom — a pass-through wrapper around an SVG.
 * Extends native `<span>` attributes; the SVG is provided as `children`.
 */
export interface IconProps extends Omit<
  ComponentPropsWithoutRef<"span">,
  "children"
> {
  /** The SVG to render — an inline `<svg>` or an SVG component. */
  children: ReactNode;
  /**
   * Accessible label. When provided the icon is exposed as an image; when
   * omitted the icon is decorative and hidden from assistive tech.
   */
  label?: string;
}
