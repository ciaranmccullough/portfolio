import type { RawHeroFields } from "@/services/contentful";

/** Hero content as the UI consumes it — the clean frontend entity. */
export interface Hero {
  title: string;
  description: string;
  resumeUrl: string;
}

/** Map the raw Contentful "project" fields (DTO) to the {@link Hero} entity. */
export function mapHero(raw: RawHeroFields): Hero {
  return {
    title: raw.title,
    description: raw.description,
    resumeUrl: raw.resume,
  };
}
