import { Icon } from "../atoms";
import type { GlyphProps } from "./types";

/** Check mark — a success confirmation (e.g. the Toast success tone). */
export function CheckIcon(props: GlyphProps) {
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
        <path d="m20 6-11 11-5-5" />
      </svg>
    </Icon>
  );
}
