import type { ComponentPropsWithoutRef, ReactNode } from "react";

/**
 * Props for the {@link SkillCategory} molecule. Renders a titled `<section>`
 * wrapping a `<ul>` of children (e.g. Tag / SkillPill items).
 */
export interface SkillCategoryProps extends Omit<
  ComponentPropsWithoutRef<"section">,
  "title"
> {
  /** Category title (rendered as an `<h3>`). */
  title: ReactNode;
}
