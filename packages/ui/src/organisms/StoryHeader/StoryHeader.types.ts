import type { ComponentPropsWithoutRef, ReactNode } from "react";

/**
 * Props for the {@link StoryHeader} organism. Renders a `<header>` — a
 * trimmed, two-link header for case-study pages (brand + a back link), not
 * the full site `Navbar`.
 */
export interface StoryHeaderProps extends ComponentPropsWithoutRef<"header"> {
  /** Brand / wordmark content, e.g. "Ciaran". */
  brand: ReactNode;
  /** Href for the brand/wordmark link. */
  brandHref: string;
  /**
   * Back-link label, e.g. "Back to work". The leading arrow is decorative
   * and rendered by this component.
   */
  backLabel: ReactNode;
  /** Href for the back link. */
  backHref: string;
}
