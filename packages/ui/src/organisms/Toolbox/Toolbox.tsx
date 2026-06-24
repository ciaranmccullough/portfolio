import { cn } from "../../cn";
import type { ToolboxProps } from "./Toolbox.types";

/**
 * Toolbox — a responsive grid of SkillCategory cards (passed as children).
 */
export function Toolbox({ className, children, ...props }: ToolboxProps) {
  return (
    <section
      className={cn("mx-auto max-w-5xl px-6 py-16", className)}
      {...props}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>
    </section>
  );
}
