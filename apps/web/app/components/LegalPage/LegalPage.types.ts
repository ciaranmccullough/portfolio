/** Props for {@link LegalPage} — a simple, static legal/policy article. */
export interface LegalPageProps {
  /** Mono kicker above the title, e.g. "Legal". */
  eyebrow: string;
  /** Page title. */
  title: string;
  /** Label for the "last updated" line, e.g. "Last updated". */
  updatedLabel: string;
  /** Value for the "last updated" line, e.g. a date or "Coming soon". */
  updatedValue: string;
  /** Lead paragraph shown under the title. */
  lead: string;
  /** Body paragraphs (placeholder content for now). */
  body: string[];
  /** Back-link label. */
  backLabel: string;
  /** Back-link href (usually the localised home page). */
  backHref: string;
}
