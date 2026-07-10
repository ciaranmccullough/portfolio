import type { ComponentPropsWithoutRef, ReactNode } from "react";

/** One principle in the {@link Principles} section. */
export interface Principle {
  title: ReactNode;
  description?: ReactNode;
}

/** Props for the {@link Principles} organism. Renders a `<section>`. */
export interface PrinciplesProps extends Omit<
  ComponentPropsWithoutRef<"section">,
  "title"
> {
  /** Mono kicker above the heading. */
  eyebrow?: ReactNode;
  /** Section heading (e.g. "Three ideas held it together"). */
  title?: ReactNode;
  /** Rendered as an ordered, numbered grid of PrincipleCards. */
  principles: Principle[];
}
