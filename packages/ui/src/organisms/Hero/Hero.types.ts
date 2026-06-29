import type { ComponentPropsWithoutRef, ReactNode } from "react";

/** A floating tech tab in the {@link Hero}: an icon paired with a label. */
export interface HeroTab {
  /**
   * The tech icon — a rendered icon element (an Icon-atom glyph such as the
   * app's `<ReactIcon />`), placed as-is. Size it via the element's own
   * `className` (e.g. `size-4`).
   */
  icon: ReactNode;
  /** The tech name. */
  title: ReactNode;
  /** Optional per-tab classes, e.g. a brand background colour. */
  className?: string;
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
