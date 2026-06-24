import { cn } from "../../cn";
import type { CtaGroupProps } from "./CtaGroup.types";

/**
 * CtaGroup — lays out paired primary/secondary actions in a row that wraps.
 * Pass the action controls (Button / Link) as children.
 */
export function CtaGroup({ className, children, ...props }: CtaGroupProps) {
  return (
    <div
      role="group"
      className={cn("flex flex-wrap items-center gap-2.5", className)}
      {...props}
    >
      {children}
    </div>
  );
}
