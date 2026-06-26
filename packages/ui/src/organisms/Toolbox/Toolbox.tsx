import { Eyebrow, Text } from "../../atoms";
import { cn } from "../../cn";
import {
  toolboxClass,
  toolboxEyebrowClass,
  toolboxGridClass,
  toolboxHeaderClass,
} from "./Toolbox.styles";
import type { ToolboxProps } from "./Toolbox.types";

/**
 * Toolbox — the "what I reach for" section: an optional header (eyebrow +
 * heading) above a responsive grid of SkillCategory cards (passed as children).
 */
export function Toolbox({
  eyebrow,
  title,
  className,
  children,
  ...props
}: ToolboxProps) {
  return (
    <section className={cn(toolboxClass, className)} {...props}>
      {eyebrow || title ? (
        <div className={toolboxHeaderClass}>
          {eyebrow ? (
            <Eyebrow tone="orange" className={toolboxEyebrowClass}>
              {eyebrow}
            </Eyebrow>
          ) : null}
          {title ? (
            <Text as="h2" variant="h1">
              {title}
            </Text>
          ) : null}
        </div>
      ) : null}
      <div className={toolboxGridClass}>{children}</div>
    </section>
  );
}
