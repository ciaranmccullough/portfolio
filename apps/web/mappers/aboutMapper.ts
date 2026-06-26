import type { RawAboutFields } from "@/services/contentful/contentful";
import type { About } from "@/types/about";

/**
 * Contentful asset URLs come back protocol-relative (`//images.ctfassets.net/…`);
 * `next/image` needs an explicit scheme.
 */
function toHttpsUrl(url: string | undefined): string {
  if (!url) return "";
  return url.startsWith("//") ? `https:${url}` : url;
}

/** Map the raw Contentful "about" fields (DTO) to the {@link About} entity. */
export function mapAbout(raw: RawAboutFields): About {
  return {
    title: raw.title,
    description: raw.description ?? "",
    imageUrl: toHttpsUrl(raw.imageUrl),
    tabs: (raw.tabs ?? []).map((tab) => ({
      title: tab.title,
      description: tab.description,
    })),
  };
}
