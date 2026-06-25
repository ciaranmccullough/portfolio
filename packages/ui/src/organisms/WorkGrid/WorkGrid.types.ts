import type { ComponentPropsWithoutRef, ReactNode } from "react";

export interface WorkProject {
  title: ReactNode;
  /** Supporting copy shown under the title. */
  description?: ReactNode;
  tags?: string[];
  /** Optional cover media slot (e.g. a `next/image`), shown flush at the top. */
  media?: ReactNode;
  /** Optional external URL; when set the title links out and a ↗ is shown. */
  href?: string;
}

/** Props for the {@link WorkGrid} organism. Renders a `<section>`. */
export interface WorkGridProps extends Omit<
  ComponentPropsWithoutRef<"section">,
  "title"
> {
  /** Mono kicker above the heading. */
  eyebrow?: ReactNode;
  /** Section heading (e.g. "Things I've shipped"). */
  title?: ReactNode;
  /** Small mono note shown opposite the heading (e.g. "// 2 of many"). */
  meta?: ReactNode;
  projects: WorkProject[];
}
