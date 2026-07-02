import type { RepoRowTone } from "@portfolio/ui";

import type { RawRepo } from "@/services/contentful/contentful";
import type { Repo } from "@/types/openSource";

/** The brand tones a repo dot may use; anything else is ignored. */
const TONES: readonly RepoRowTone[] = ["violet", "orange", "green", "amber"];

/** Normalise a raw `tone` keyword to a valid RepoRow tone, or `undefined`. */
function toTone(raw: string | undefined): RepoRowTone | undefined {
  return raw && (TONES as readonly string[]).includes(raw)
    ? (raw as RepoRowTone)
    : undefined;
}

/**
 * Map the raw Contentful "openSource" array (DTO) to {@link Repo} entities.
 * `name` + `href` are required; description, language, stars and tone are
 * optional and dropped when absent so a minimal `{ name, href }` entry still
 * renders. `stars` is coerced to its display string (so `0` shows, not "").
 */
export function mapOpenSource(raw: RawRepo[]): Repo[] {
  return raw.map((repo) => ({
    name: repo.name,
    href: repo.href,
    description: repo.description || undefined,
    lang: repo.lang || undefined,
    stars:
      repo.stars != null && repo.stars !== "" ? String(repo.stars) : undefined,
    tone: toTone(repo.tone),
  }));
}
