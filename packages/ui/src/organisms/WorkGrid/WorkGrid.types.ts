import type { ComponentPropsWithoutRef, ReactNode } from "react";

export interface WorkProject {
  title: ReactNode;
  /** Supporting copy shown under the title. */
  description?: ReactNode;
  tags?: string[];
  /** Optional cover media slot (e.g. a `next/image`), shown flush at the top. */
  media?: ReactNode;
  /** Optional URL; when set the title links out and a ↗ is shown. */
  href?: string;
  /**
   * Marks `href` as an in-app route rather than an external URL: the link
   * renders without `target="_blank"`/`rel="noopener noreferrer"` and omits
   * the external-link ↗ arrow (which specifically signals "opens in a new
   * tab"). WorkGrid stays agnostic to *how* the route is built — the app
   * computes `href` (e.g. via `localePath`) either way; this always renders
   * a plain `<a>`. Defaults to `false`, preserving today's always-external
   * behaviour for every existing call site.
   */
  internal?: boolean;
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
