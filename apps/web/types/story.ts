import type { Document } from "@contentful/rich-text-types";

/** A pillar/value called out in the Story's "principles" section. */
export interface StoryPrinciple {
  title: string;
  description: string;
}

/** A lesson called out in the Story's "reflections" section. */
export interface StoryReflection {
  title: string;
  description: string;
}

/** One surface/screen shown in the Story's "walkthrough" strip. */
export interface StoryWalkthrough {
  title: string;
  subtitle: string;
  description: string;
  /** Normalised, crisply-sized image URL; omitted when the CMS item has none. */
  image?: string;
}

/** A case-study Story as the UI consumes it — the clean frontend entity. */
export interface Story {
  /** The `/story/:id` slug this entry was fetched by. */
  id: string;
  title: string;
  description: string;
  role: string;
  platform: string;
  year: string;
  /** Contentful Rich Text document, rendered by the `RichText` component. */
  brief: Document;
  titlePrinciples: string;
  principles: StoryPrinciple[];
  titleWalkthrough: string;
  walkthroughs: StoryWalkthrough[];
  titleReflection: string;
  reflections: StoryReflection[];
  titleRole: string;
  descriptionRole: string;
  /**
   * Absolute, https-normalised URL for the story's background image.
   * Absent when the entry has none set, or when the linked asset is
   * unpublished — never thrown as an error.
   */
  backgroundImageUrl?: string;
}
