import { cn } from "../../cn";
import {
  skillCategoryBase,
  skillCategoryDotBase,
  skillCategoryDotTone,
  skillCategoryListClass,
  skillCategorySurface,
  skillCategoryTitleBase,
  skillCategoryTitleTone,
} from "./SkillCategory.styles";
import type { SkillCategoryProps } from "./SkillCategory.types";

/**
 * SkillCategory — a titled, tinted card grouping related skill items. The
 * heading names the group; the items live in a `<ul>`. `tone` colour-codes the
 * surface, heading and dot.
 */
export function SkillCategory({
  title,
  tone = "violet",
  children,
  className,
  ...props
}: SkillCategoryProps) {
  return (
    <section
      className={cn(skillCategoryBase, skillCategorySurface[tone], className)}
      {...props}
    >
      <h3 className={cn(skillCategoryTitleBase, skillCategoryTitleTone[tone])}>
        <span
          aria-hidden="true"
          className={cn(skillCategoryDotBase, skillCategoryDotTone[tone])}
        />
        {title}
      </h3>
      <ul className={skillCategoryListClass}>{children}</ul>
    </section>
  );
}
