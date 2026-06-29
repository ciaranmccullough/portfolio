import { Icon } from "../atoms";
import type { GlyphProps } from "./types";

/** Exclamation in a circle — an error / alert (e.g. the Toast error tone). */
export function AlertIcon(props: GlyphProps) {
  return (
    <Icon {...props}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v5" />
        <path d="M12 16.5h.01" />
      </svg>
    </Icon>
  );
}
