import type { RepoRowTone } from "@portfolio/ui";

/** An open-source repo as the UI consumes it — the clean frontend entity. */
export interface Repo {
  name: string;
  href: string;
  /** One-line description; omitted when the CMS entry has none. */
  description?: string;
  /** Primary language label, e.g. "TypeScript". */
  lang?: string;
  /** Pre-formatted star label, e.g. "1.2k". */
  stars?: string;
  /** Accent tone for the row's dots; positional default applied at render. */
  tone?: RepoRowTone;
}
