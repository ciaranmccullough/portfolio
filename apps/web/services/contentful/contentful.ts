import type { Document } from "@contentful/rich-text-types";
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

/** A value tab stored in the "about" entry's freeform `tabs` Object field. */
export interface RawAboutTab {
  title: string;
  description: string;
}

/**
 * Raw "about" entry fields, as the Delivery API returns them. `imageUrl` is the
 * linked asset's URL resolved from the include (protocol-relative, e.g.
 * `//images.ctfassets.net/…`); `tabs` is a freeform JSON array.
 */
export interface RawAboutFields {
  title: string;
  description?: string;
  imageUrl?: string;
  tabs: RawAboutTab[];
}

type AboutSkeleton = EntrySkeletonType<
  {
    title: EntryFieldTypes.Symbol;
    description: EntryFieldTypes.Text;
    image: EntryFieldTypes.AssetLink;
    tabs: EntryFieldTypes.Object;
  },
  "about"
>;

/**
 * Raw "contact" entry fields. `links` is a free array of short strings (each a
 * URL, or a `Label | URL` pair); empty/absent when none are published.
 */
export interface RawContactFields {
  title: string;
  description?: string;
  links?: string[];
}

type ContactSkeleton = EntrySkeletonType<
  {
    title: EntryFieldTypes.Symbol;
    description: EntryFieldTypes.Symbol;
    links: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
  },
  "contact"
>;

/**
 * One project inside the "projects" entry's freeform `projects` Object array.
 * `link` is the outbound URL and `tabs` holds the tech tags (the CMS field name).
 */
export interface RawProject {
  title: string;
  description?: string;
  imageUrl?: string;
  link?: string;
  tabs?: string[];
}

type ProjectsSkeleton = EntrySkeletonType<
  { projects: EntryFieldTypes.Object },
  "projects"
>;

/**
 * One repo inside the "openSource" entry's freeform `openSource` Object array.
 * Only `name` + `href` are required; `description`, `lang`, `stars` and `tone`
 * enrich the row when present. `stars` may be a number or a pre-formatted label.
 */
export interface RawRepo {
  name: string;
  href: string;
  description?: string;
  lang?: string;
  stars?: string | number;
  tone?: string;
}

type OpenSourceSkeleton = EntrySkeletonType<
  { openSource: EntryFieldTypes.Object },
  "openSource"
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

/**
 * Fetch the raw "about" entry fields, resolving the linked portrait asset's URL
 * from the include. Returns `null` when credentials are absent or nothing is
 * published; throws on a failed request so the caller decides how to recover.
 */
export async function fetchAboutEntry(): Promise<RawAboutFields | null> {
  if (!hasContentfulCredentials) return null;
  const res = await contentfulClient.getEntries<AboutSkeleton>({
    content_type: "about",
    limit: 1,
    include: 2,
  });
  const fields = res.items[0]?.fields;
  if (!fields) return null;
  // The SDK resolves the linked asset into the field; read its file URL.
  const image = fields.image as unknown as
    | { fields?: { file?: { url?: string } } }
    | undefined;
  return {
    title: fields.title as string,
    description: fields.description as string | undefined,
    imageUrl: image?.fields?.file?.url,
    tabs: (fields.tabs as unknown as RawAboutTab[] | undefined) ?? [],
  };
}

/**
 * Fetch the raw "contact" entry fields. Returns `null` when credentials are
 * absent or nothing is published; throws on a failed request.
 */
export async function fetchContactEntry(): Promise<RawContactFields | null> {
  if (!hasContentfulCredentials) return null;
  const res = await contentfulClient.getEntries<ContactSkeleton>({
    content_type: "contact",
    limit: 1,
  });
  const fields = res.items[0]?.fields;
  if (!fields) return null;
  return {
    title: fields.title as string,
    description: fields.description as string | undefined,
    links: (fields.links as unknown as string[] | undefined) ?? [],
  };
}

/**
 * Fetch the raw projects list from the single "projects" entry's JSON field.
 * Returns `null` when credentials are absent or nothing is published; throws on
 * a failed request.
 */
export async function fetchProjects(): Promise<RawProject[] | null> {
  if (!hasContentfulCredentials) return null;
  const res = await contentfulClient.getEntries<ProjectsSkeleton>({
    content_type: "projects",
    limit: 1,
  });
  const fields = res.items[0]?.fields;
  if (!fields) return null;
  return (fields.projects as unknown as RawProject[] | undefined) ?? [];
}

/**
 * Fetch the raw open-source repo list from the single "openSource" entry's JSON
 * field. Returns `null` when credentials are absent or nothing is published;
 * throws on a failed request.
 */
export async function fetchOpenSource(): Promise<RawRepo[] | null> {
  if (!hasContentfulCredentials) return null;
  const res = await contentfulClient.getEntries<OpenSourceSkeleton>({
    content_type: "openSource",
    limit: 1,
  });
  const fields = res.items[0]?.fields;
  if (!fields) return null;
  return (fields.openSource as unknown as RawRepo[] | undefined) ?? [];
}

/**
 * Candidate content-type IDs holding each legal page's Rich Text body, in
 * priority order — the first that resolves a published entry wins. Multiple
 * candidates absorb naming drift (e.g. `terms` vs `termsAndConditions`).
 */
export const PRIVACY_CONTENT_TYPES = ["privacyPolicy"] as const;
export const TERMS_CONTENT_TYPES = ["termsAndConditions", "terms"] as const;

/**
 * Find the first Rich Text document among an entry's fields — the policy body —
 * without needing to know the field's ID (a Rich Text value is an object whose
 * `nodeType` is `"document"`).
 */
export function findRichTextDocument(
  fields: Record<string, unknown>,
): Document | null {
  for (const value of Object.values(fields)) {
    if (
      value !== null &&
      typeof value === "object" &&
      (value as { nodeType?: unknown }).nodeType === "document"
    ) {
      return value as Document;
    }
  }
  return null;
}

/**
 * Fetch a legal page's Rich Text body from the first of `contentTypes` that has a
 * published entry. Returns `null` when credentials are absent or nothing is
 * found. Each candidate is tried independently: an unknown content-type ID (or a
 * transient error for that candidate) falls through to the next rather than
 * failing the whole read.
 */
export async function fetchLegalDocument(
  contentTypes: readonly string[],
): Promise<Document | null> {
  if (!hasContentfulCredentials) return null;
  for (const contentType of contentTypes) {
    try {
      const res = await contentfulClient.getEntries({
        content_type: contentType,
        limit: 1,
      });
      const fields = res.items[0]?.fields as
        | Record<string, unknown>
        | undefined;
      if (!fields) continue;
      const doc = findRichTextDocument(fields);
      if (doc) return doc;
    } catch {
      // Unknown content-type ID or transient error — try the next candidate.
    }
  }
  return null;
}
