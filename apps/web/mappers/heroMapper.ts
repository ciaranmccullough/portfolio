import type { Hero, RawHeroFields } from "@/types/hero";

/** Map the raw Contentful "project" fields (DTO) to the {@link Hero} entity. */
export function mapHero(raw: RawHeroFields): Hero {
  return {
    title: raw.title,
    description: raw.description,
    resumeUrl: raw.resume,
  };
}
