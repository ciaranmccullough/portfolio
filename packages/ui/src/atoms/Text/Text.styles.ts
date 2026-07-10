import type { TextElement, TextVariant } from "./Text.types";

/** Default semantic element rendered for each variant. */
export const textVariantTag: Record<TextVariant, TextElement> = {
  display: "h1",
  "display-xl": "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  body: "p",
  small: "p",
};

export const textVariant: Record<TextVariant, string> = {
  display:
    "font-heading text-display font-extrabold tracking-tighter leading-tight text-fg",
  // Case-study hero scale — tighter leading/tracking than `display` (measured
  // off the design doc's H1: line-height .92, letter-spacing -.04em), since
  // type this large needs to pull in further than the standard display tier.
  "display-xl":
    "font-heading text-display-xl font-extrabold leading-[0.92] tracking-[-0.04em] text-fg",
  h1: "font-heading text-heading font-extrabold tracking-tight leading-tight text-fg",
  h2: "font-heading text-2xl font-bold tracking-snug leading-snug text-fg",
  h3: "font-heading text-xl font-bold leading-snug text-fg",
  body: "font-body text-lg leading-relaxed text-fg-muted",
  small: "font-body text-md leading-normal text-fg-soft",
};
