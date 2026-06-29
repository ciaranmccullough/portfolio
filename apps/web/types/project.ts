/** A "selected work" project as the UI consumes it — the clean frontend entity. */
export interface Project {
  title: string;
  description: string;
  href: string;
  tags: string[];
  imageUrl: string;
}
