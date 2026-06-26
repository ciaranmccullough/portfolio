import type { ComponentPropsWithoutRef, ReactNode } from "react";

/** Colour accent for a {@link SkillCategory} card (surface, heading and dot). */
export type SkillCategoryTone = "violet" | "orange" | "green" | "amber";

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
  /** Colour-codes the surface tint, heading and dot. Defaults to `"violet"`. */
  tone?: SkillCategoryTone;
}
