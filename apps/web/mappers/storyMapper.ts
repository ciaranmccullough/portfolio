import type { RawStoryFields } from "@/services/contentful/contentful";
import type { Story, StoryWalkthrough } from "@/types/story";

/** Shared `{ title, description }` shape returned for both `principles` and
 *  `reflections` items — structurally identical to the domain `StoryPrinciple`
 *  and `StoryReflection` types in `types/story.ts` (kept separate there for
 *  section-specific naming, but interchangeable here). */
type TitleDescription = { title: string; description: string };

/**
 * Contentful asset URLs come back protocol-relative (`//images.ctfassets.net/…`).
 * Unlike `toHttpsUrl` in aboutMapper.ts, this returns `undefined` (not `""`)
 * when absent: `backgroundImage` is Story's only genuinely optional field, so
 * the domain type keeps that optionality instead of collapsing "no image"
 * into an empty-string sentinel.
 */
function toBackgroundImageUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  return url.startsWith("//") ? `https:${url}` : url;
}

/**
 * Same crisp-rendering fix as `toProjectImageUrl` in projectsMapper.ts: add an
 * https scheme if protocol-relative, drop the `?h=250` transform the CMS bakes
 * into walkthrough image URLs at write time, and re-request a properly sized
 * WebP so `next/image` isn't upscaling a 250px-tall source. Returns
 * `undefined` (not `""`) for an absent/empty image — a documented CMS failure
 * mode (the "Onboarding" walkthrough briefly shipped with `image: ""`) — so
 * the eventual UI can omit the image cleanly instead of rendering a broken
 * `next/image`.
 */
function toWalkthroughImageUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  const absolute = url.startsWith("//") ? `https:${url}` : url;
  const [base] = absolute.split("?");
  return `${base}?w=1200&q=80&fm=webp`;
}

/** True for a non-null value — narrows away the `null`s left by mapping+skipping. */
function isPresent<T>(value: T | null): value is T {
  return value !== null;
}

/** Defensively coerce a freeform Contentful `Object` field to an array — these
 *  fields carry no schema enforcement, so even the top-level "is this an
 *  array" shape isn't guaranteed. */
function toArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

/**
 * Narrow one raw `principles`/`reflections` item (freeform JSON, no schema
 * enforcement) into a `{ title, description }` entity. `title` is the one
 * field trusted to exist — an item missing it (or where the value isn't a
 * non-empty string) is dropped by the caller. `description` defaults to `""`
 * rather than dropping the item, matching `mapOpenSource`/`mapProjects`'s
 * style — this also absorbs the misspelled `descrition` key an earlier CMS
 * revision of the `ea-sports-app` entry shipped under.
 */
function toStorySection(item: unknown): TitleDescription | null {
  if (!item || typeof item !== "object") return null;
  const { title, description } = item as Record<string, unknown>;
  if (typeof title !== "string" || !title) return null;
  return {
    title,
    description: typeof description === "string" ? description : "",
  };
}

/**
 * Narrow one raw `walkthroughs` item into a {@link StoryWalkthrough}. `title`
 * is required to keep the item; `subtitle`/`description` default to `""`;
 * `image` runs through {@link toWalkthroughImageUrl} (an empty/missing string
 * becomes `undefined`, never a broken image URL).
 */
function toStoryWalkthrough(item: unknown): StoryWalkthrough | null {
  if (!item || typeof item !== "object") return null;
  const { title, subtitle, description, image } = item as Record<
    string,
    unknown
  >;
  if (typeof title !== "string" || !title) return null;
  return {
    title,
    subtitle: typeof subtitle === "string" ? subtitle : "",
    description: typeof description === "string" ? description : "",
    image: toWalkthroughImageUrl(typeof image === "string" ? image : undefined),
  };
}

/** Map the raw Contentful "story" entry fields (DTO) to the {@link Story} entity. */
export function mapStory(raw: RawStoryFields): Story {
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    role: raw.role,
    platform: raw.platform,
    year: raw.year,
    brief: raw.brief,
    titlePrinciples: raw.titlePrinciples,
    principles: toArray(raw.principles).map(toStorySection).filter(isPresent),
    titleWalkthrough: raw.titleWalkthrough,
    walkthroughs: toArray(raw.walkthroughs)
      .map(toStoryWalkthrough)
      .filter(isPresent),
    titleReflection: raw.titleReflection,
    reflections: toArray(raw.reflections).map(toStorySection).filter(isPresent),
    titleRole: raw.titleRole,
    descriptionRole: raw.descriptionRole,
    backgroundImageUrl: toBackgroundImageUrl(raw.backgroundImageUrl),
  };
}
