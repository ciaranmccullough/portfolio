import { createClient } from "contentful";

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
 * Fetch entries without throwing. Returns `null` when credentials are absent
 * (so production builds never touch the network) or when the API call fails at
 * runtime — both acceptable for this skeleton.
 */
export async function getEntriesSafe() {
  if (!hasContentfulCredentials) return null;
  try {
    return await contentfulClient.getEntries();
  } catch {
    return null;
  }
}
