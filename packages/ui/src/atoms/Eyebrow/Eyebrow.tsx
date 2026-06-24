import { cn } from "../../cn";
import type { EyebrowProps, EyebrowTone } from "./Eyebrow.types";

const toneClass: Record<EyebrowTone, string> = {
  violet: "text-brand-violet",
  orange: "text-brand-orange",
  green: "text-brand-green",
};

/**
 * Eyebrow — a mono, uppercase kicker that sits above a heading. Renders a `<p>`.
 */
export function Eyebrow({
  tone = "violet",
  className,
  ...props
}: EyebrowProps) {
  return (
    <p
      className={cn(
        "font-mono text-sm font-bold uppercase tracking-wider",
        toneClass[tone],
        className,
      )}
      {...props}
    />
  );
}
