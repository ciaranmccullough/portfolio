import { Icon } from "../atoms";
import type { GlyphProps } from "./types";

/**
 * Diagonal "external link / opens in a new tab" arrow (↗). Replaces the literal
 * U+2197 character, which some platforms (notably Windows) substitute with a
 * heavier/emoji glyph that doesn't match the design.
 */
export function ArrowUpRightIcon(props: GlyphProps) {
  return (
    <Icon {...props}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7 17 17 7" />
        <path d="M7 7h10v10" />
      </svg>
    </Icon>
  );
}
