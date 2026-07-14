/** A "selected work" project as the UI consumes it — the clean frontend entity. */
export interface Project {
  /** Slug linking this card to its `/story/:id` case study; absent when none exists yet. */
  id?: string;
  title: string;
  description: string;
  href: string;
  tags: string[];
  imageUrl: string;
  /** Whether this project has a `/story/:id` case study to link to instead of `href`. Defaults to `false` (mapper-normalised — never absent here). */
  isStoryProject: boolean;
}
