import { Link } from "../../atoms";
import { navGroupListClass } from "./NavGroup.styles";
import type { NavGroupProps } from "./NavGroup.types";

/**
 * NavGroup — a `<nav>` landmark wrapping a list of anchor links. The site's
 * primary wayfinding.
 */
export function NavGroup({ items, className, ...props }: NavGroupProps) {
  return (
    <nav className={className} {...props}>
      <ul className={navGroupListClass}>
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
