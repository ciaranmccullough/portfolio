import { cn } from "../../cn";
import { ctaGroupClass } from "./CtaGroup.styles";
import type { CtaGroupProps } from "./CtaGroup.types";

/**
 * CtaGroup — lays out paired primary/secondary actions in a row that wraps.
 * Pass the action controls (Button / Link) as children.
 */
export function CtaGroup({ className, children, ...props }: CtaGroupProps) {
  return (
    <div role="group" className={cn(ctaGroupClass, className)} {...props}>
      {children}
    </div>
  );
}
