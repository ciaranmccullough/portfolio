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
