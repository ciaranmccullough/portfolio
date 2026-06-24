import type { CSSProperties, ElementType } from "react";

import { colors, fonts, fontWeights, lineHeights } from "@portfolio/tokens";

import type { TextElement, TextProps, TextVariant } from "./Text.types";

const variantTag: Record<TextVariant, TextElement> = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  body: "p",
  small: "p",
};

const variantStyle: Record<TextVariant, CSSProperties> = {
  display: {
    fontFamily: fonts.heading,
    fontWeight: fontWeights.extrabold,
    fontSize: "clamp(34px, 6vw, 64px)",
    letterSpacing: "-0.03em",
    lineHeight: lineHeights.tight,
  },
  h1: {
    fontFamily: fonts.heading,
    fontWeight: fontWeights.extrabold,
    fontSize: "clamp(28px, 4vw, 44px)",
    letterSpacing: "-0.025em",
    lineHeight: lineHeights.tight,
  },
  h2: {
    fontFamily: fonts.heading,
    fontWeight: fontWeights.bold,
    fontSize: "24px",
    letterSpacing: "-0.02em",
    lineHeight: lineHeights.snug,
  },
  h3: {
    fontFamily: fonts.heading,
    fontWeight: fontWeights.bold,
    fontSize: "18px",
    lineHeight: lineHeights.snug,
  },
  body: {
    fontFamily: fonts.body,
    fontWeight: fontWeights.regular,
    fontSize: "16px",
    lineHeight: lineHeights.relaxed,
    color: colors.text.secondary,
  },
  small: {
    fontFamily: fonts.body,
    fontWeight: fontWeights.regular,
    fontSize: "13.5px",
    lineHeight: lineHeights.normal,
    color: colors.text.muted,
  },
};

/**
 * Text — the typographic atom.
 *
 * Renders the semantic element for its `variant` (Bricolage for headings,
 * Hanken for body), or an explicit element via `as`.
 */
export function Text({ as, variant = "body", style, ...props }: TextProps) {
  const Tag = (as ?? variantTag[variant]) as ElementType;
  return (
    <Tag
      style={{ color: colors.text.primary, ...variantStyle[variant], ...style }}
      {...props}
    />
  );
}
