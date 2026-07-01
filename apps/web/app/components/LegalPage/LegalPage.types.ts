import type { ReactNode } from "react";

/** Props for {@link LegalPage} — a simple, static legal/policy article. */
export interface LegalPageProps {
  /** Mono kicker above the title, e.g. "Legal". */
  eyebrow: string;
  /** Page title. */
  title: string;
  /** Back-link label. */
  backLabel: string;
  /** Back-link href (usually the localised home page). */
  backHref: string;
  /** The page body — Contentful Rich Text, or the placeholder fallback. */
  children: ReactNode;
}
