import type { ComponentPropsWithoutRef, ReactNode } from "react";

/** One card in the {@link Reflection} section. */
export interface ReflectionItem {
  title: ReactNode;
  description?: ReactNode;
  /**
   * Highlights the heading in the accent colour (e.g. the design's one
   * violet-accented card). The real CMS data carries no per-item colour
   * field, so this defaults to `false` — most items render in ink.
   */
  accent?: boolean;
}

/** Props for the {@link Reflection} organism. Renders a `<section>`. */
export interface ReflectionProps extends Omit<
  ComponentPropsWithoutRef<"section">,
  "title"
> {
  /** Mono kicker above the heading, e.g. "// REFLECTION". */
  eyebrow?: ReactNode;
  /** Section heading (e.g. "What it taught me"). */
  title?: ReactNode;
  reflections: ReflectionItem[];
}
