import type { SkillCategoryTone } from "./SkillCategory.types";

export const skillCategoryBase = "rounded-2xl border border-line p-4";

/* Surface tint per tone. Kept separate from the base (which carries no bg) so
   `cn` — a plain join, no tailwind-merge — never has two bg classes to resolve. */
export const skillCategorySurface: Record<SkillCategoryTone, string> = {
  violet: "bg-tint-violet",
  orange: "bg-tint-orange",
  green: "bg-tint-green",
  amber: "bg-tint-amber",
};

export const skillCategoryTitleBase =
  "mb-3 flex items-center gap-2 font-heading text-lg font-bold";

export const skillCategoryTitleTone: Record<SkillCategoryTone, string> = {
  violet: "text-brand-violet",
  orange: "text-brand-orange",
  green: "text-brand-green",
  amber: "text-brand-amber",
};

export const skillCategoryDotBase = "size-2.5 rounded-full";

export const skillCategoryDotTone: Record<SkillCategoryTone, string> = {
  violet: "bg-brand-violet",
  orange: "bg-brand-orange",
  green: "bg-brand-green",
  amber: "bg-brand-amber",
};

export const skillCategoryListClass = "flex list-none flex-wrap gap-1.5";
