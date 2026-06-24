import type { ComponentPropsWithoutRef, ReactNode } from "react";

export type SkillPillTone = "android" | "react" | "violet" | "orange" | "green";

/** Props for the {@link SkillPill} atom. Renders an `<li>`; use within a list. */
export interface SkillPillProps extends ComponentPropsWithoutRef<"li"> {
  /** Brand colour of the pill background. */
  tone?: SkillPillTone;
  /** Optional leading glyph (e.g. an `<Icon />`). */
  icon?: ReactNode;
}
