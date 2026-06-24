import type { ComponentPropsWithoutRef, ReactNode } from "react";

export interface SocialLink {
  href: string;
  label: ReactNode;
}

/** Props for the {@link SocialLinks} molecule. Renders a `<ul>` of links. */
export interface SocialLinksProps extends ComponentPropsWithoutRef<"ul"> {
  items: SocialLink[];
}
