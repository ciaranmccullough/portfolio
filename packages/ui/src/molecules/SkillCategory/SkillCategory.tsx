import { cn } from "../../cn";
import {
  skillCategoryClass,
  skillCategoryDotClass,
  skillCategoryListClass,
  skillCategoryTitleClass,
} from "./SkillCategory.styles";
import type { SkillCategoryProps } from "./SkillCategory.types";

/**
 * SkillCategory — a titled, tinted card grouping related skill items. The
 * heading names the group; the items live in a `<ul>`.
 */
export function SkillCategory({
  title,
  children,
  className,
  ...props
}: SkillCategoryProps) {
  return (
    <section className={cn(skillCategoryClass, className)} {...props}>
      <h3 className={skillCategoryTitleClass}>
        <span aria-hidden="true" className={skillCategoryDotClass} />
        {title}
      </h3>
      <ul className={skillCategoryListClass}>{children}</ul>
    </section>
  );
}
