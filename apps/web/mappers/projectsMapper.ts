import type { RawProject } from "@/services/contentful/contentful";
import type { Project } from "@/types/project";

/** A protocol-relative Contentful asset URL needs a scheme for `next/image`. */
function toHttpsUrl(url: string | undefined): string {
  if (!url) return "";
  return url.startsWith("//") ? `https:${url}` : url;
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
    imageUrl: toHttpsUrl(project.imageUrl),
  }));
}
