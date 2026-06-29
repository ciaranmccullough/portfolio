import type { RawProject } from "@/services/contentful/contentful";
import type { Project } from "@/types/project";

/**
 * Normalise a Contentful work-card image URL for `next/image`.
 *
 * The CMS stores these URLs with a small `?h=250` cap, so the source is only
 * 250px tall — `next/image` then upscales it into the larger card (badly on
 * retina), which reads as blur. We add a scheme if the URL is protocol-relative,
 * then drop any baked-in transform and ask Contentful's Image API for a
 * crisp, appropriately-sized WebP. `next/image` resizes down from there.
 */
function toProjectImageUrl(url: string | undefined): string {
  if (!url) return "";
  const absolute = url.startsWith("//") ? `https:${url}` : url;
  const [base] = absolute.split("?");
  return `${base}?w=1200&q=80&fm=webp`;
}

/**
 * Map the raw Contentful "projects" array (DTO) to {@link Project} entities. The
 * CMS field names differ from the UI's: `link` → `href`, `tabs` → `tags`.
 */
export function mapProjects(raw: RawProject[]): Project[] {
  return raw.map((project) => ({
    title: project.title,
    description: project.description ?? "",
    href: project.link ?? "",
    tags: project.tabs ?? [],
    imageUrl: toProjectImageUrl(project.imageUrl),
  }));
}
