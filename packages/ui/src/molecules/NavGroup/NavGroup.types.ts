import type { ComponentPropsWithoutRef, ReactNode } from "react";

export interface NavItem {
  href: string;
  label: ReactNode;
}

/**
 * Props for the {@link NavGroup} molecule. Renders a `<nav>` landmark with a
 * list of links. Provide `aria-label` to name the landmark.
 */
export interface NavGroupProps extends ComponentPropsWithoutRef<"nav"> {
  items: NavItem[];
}
