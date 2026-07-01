import { Icon } from "../atoms";
import type { GlyphProps } from "./types";

/** A cookie with chocolate chips — the Cookie Banner's header badge glyph. */
export function CookieIcon(props: GlyphProps) {
  return (
    <Icon {...props}>
      <svg viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="12"
          r="9.2"
          stroke="currentColor"
          strokeWidth={1.7}
        />
        <circle cx="9" cy="9.5" r="1.15" fill="currentColor" />
        <circle cx="14.6" cy="8.4" r="0.85" fill="currentColor" />
        <circle cx="15.3" cy="14.2" r="1.15" fill="currentColor" />
        <circle cx="9.4" cy="14.8" r="0.8" fill="currentColor" />
        <circle cx="12.3" cy="12" r="0.7" fill="currentColor" />
      </svg>
    </Icon>
  );
}
