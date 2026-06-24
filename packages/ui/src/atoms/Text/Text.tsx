import type { ComponentPropsWithoutRef } from "react";

/** Props for the {@link Text} atom — all native <p> attributes pass through. */
export type TextProps = ComponentPropsWithoutRef<"p">;

/**
 * Text — the most primitive typographic atom.
 *
 * Renders an unstyled native HTML `<p>` element. No styles are applied by
 * design; styling is the responsibility of composing molecules/organisms.
 */
export function Text(props: TextProps) {
  return <p {...props} />;
}
