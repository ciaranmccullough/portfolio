import { cn } from "../../cn";
import { buttonBase, buttonSize, buttonVariant } from "./Button.styles";
import type { ButtonProps } from "./Button.types";

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
        buttonBase,
        buttonVariant[variant],
        buttonSize[size],
        className,
      )}
      {...props}
    />
  );
}
