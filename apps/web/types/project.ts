/** A "selected work" project as the UI consumes it — the clean frontend entity. */
export interface Project {
  title: string;
  description: string;
  /** External URL the card links out to. */
  href: string;
  /** Tech tags shown as chips. */
  tags: string[];
  /** Absolute cover image URL (https). */
  imageUrl: string;
}
