import type { ComponentPropsWithoutRef, ReactNode } from "react";

/** A floating tech tab in the {@link Hero}: an icon paired with a label. */
export interface HeroTab {
  /** The tech icon — an SVG rendered through the Icon atom. */
  icon: ReactNode;
  /** The tech name. */
  title: ReactNode;
}

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
  /** Floating tech tabs shown below the actions. */
  tabs?: HeroTab[];
}
