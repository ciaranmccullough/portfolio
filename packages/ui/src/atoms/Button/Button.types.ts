import type { ComponentPropsWithoutRef } from "react";

export type ButtonVariant = "primary" | "dark" | "ghost" | "ghost-dark";
export type ButtonSize = "sm" | "md" | "lg";

/** Props for the {@link Button} atom. Extends native `<button>` attributes. */
export interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /**
   * Renders a fully-rounded pill instead of the size's default corner radius
   * (e.g. the Close/Role section's CTAs). Padding and text size are
   * unaffected — only the radius changes. Defaults to `false`, so existing
   * call sites are unaffected.
   */
  pill?: boolean;
}
