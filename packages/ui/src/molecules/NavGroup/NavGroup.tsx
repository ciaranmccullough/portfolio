import { Link } from "../../atoms";
import type { NavGroupProps } from "./NavGroup.types";

/**
 * NavGroup — a `<nav>` landmark wrapping a list of anchor links. The site's
 * primary wayfinding.
 */
export function NavGroup({ items, style, ...props }: NavGroupProps) {
  return (
    <nav style={style} {...props}>
      <ul
        style={{
          display: "flex",
          gap: "22px",
          listStyle: "none",
          margin: 0,
          padding: 0,
          fontSize: "14.5px",
        }}
      >
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
