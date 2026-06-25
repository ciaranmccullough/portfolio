import type { HeroTab } from "@portfolio/ui";
import type { ReactNode } from "react";

import type { Hero } from "@/types/hero";

export interface HeroSectionProps {
  /** Server-fetched Hero content, consumed via the `useHero` hook. */
  heroPromise: Promise<Hero>;
  /** Status / eyebrow badge (localized copy from the dictionary). */
  badge: ReactNode;
  /** Résumé CTA label. */
  resumeLabel: ReactNode;
  /** Floating tech tabs. */
  tabs: HeroTab[];
}
