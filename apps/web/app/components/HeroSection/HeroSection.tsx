"use client";

import { Hero, Link } from "@portfolio/ui";

import { useHero } from "@/hooks/useHero";
import type { HeroSectionProps } from "./HeroSection.types";

/**
 * HeroSection — client wrapper that consumes the server-fetched Hero via the
 * {@link useHero} hook and renders the Hero organism. It is a client component
 * only so it can call the hook; the data is still fetched on the server. Copy
 * (badge, résumé label) is injected from the localized dictionary.
 *
 * It has no styles of its own — it composes the already-styled Hero + Link — so
 * there is no `HeroSection.styles.ts`.
 */
export function HeroSection({
  heroPromise,
  badge,
  resumeLabel,
  tabs,
}: HeroSectionProps) {
  const hero = useHero(heroPromise);

  return (
    <Hero
      id="top"
      badge={badge}
      title={hero.title}
      intro={hero.description}
      tabs={tabs}
    >
      <Link href={hero.resumeUrl} variant="primary">
        {resumeLabel}
        <span aria-hidden="true">↗</span>
      </Link>
    </Hero>
  );
}
