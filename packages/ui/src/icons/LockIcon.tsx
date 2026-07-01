import { Icon } from "../atoms";
import type { GlyphProps } from "./types";

/** A padlock — marks a locked, always-on control (e.g. the Switch's on knob). */
export function LockIcon(props: GlyphProps) {
  return (
    <Icon {...props}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="5" y="11" width="14" height="9" rx="2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      </svg>
    </Icon>
  );
}
