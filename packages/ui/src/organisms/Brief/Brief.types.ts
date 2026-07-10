import type { ComponentPropsWithoutRef, ReactNode } from "react";

/** Props for the {@link Brief} organism. Renders a `<section>`. */
export interface BriefProps extends Omit<
  ComponentPropsWithoutRef<"section">,
  "title"
> {
  /** Mono kicker above the statement, e.g. "// THE BRIEF". */
  eyebrow?: ReactNode;
  /**
   * The brief statement. The app renders Contentful Rich Text (or any other
   * markup, e.g. plain `<p>`s) into this slot — Brief has no knowledge of
   * rich text itself; it only applies the large statement-scale typography
   * that whatever is passed inherits.
   */
  body: ReactNode;
}
