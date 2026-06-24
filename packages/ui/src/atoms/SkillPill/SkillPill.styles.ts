import type { SkillPillTone } from "./SkillPill.types";

export const skillPillBase =
  "inline-flex list-none items-center gap-1.5 rounded-lg border-2 border-ink px-3 py-2 font-mono text-sm font-bold text-ink shadow-brutal";

export const skillPillTone: Record<SkillPillTone, string> = {
  android: "bg-accent-android",
  react: "bg-accent-react",
  violet: "bg-brand-violet",
  orange: "bg-brand-orange",
  green: "bg-brand-green",
};
