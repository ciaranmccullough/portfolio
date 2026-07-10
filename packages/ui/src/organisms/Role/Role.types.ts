import type { ComponentPropsWithoutRef, ReactNode } from "react";

/** Props for the {@link Role} organism. Renders a `<section>` around one dark CTA card. */
export interface RoleProps extends Omit<
  ComponentPropsWithoutRef<"section">,
  "title"
> {
  /** Mono kicker above the heading, e.g. "// THE ROLE". Rendered with `onDark` styling. */
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /**
   * Action buttons/links, e.g. a primary + a `ghost-dark` pill `Button`. Role
   * has no opinion on copy, hrefs or count — it just lays out whatever is
   * passed.
   */
  children?: ReactNode;
}
