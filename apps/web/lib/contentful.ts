import { unstable_cache } from "next/cache";

import { mapAbout } from "@/mappers/aboutMapper";
import { mapContact } from "@/mappers/contactMapper";
import { mapHero } from "@/mappers/heroMapper";
import { mapProjects } from "@/mappers/projectsMapper";
import {
  fetchAboutEntry,
  fetchContactEntry,
  fetchEntryCount,
  fetchHeroEntry,
  fetchProjects,
} from "@/services/contentful/contentful";
import type { About } from "@/types/about";
import type { Contact } from "@/types/contact";
import type { Hero } from "@/types/hero";
import type { Project } from "@/types/project";

/**
 * Seconds Next serves cached content before regenerating it in the background
 * (ISR). One hour keeps the portfolio fresh without hitting Contentful on every
 * request. Purge early with `revalidateTag("contentful")` from a webhook.
 */
const REVALIDATE_SECONDS = 3600;

/**
 * Wrap a Contentful fetch+map in the ISR data cache — but only in production. In
 * development the cache is bypassed so edits in Contentful show on the next
 * refresh instead of waiting out the revalidate window.
 */
function withCache<T>(fn: () => Promise<T>, key: string[]): () => Promise<T> {
  if (process.env.NODE_ENV !== "production") return fn;
  return unstable_cache(fn, key, {
    revalidate: REVALIDATE_SECONDS,
    tags: ["contentful"],
  });
}

const getHeroCached = withCache(
  async () => {
    const raw = await fetchHeroEntry();
    return raw ? mapHero(raw) : null;
  },
  // -v2: the Hero shape changed (title: string -> TitleSegment[]); a fresh key
  // avoids serving a stale, old-shaped cache entry after deploy.
  ["contentful-hero-v2"],
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

const getAboutCached = withCache(async () => {
  const raw = await fetchAboutEntry();
  return raw ? mapAbout(raw) : null;
}, ["contentful-about-v1"]);

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

const getContactCached = withCache(async () => {
  const raw = await fetchContactEntry();
  return raw ? mapContact(raw) : null;
}, ["contentful-contact-v1"]);

/**
 * Server-side data access for the Contact section: fetch (service) → map
 * (mapper), cached as ISR. Returns `null` when the entry is missing or fails.
 */
export async function getContact(): Promise<Contact | null> {
  try {
    return await getContactCached();
  } catch {
    return null;
  }
}

const getProjectsCached = withCache(async () => {
  const raw = await fetchProjects();
  return raw ? mapProjects(raw) : null;
}, ["contentful-projects-v1"]);

/**
 * Server-side data access for the Projects (WorkGrid) section: fetch (service) →
 * map (mapper), cached as ISR. Returns `null` when the entry is missing or fails.
 */
export async function getProjects(): Promise<Project[] | null> {
  try {
    return await getProjectsCached();
  } catch {
    return null;
  }
}

const getEntryCountCached = withCache(
  () => fetchEntryCount(),
  ["contentful-entry-count"],
);

/** Total published Contentful entry count (footer stat); `null` when absent. */
export async function getEntryCount(): Promise<number | null> {
  try {
    return await getEntryCountCached();
  } catch {
    return null;
  }
}
