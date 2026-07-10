/** Props for {@link SkipLink}. */
export interface SkipLinkProps {
  /** Visible label, e.g. "Skip to content". */
  label: string;
  /** `id` of the landmark to jump to (without the leading `#`) — every page's
   *  `<main>` shares this id so one skip link works site-wide. */
  targetId: string;
}
