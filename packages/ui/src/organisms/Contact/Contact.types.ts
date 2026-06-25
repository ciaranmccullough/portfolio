import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { SocialLink } from "../../molecules";

/**
 * Props for the {@link Contact} organism. Renders a `<section>` (dark panel).
 * Presentational only: the interactive form is passed in as `children`.
 */
export interface ContactProps extends Omit<
  ComponentPropsWithoutRef<"section">,
  "title"
> {
  /** Mono kicker above the heading. */
  eyebrow?: ReactNode;
  /** Pitch heading. */
  title: ReactNode;
  /** Supporting copy. */
  intro?: ReactNode;
  /** Off-site links rendered under the pitch. */
  socials?: SocialLink[];
  /** The contact form (owned by the app — keeps this organism presentational). */
  children?: ReactNode;
}
