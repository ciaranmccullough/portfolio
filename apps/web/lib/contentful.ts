import { unstable_cache } from "next/cache";

import { mapAbout } from "@/mappers/aboutMapper";
import { mapContact } from "@/mappers/contactMapper";
import { mapHero } from "@/mappers/heroMapper";
import { mapOpenSource } from "@/mappers/openSourceMapper";
import { mapProjects } from "@/mappers/projectsMapper";
import { mapStory } from "@/mappers/storyMapper";
import {
  PRIVACY_CONTENT_TYPES,
  TERMS_CONTENT_TYPES,
  fetchAboutEntry,
  fetchContactEntry,
  fetchHeroEntry,
  fetchLegalDocument,
  fetchOpenSource,
  fetchProjects,
  fetchStoryEntry,
} from "@/services/contentful/contentful";
import type { About } from "@/types/about";
import type { Contact } from "@/types/contact";
import type { Hero } from "@/types/hero";
import type { LegalDocument } from "@/types/legal";
import type { Project } from "@/types/project";
import type { Repo } from "@/types/openSource";
import type { Story } from "@/types/story";

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
  try {
    return await getHeroCached();
  } catch {
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

const getOpenSourceCached = withCache(async () => {
  const raw = await fetchOpenSource();
  return raw ? mapOpenSource(raw) : null;
}, ["contentful-open-source-v1"]);

/**
 * Server-side data access for the Open Source section: fetch (service) → map
 * (mapper), cached as ISR. Returns `null` when the entry is missing or fails.
 */
export async function getOpenSource(): Promise<Repo[] | null> {
  try {
    return await getOpenSourceCached();
  } catch {
    return null;
  }
}

// The legal pages need no mapper: the Rich Text document the service returns is
// exactly the entity the `RichText` component renders.
const getPrivacyPolicyCached = withCache(
  () => fetchLegalDocument(PRIVACY_CONTENT_TYPES),
  ["contentful-privacy-policy-v1"],
);

/**
 * Server-side data access for the Privacy Policy body (Contentful Rich Text),
 * cached as ISR. Returns `null` when the entry is missing or the request fails —
 * the page then falls back to its placeholder copy.
 */
export async function getPrivacyPolicy(): Promise<LegalDocument | null> {
  try {
    return await getPrivacyPolicyCached();
  } catch {
    return null;
  }
}

const getTermsAndConditionsCached = withCache(
  () => fetchLegalDocument(TERMS_CONTENT_TYPES),
  ["contentful-terms-v1"],
);

/**
 * Server-side data access for the Terms body (Contentful Rich Text), cached as
 * ISR. Returns `null` when the entry is missing or the request fails — the page
 * then falls back to its placeholder copy.
 */
export async function getTermsAndConditions(): Promise<LegalDocument | null> {
  try {
    return await getTermsAndConditionsCached();
  } catch {
    return null;
  }
}

/**
 * Cached accessor for one story entry, keyed by id — unlike the singleton
 * sections above (one shared cache entry each), every story needs its own.
 * `withCache` is invoked fresh per call so `id` can sit directly in
 * `keyParts`: Next's `unstable_cache` derives its lookup key from that array's
 * *content* (plus the wrapped function's source text and call arguments), not
 * from the wrapping closure's identity, so this reuses the cache correctly
 * across calls/requests despite not being a single module-level `const` like
 * the accessors above.
 */
function getStoryCached(id: string): Promise<Story | null> {
  return withCache(async () => {
    const raw = await fetchStoryEntry(id);
    return raw ? mapStory(raw) : null;
  }, ["contentful-story-v1", id])();
}

/**
 * Sentinel returned by {@link getStory} when the underlying fetch/API call
 * failed (network error, Contentful outage, unexpected shape, etc.) — as
 * opposed to `null`, which means Contentful simply has no story published for
 * that id. Every other accessor in this module collapses "missing" and
 * "failed" into a single `null` (the page always renders the `ErrorScreen`);
 * a story page needs the two states told apart so it can 404 on a genuine
 * not-found and reserve the `ErrorScreen` for real failures.
 */
export const STORY_FETCH_ERROR = "story-fetch-error" as const;

/**
 * Server-side data access for one Story (case study): fetch (service) → map
 * (mapper), cached as ISR per id. Unlike every other accessor in this module,
 * `null` here means specifically "no story exists for this id" — the intended
 * page usage is `notFound()` on `null` and the `ErrorScreen` on
 * {@link STORY_FETCH_ERROR}:
 *
 * ```ts
 * const result = await getStory(id);
 * if (result === null) return notFound();
 * if (result === STORY_FETCH_ERROR) return <ErrorScreen ... />;
 * const story = result; // Story
 * ```
 *
 * Note: like every other accessor here, missing Contentful credentials also
 * resolve to `null` (via `fetchStoryEntry`'s `hasContentfulCredentials`
 * guard) rather than {@link STORY_FETCH_ERROR} — an unconfigured deployment
 * therefore reads as "not found" for this accessor specifically, not as an
 * error. That mirrors every sibling fetch function's guard exactly; the
 * distinction this design adds is only between "zero matching entries" and a
 * "thrown request failure".
 */
export async function getStory(
  id: string,
): Promise<Story | null | typeof STORY_FETCH_ERROR> {
  try {
    return await getStoryCached(id);
  } catch {
    return STORY_FETCH_ERROR;
  }
}
