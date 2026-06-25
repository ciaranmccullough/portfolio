import {
  createClient,
  type EntryFieldTypes,
  type EntrySkeletonType,
} from "contentful";
import { unstable_cache } from "next/cache";

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
const environment = process.env.CONTENTFUL_ENVIRONMENT ?? "master";

/**
 * Contentful Content Delivery API client.
 *
 * Instantiated at module load so the SDK wrapper compiles regardless of whether
 * credentials are present. Placeholder values keep `createClient` happy; only a
 * real network request requires valid credentials.
 *
 * NOTE: the Delivery API needs a *Content Delivery* access token. A Management
 * token (`CFPAT-…`) is rejected with `AccessTokenInvalid`, in which case the
 * helpers below fall back to defaults.
 */
export const contentfulClient = createClient({
  space: spaceId ?? "missing-space-id",
  accessToken: accessToken ?? "missing-access-token",
  environment,
});

/** True only when real Contentful credentials are configured via the env. */
export const hasContentfulCredentials = Boolean(spaceId && accessToken);

/**
 * Seconds Next serves cached content before regenerating it in the background
 * (ISR). One hour keeps the portfolio fresh without hitting the Contentful API
 * on every request.
 */
const REVALIDATE_SECONDS = 3600;

/**
 * Cached Contentful fetch. The `contentful` SDK uses axios, which Next's
 * automatic fetch cache cannot see, so we opt into the Data Cache explicitly.
 * `unstable_cache` stores the result and revalidates it on the interval above —
 * this is what renders the page as ISR rather than per-request SSR. Purge early
 * with `revalidateTag("contentful")` from a webhook when content changes.
 */
const getEntriesCached = unstable_cache(
  () => contentfulClient.getEntries(),
  ["contentful-entries"],
  { revalidate: REVALIDATE_SECONDS, tags: ["contentful"] },
);

/**
 * Fetch entries without throwing. Returns `null` when credentials are absent
 * (so production builds never touch the network) or when the API call fails at
 * runtime — both acceptable for this skeleton.
 */
export async function getEntriesSafe() {
  if (!hasContentfulCredentials) return null;
  try {
    return await getEntriesCached();
  } catch {
    return null;
  }
}

/**
 * The Contentful "project" content type (display name "Hero"): the hero's
 * title, description and résumé link.
 */
type ProjectSkeleton = EntrySkeletonType<
  {
    title: EntryFieldTypes.Symbol;
    description: EntryFieldTypes.Symbol;
    resume: EntryFieldTypes.Symbol;
  },
  "project"
>;

/** Resolved hero content consumed by the Hero organism. */
export interface HeroContent {
  title: string;
  description: string;
  resume: string;
}

/**
 * Served when Contentful is unreachable (no credentials, a network failure, or
 * an invalid token) so the build and runtime always have content. Swap the
 * `.env` token for a Content Delivery API key to serve live data.
 */
const HERO_FALLBACK: HeroContent = {
  title: "Hello, I am Ciaran and I'm a Software Engineer from London",
  description:
    "Frontend engineer with 5+ years experience building enterprise applications with speed, precision and craft.",
  resume: "#",
};

const getHeroCached = unstable_cache(
  () =>
    contentfulClient.getEntries<ProjectSkeleton>({
      content_type: "project",
      limit: 1,
    }),
  ["contentful-hero"],
  { revalidate: REVALIDATE_SECONDS, tags: ["contentful"] },
);

/**
 * Fetch the Hero content from Contentful, falling back to {@link HERO_FALLBACK}
 * when credentials are absent or the request fails — so the page always renders.
 */
export async function getHeroSafe(): Promise<HeroContent> {
  if (!hasContentfulCredentials) return HERO_FALLBACK;
  try {
    const fields = (await getHeroCached()).items[0]?.fields;
    if (!fields) return HERO_FALLBACK;
    return {
      title: fields.title,
      description: fields.description,
      resume: fields.resume,
    };
  } catch {
    return HERO_FALLBACK;
  }
}
