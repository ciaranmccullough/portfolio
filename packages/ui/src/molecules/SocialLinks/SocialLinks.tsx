import { colors } from "@portfolio/tokens";

import { Link } from "../../atoms";
import type { SocialLinksProps } from "./SocialLinks.types";

/**
 * SocialLinks — a row of underlined off-site links for the contact panel.
 */
export function SocialLinks({ items, style, ...props }: SocialLinksProps) {
  return (
    <ul
      style={{
        display: "flex",
        gap: "22px",
        listStyle: "none",
        margin: 0,
        padding: 0,
        ...style,
      }}
      {...props}
    >
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            style={{
              color: colors.text.muted,
              borderBottom: `1px solid ${colors.border.dark}`,
              paddingBottom: "2px",
            }}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
