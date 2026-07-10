import type { ComponentPropsWithoutRef, ReactNode } from "react";

/** One entry in the {@link CaseStudyHero} meta row, e.g. ROLE / PLATFORM / YEAR. */
export interface CaseStudyHeroMetaItem {
  label: ReactNode;
  value: ReactNode;
}

/** Props for the {@link CaseStudyHero} organism. Renders a `<section>`. */
export interface CaseStudyHeroProps extends Omit<
  ComponentPropsWithoutRef<"section">,
  "title"
> {
  /** Mono kicker above the heading, e.g. "// CASE STUDY — EA SPORTS". */
  eyebrow?: ReactNode;
  /** The H1 title. */
  title: ReactNode;
  /** Standfirst / description copy below the title. */
  description?: ReactNode;
  /**
   * Optional decorative background media (e.g. a `next/image` with `fill`),
   * masked and faded by this component. The CMS `backgroundImage` asset can
   * be entirely missing — omit this prop and the hero renders without that
   * layer rather than showing a broken slot.
   */
  backgroundImage?: ReactNode;
  /** Labelled meta row, e.g. ROLE / PLATFORM / YEAR. Omitted entirely when empty. */
  meta?: CaseStudyHeroMetaItem[];
  /**
   * Label for the decorative scroll cue at the foot of the hero (e.g. "Scroll
   * to begin"). The leading arrow is rendered by this component. Omit to
   * hide the cue entirely.
   */
  scrollCueLabel?: ReactNode;
}
