import { cn } from "../../cn";
import {
  buttonBase,
  buttonPillClass,
  buttonRadius,
  buttonSize,
  buttonVariant,
} from "./Button.styles";
import type { ButtonProps } from "./Button.types";

/**
 * Button — the action atom. One `<button>`, three variants across three sizes.
 * Defaults to `type="button"` so it never submits a form by accident. Pass
 * `pill` for a fully-rounded radius instead of the size's default corners.
 */
export function Button({
  variant = "primary",
  size = "md",
  pill = false,
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
        pill ? buttonPillClass : buttonRadius[size],
        className,
      )}
      {...props}
    />
  );
}
