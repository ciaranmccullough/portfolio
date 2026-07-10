/** A "selected work" project as the UI consumes it — the clean frontend entity. */
export interface Project {
  /** Slug linking this card to its `/story/:id` case study; absent when none exists yet. */
  id?: string;
  title: string;
  description: string;
  href: string;
  tags: string[];
  imageUrl: string;
}
