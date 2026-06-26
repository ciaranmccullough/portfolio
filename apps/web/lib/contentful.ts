import { unstable_cache } from "next/cache";

import { mapAbout } from "@/mappers/aboutMapper";
import { mapHero } from "@/mappers/heroMapper";
import {
  fetchAboutEntry,
  fetchEntryCount,
  fetchHeroEntry,
} from "@/services/contentful/contentful";
import type { About } from "@/types/about";
import type { Hero } from "@/types/hero";

/**
 * Seconds Next serves cached content before regenerating it in the background
 * (ISR). One hour keeps the portfolio fresh without hitting Contentful on every
 * request. Purge early with `revalidateTag("contentful")` from a webhook.
 */
const REVALIDATE_SECONDS = 3600;

const getHeroCached = unstable_cache(
  async () => {
    const raw = await fetchHeroEntry();
    return raw ? mapHero(raw) : null;
  },
  // -v2: the Hero shape changed (title: string -> TitleSegment[]); a fresh key
  // avoids serving a stale, old-shaped cache entry after deploy.
  ["contentful-hero-v2"],
  { revalidate: REVALIDATE_SECONDS, tags: ["contentful"] },
);

/**
 * Server-side data access for the Hero: fetch (service) → map (mapper), cached
 * as ISR. Returns `null` when the entry is missing or the request fails — the
 * page renders an error screen rather than fake fallback content.
 */
export async function getHero(): Promise<Hero | null> {
  try {
    return await getHeroCached();
  } catch {
    return null;
  }
}

const getAboutCached = unstable_cache(
  async () => {
    const raw = await fetchAboutEntry();
    return raw ? mapAbout(raw) : null;
  },
  ["contentful-about-v1"],
  { revalidate: REVALIDATE_SECONDS, tags: ["contentful"] },
);

/**
 * Server-side data access for the About section: fetch (service) → map (mapper),
 * cached as ISR. Returns `null` when the entry is missing or the request fails.
 */
export async function getAbout(): Promise<About | null> {
  try {
    return await getAboutCached();
  } catch {
    return null;
  }
}

const getEntryCountCached = unstable_cache(
  () => fetchEntryCount(),
  ["contentful-entry-count"],
  { revalidate: REVALIDATE_SECONDS, tags: ["contentful"] },
);

/** Total published Contentful entry count (footer stat); `null` when absent. */
export async function getEntryCount(): Promise<number | null> {
  try {
    return await getEntryCountCached();
  } catch {
    return null;
  }
}
