import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { NavItem } from "../../molecules";

/** Props for the {@link Navbar} organism. Renders a `<header>`. */
export interface NavbarProps extends ComponentPropsWithoutRef<"header"> {
  /** Brand / wordmark. */
  brand?: ReactNode;
  /** When set, the brand renders as a link to this href (e.g. `#top`). */
  brandHref?: string;
  /** Primary navigation links. */
  items: NavItem[];
  /** Call-to-action (e.g. a Button). */
  cta?: ReactNode;
}
