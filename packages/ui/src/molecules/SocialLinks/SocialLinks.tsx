import { cn } from "../../cn";
import type { SocialLinksProps } from "./SocialLinks.types";

/**
 * SocialLinks — a row of underlined off-site links for the (dark) contact panel.
 * Renders anchors directly: the styling differs from the Link atom's variants.
 */
export function SocialLinks({ items, className, ...props }: SocialLinksProps) {
  return (
    <ul className={cn("flex list-none gap-5.5", className)} {...props}>
      {items.map((item) => (
        <li key={item.href}>
          <a
            href={item.href}
            className="border-b border-line-dark pb-0.5 font-semibold text-fg-on-dark no-underline"
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
