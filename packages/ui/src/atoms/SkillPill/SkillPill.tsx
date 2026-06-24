import { cn } from "../../cn";
import type { SkillPillProps, SkillPillTone } from "./SkillPill.types";

const toneClass: Record<SkillPillTone, string> = {
  android: "bg-accent-android",
  react: "bg-accent-react",
  violet: "bg-brand-violet",
  orange: "bg-brand-orange",
  green: "bg-brand-green",
};

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
      className={cn(
        "inline-flex list-none items-center gap-1.5 rounded-lg border-[1.5px] border-ink px-3 py-2 font-mono text-sm font-bold text-ink shadow-brutal",
        toneClass[tone],
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </li>
  );
}
