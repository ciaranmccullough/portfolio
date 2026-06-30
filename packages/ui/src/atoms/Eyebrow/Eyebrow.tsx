import { cn } from "../../cn";
import { eyebrowBase, eyebrowTone, eyebrowToneOnDark } from "./Eyebrow.styles";
import type { EyebrowProps } from "./Eyebrow.types";

/**
 * Eyebrow — a mono, uppercase kicker that sits above a heading. Renders a `<p>`.
 * Pass `onDark` when placed on a dark surface so the colour clears AA contrast.
 */
export function Eyebrow({
  tone = "violet",
  onDark = false,
  className,
  ...props
}: EyebrowProps) {
  const toneClass = (onDark ? eyebrowToneOnDark : eyebrowTone)[tone];
  return <p className={cn(eyebrowBase, toneClass, className)} {...props} />;
}
