import { cn } from "../../cn";
import { scrollProgressBarClass } from "./ScrollProgressBar.styles";
import type { ScrollProgressBarProps } from "./ScrollProgressBar.types";

/**
 * ScrollProgressBar — a fixed, full-width fill bar pinned to the top of the
 * viewport. Purely presentational: it renders the `progress` value (0–100) as
 * a `scaleX` transform and holds no internal state or scroll listener. A
 * client wrapper in the consuming app re-renders it with the live scroll
 * position (or drives it directly via `style`).
 */
export function ScrollProgressBar({
  progress = 0,
  className,
  style,
  ...props
}: ScrollProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, progress));

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(scrollProgressBarClass, className)}
      style={{ transform: `scaleX(${clamped / 100})`, ...style }}
      {...props}
    />
  );
}
