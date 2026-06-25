import type { ComponentPropsWithoutRef } from "react";

export type ButtonVariant = "primary" | "dark" | "ghost" | "ghost-dark";
export type ButtonSize = "sm" | "md" | "lg";

/** Props for the {@link Button} atom. Extends native `<button>` attributes. */
export interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}
