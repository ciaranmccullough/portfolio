import type { ComponentPropsWithoutRef, ReactNode } from "react";

/** A value tab in the {@link About} section: a short title + supporting line. */
export interface AboutTab {
  title: ReactNode;
  description: ReactNode;
}

/** Props for the {@link About} organism. Renders a `<section>`. */
export interface AboutProps extends Omit<
  ComponentPropsWithoutRef<"section">,
  "title"
> {
  /** Mono kicker above the heading (e.g. "03 — About"). */
  eyebrow?: ReactNode;
  /** Section heading. */
  title?: ReactNode;
  /** Biography / description copy. */
  description?: ReactNode;
  /** Optional portrait media slot (e.g. a `next/image`). */
  portrait?: ReactNode;
  /** Optional decorative sticker pinned to the portrait corner. */
  sticker?: ReactNode;
  /** Value tabs shown beside the bio. */
  tabs?: AboutTab[];
}
