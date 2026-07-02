import type { ComponentPropsWithoutRef, ReactNode } from "react";

/** Accent tone for a row's status/language dots — a brand token, not a raw hex. */
export type RepoRowTone = "violet" | "orange" | "green" | "amber";

/**
 * Props for the {@link RepoRow} molecule. Renders an `<li>` containing a link.
 * The native `lang` attribute is omitted so `lang` can carry the repo's language
 * label (a ReactNode) rather than a BCP-47 string.
 */
export interface RepoRowProps extends Omit<
  ComponentPropsWithoutRef<"li">,
  "lang"
> {
  /** Repository name, e.g. "ciaran/enterprise-ui". */
  name: ReactNode;
  /** Link target. */
  href: string;
  /** One-line description shown between the name and the language. */
  description?: ReactNode;
  /** Primary language label, e.g. "TypeScript"; paired with a tone dot. */
  lang?: ReactNode;
  /** Star count label. */
  stars?: ReactNode;
  /** Accent tone for the status and language dots. Defaults to `violet`. */
  tone?: RepoRowTone;
}
