import { cn } from "../../cn";
import { iconClass } from "./Icon.styles";
import type { IconProps } from "./Icon.types";

/**
 * Icon — a pass-through wrapper for an SVG.
 *
 * Sizes the SVG (override with a `size-*` utility via `className`), inherits the
 * current text colour, and handles accessibility: decorative by default, or
 * exposed as an image when given a `label`.
 */
export function Icon({ children, label, className, ...props }: IconProps) {
  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn(iconClass, className)}
      {...props}
    >
      {children}
    </span>
  );
}
