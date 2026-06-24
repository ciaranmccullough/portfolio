import { createClient } from "contentful";
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
 */
export const contentfulClient = createClient({
  space: spaceId ?? "missing-space-id",
  accessToken: accessToken ?? "missing-access-token",
  environment,
});

/** True only when real Contentful credentials are configured via the env. */
export const hasContentfulCredentials = Boolean(spaceId && accessToken);

/**
 * Seconds Next serves the cached entries before regenerating them in the
 * background (ISR). One hour keeps the portfolio fresh without hitting the
 * Contentful API on every request.
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
