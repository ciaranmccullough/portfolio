import { cn } from "../../cn";
import { eyebrowBase, eyebrowTone } from "./Eyebrow.styles";
import type { EyebrowProps } from "./Eyebrow.types";

/**
 * Eyebrow — a mono, uppercase kicker that sits above a heading. Renders a `<p>`.
 */
export function Eyebrow({
  tone = "violet",
  className,
  ...props
}: EyebrowProps) {
  return (
    <p className={cn(eyebrowBase, eyebrowTone[tone], className)} {...props} />
  );
}
