import { cn } from "../../cn";
import {
  socialLinksAnchorClass,
  socialLinksListClass,
} from "./SocialLinks.styles";
import type { SocialLinksProps } from "./SocialLinks.types";

/**
 * SocialLinks — a row of underlined off-site links for the (dark) contact panel.
 * Renders anchors directly: the styling differs from the Link atom's variants.
 */
export function SocialLinks({ items, className, ...props }: SocialLinksProps) {
  return (
    <ul className={cn(socialLinksListClass, className)} {...props}>
      {items.map((item) => (
        <li key={item.href}>
          <a href={item.href} className={socialLinksAnchorClass}>
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
