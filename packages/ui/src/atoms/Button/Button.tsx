import { cn } from "../../cn";
import type { ButtonProps, ButtonSize, ButtonVariant } from "./Button.types";

const variantClass: Record<ButtonVariant, string> = {
  primary: "bg-brand-violet text-white",
  dark: "bg-ink text-fg-inverse",
  ghost: "bg-transparent text-ink border border-line-strong",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "text-xs px-3 py-2 rounded-md",
  md: "text-md px-4.5 py-3 rounded-lg",
  lg: "text-lg px-6 py-3.5 rounded-xl",
};

/**
 * Button — the action atom. One `<button>`, three variants across three sizes.
 * Defaults to `type="button"` so it never submits a form by accident.
 */
export function Button({
  variant = "primary",
  size = "md",
  type = "button",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "cursor-pointer font-body font-semibold",
        variantClass[variant],
        sizeClass[size],
        className,
      )}
      {...props}
    />
  );
}
