import {
  createClient,
  type EntryFieldTypes,
  type EntrySkeletonType,
} from "contentful";

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
const environment = process.env.CONTENTFUL_ENVIRONMENT ?? "master";

/**
 * The project's single Contentful Content Delivery API client (the global
 * API-client instance). Server-only — the access token is never exposed to the
 * browser. Placeholder values keep `createClient` happy when credentials are
 * absent; only a real request needs valid ones.
 */
export const contentfulClient = createClient({
  space: spaceId ?? "missing-space-id",
  accessToken: accessToken ?? "missing-access-token",
  environment,
});

/** True only when real Contentful credentials are configured via the env. */
export const hasContentfulCredentials = Boolean(spaceId && accessToken);

// --- Response (DTOs) ------------------------------------------------------

/** A node in a Contentful Rich Text document — only the parts we read for the
 *  hero title (text runs and their marks; `content` for nested blocks). */
export interface RichTextNode {
  nodeType: string;
  value?: string;
  marks?: { type: string }[];
  content?: RichTextNode[];
}

/** A Contentful Rich Text document (e.g. a formatted hero title). */
export interface RichTextDocument {
  nodeType: "document";
  content: RichTextNode[];
}

/**
 * Raw "project" (Hero) entry fields, exactly as the Delivery API returns them.
 * `titleRichText` is the hero title as Rich Text, so specific words can be marked
 * (bold) for highlighting. It's typed optional only defensively — an empty field
 * renders an empty title rather than throwing.
 */
export interface RawHeroFields {
  titleRichText?: RichTextDocument;
  description: string;
  resume: string;
}

type ProjectSkeleton = EntrySkeletonType<
  {
    titleRichText: EntryFieldTypes.RichText;
    description: EntryFieldTypes.Symbol;
    resume: EntryFieldTypes.Symbol;
  },
  "project"
>;

// --- Service --------------------------------------------------------------

/**
 * Fetch the raw "project" (Hero) entry fields. Returns `null` when credentials
 * are absent or nothing is published; throws on a failed request so the caller
 * decides how to recover.
 */
export async function fetchHeroEntry(): Promise<RawHeroFields | null> {
  if (!hasContentfulCredentials) return null;
  const res = await contentfulClient.getEntries<ProjectSkeleton>({
    content_type: "project",
    limit: 1,
  });
  const fields = res.items[0]?.fields;
  if (!fields) return null;
  return {
    // Optional Rich Text field; undefined until it's filled in on the entry.
    titleRichText: fields.titleRichText as RichTextDocument | undefined,
    description: fields.description,
    resume: fields.resume,
  };
}

/** Fetch the total count of published entries. `null` when no credentials. */
export async function fetchEntryCount(): Promise<number | null> {
  if (!hasContentfulCredentials) return null;
  const res = await contentfulClient.getEntries({ limit: 1 });
  return res.total;
}
