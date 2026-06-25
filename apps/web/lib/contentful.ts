import { unstable_cache } from "next/cache";

import { mapHero, type Hero } from "@/mappers/heroMapper";
import { fetchEntryCount, fetchHeroEntry } from "@/services/contentful";

/**
 * Seconds Next serves cached content before regenerating it in the background
 * (ISR). One hour keeps the portfolio fresh without hitting Contentful on every
 * request. Purge early with `revalidateTag("contentful")` from a webhook.
 */
const REVALIDATE_SECONDS = 3600;

/**
 * Served when Contentful is unreachable (no credentials, network failure or an
 * invalid token) so the build and runtime always have content. Swap the env
 * token for a Content Delivery API key to serve live data.
 */
const HERO_FALLBACK: Hero = {
  title: "Hello, I am Ciaran and I'm a Software Engineer from London",
  description:
    "Frontend engineer with 5+ years experience building enterprise applications with speed, precision and craft.",
  resumeUrl: "#",
};

const getHeroCached = unstable_cache(
  async () => {
    const raw = await fetchHeroEntry();
    return raw ? mapHero(raw) : null;
  },
  ["contentful-hero"],
  { revalidate: REVALIDATE_SECONDS, tags: ["contentful"] },
);

/**
 * Server-side data access for the Hero: fetch (service) → map (mapper), cached
 * as ISR, with a fallback so the page always renders. This is the
 * server-rendered equivalent of a client data-fetching hook.
 */
export async function getHero(): Promise<Hero> {
  try {
    return (await getHeroCached()) ?? HERO_FALLBACK;
  } catch {
    return HERO_FALLBACK;
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
