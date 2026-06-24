import { cn } from "../../cn";
import { toolboxClass, toolboxGridClass } from "./Toolbox.styles";
import type { ToolboxProps } from "./Toolbox.types";

/**
 * Toolbox — a responsive grid of SkillCategory cards (passed as children).
 */
export function Toolbox({ className, children, ...props }: ToolboxProps) {
  return (
    <section className={cn(toolboxClass, className)} {...props}>
      <div className={toolboxGridClass}>{children}</div>
    </section>
  );
}
