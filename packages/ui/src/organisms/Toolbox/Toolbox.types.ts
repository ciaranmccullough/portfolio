import type { ComponentPropsWithoutRef, ReactNode } from "react";

/**
 * Props for the {@link Toolbox} organism. Renders a `<section>` with an optional
 * header (eyebrow + heading) above a responsive grid of SkillCategory cards
 * (passed as children).
 */
export interface ToolboxProps extends Omit<
  ComponentPropsWithoutRef<"section">,
  "title"
> {
  /** Mono kicker above the heading (e.g. "02 — The toolbox"). */
  eyebrow?: ReactNode;
  /** Section heading (e.g. "What I reach for"). */
  title?: ReactNode;
}
