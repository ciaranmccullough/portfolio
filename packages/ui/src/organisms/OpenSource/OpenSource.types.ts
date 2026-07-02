import type { ComponentPropsWithoutRef, ReactNode } from "react";

/**
 * Props for the {@link OpenSource} organism. Renders a `<section>` with an
 * optional header (eyebrow + heading + action) above one bordered panel whose
 * children are RepoRow items.
 */
export interface OpenSourceProps extends Omit<
  ComponentPropsWithoutRef<"section">,
  "title"
> {
  /** Mono kicker above the heading. */
  eyebrow?: ReactNode;
  /** Section heading (e.g. "Open source"). */
  title?: ReactNode;
  /** Optional action shown opposite the heading (e.g. a "github.com/ciaran ↗" link). */
  action?: ReactNode;
}
