import type { ComponentPropsWithoutRef, ReactNode } from "react";

/** Props for the {@link Hero} organism. Renders a `<section>`. */
export interface HeroProps extends Omit<
  ComponentPropsWithoutRef<"section">,
  "title"
> {
  /** Small status / eyebrow badge above the heading. */
  badge?: ReactNode;
  /** The display heading. */
  title: ReactNode;
  /** Intro paragraph. */
  intro?: ReactNode;
}
