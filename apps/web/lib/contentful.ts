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
  // -v3: bust a stale cache entry restored from build cache — an earlier deploy
  // (before the Contentful env vars were set on Vercel) cached `null`, and the
  // restored build cache kept serving it. A fresh key forces a real fetch.
  ["contentful-hero-v3"],
);

/**
 * Server-side data access for the Hero: fetch (service) → map (mapper), cached
 * as ISR. Returns `null` when the entry is missing or the request fails — the
 * page renders an error screen rather than fake fallback content.
 */
export async function getHero(): Promise<Hero | null> {
  // TEMP DIAGNOSTIC — remove once the Vercel env is confirmed working.
  // Logs whether the credentials reached this process and the real error, since
  // both "missing creds" and "bad token" otherwise fail silently as `null`.
  try {
    const hero = await getHeroCached();
    if (!hero) {
      console.error("[diag] getHero returned null", {
        hasSpace: Boolean(process.env.CONTENTFUL_SPACE_ID),
        spaceLen: process.env.CONTENTFUL_SPACE_ID?.length,
        hasToken: Boolean(process.env.CONTENTFUL_ACCESS_TOKEN),
        tokenLen: process.env.CONTENTFUL_ACCESS_TOKEN?.length,
        environment: process.env.CONTENTFUL_ENVIRONMENT,
      });
    }
    return hero;
  } catch (error) {
    console.error("[diag] getHero threw", {
      hasSpace: Boolean(process.env.CONTENTFUL_SPACE_ID),
      spaceLen: process.env.CONTENTFUL_SPACE_ID?.length,
      hasToken: Boolean(process.env.CONTENTFUL_ACCESS_TOKEN),
      tokenLen: process.env.CONTENTFUL_ACCESS_TOKEN?.length,
      environment: process.env.CONTENTFUL_ENVIRONMENT,
      message: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

const getAboutCached = withCache(async () => {
  const raw = await fetchAboutEntry();
  return raw ? mapAbout(raw) : null;
}, ["contentful-about-v2"]);

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
}, ["contentful-contact-v2"]);

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
}, ["contentful-projects-v2"]);

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
  ["contentful-entry-count-v2"],
);

/** Total published Contentful entry count (footer stat); `null` when absent. */
export async function getEntryCount(): Promise<number | null> {
  try {
    return await getEntryCountCached();
  } catch {
    return null;
  }
}
