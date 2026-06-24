import { cn } from "../../cn";
import { skillPillBase, skillPillTone } from "./SkillPill.styles";
import type { SkillPillProps } from "./SkillPill.types";

/**
 * SkillPill — a brand-coloured, neobrutalist chip (glyph + label, hard shadow).
 * Renders an `<li>`; place inside a `<ul>`.
 */
export function SkillPill({
  tone = "android",
  icon,
  className,
  children,
  ...props
}: SkillPillProps) {
  return (
    <li
      className={cn(skillPillBase, skillPillTone[tone], className)}
      {...props}
    >
      {icon}
      {children}
    </li>
  );
}
