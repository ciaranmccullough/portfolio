import type { RawContactFields } from "@/services/contentful/contentful";
import type { Contact, ContactLink } from "@/types/contact";

/** Friendly labels for the hosts we expect; anything else falls back to the host. */
const HOST_LABELS: Record<string, string> = {
  "github.com": "GitHub",
  "linkedin.com": "LinkedIn",
  "x.com": "X",
  "twitter.com": "X",
};

/**
 * Parse one Contentful `links` string into a {@link ContactLink}. Accepts either
 * a bare URL (label derived from the host, e.g. `GitHub ↗`) or an explicit
 * `Label | https://…` pair. Returns `null` for anything unrecognizable.
 */
function parseLink(raw: string): ContactLink | null {
  const value = raw.trim();
  if (!value) return null;

  const labelled = value.match(/^(.+?)\s*[|,]\s*(https?:\/\/\S+)$/i);
  if (labelled) return { label: labelled[1].trim(), href: labelled[2].trim() };

  if (/^https?:\/\//i.test(value)) {
    const host = value
      .replace(/^https?:\/\//i, "")
      .replace(/^www\./i, "")
      .split("/")[0]
      .toLowerCase();
    return { label: `${HOST_LABELS[host] ?? host} ↗`, href: value };
  }

  return null;
}

/** Map the raw Contentful "contact" fields (DTO) to the {@link Contact} entity. */
export function mapContact(raw: RawContactFields): Contact {
  return {
    title: raw.title,
    intro: raw.description ?? "",
    socials: (raw.links ?? [])
      .map(parseLink)
      .filter((link): link is ContactLink => link !== null),
  };
}
