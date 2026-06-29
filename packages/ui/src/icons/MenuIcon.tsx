import { Icon } from "../atoms";
import type { GlyphProps } from "./types";

/** Hamburger / menu lines — the Navbar's mobile toggle. */
export function MenuIcon(props: GlyphProps) {
  return (
    <Icon {...props}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      >
        <line x1="4" y1="8" x2="20" y2="8" />
        <line x1="4" y1="16" x2="20" y2="16" />
      </svg>
    </Icon>
  );
}
