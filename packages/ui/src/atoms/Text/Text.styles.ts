import type { TextElement, TextVariant } from "./Text.types";

/** Default semantic element rendered for each variant. */
export const textVariantTag: Record<TextVariant, TextElement> = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  body: "p",
  small: "p",
};

export const textVariant: Record<TextVariant, string> = {
  display:
    "font-heading text-display font-extrabold tracking-tighter leading-tight text-fg",
  h1: "font-heading text-heading font-extrabold tracking-tight leading-tight text-fg",
  h2: "font-heading text-2xl font-bold tracking-snug leading-snug text-fg",
  h3: "font-heading text-xl font-bold leading-snug text-fg",
  body: "font-body text-lg leading-relaxed text-fg-muted",
  small: "font-body text-md leading-normal text-fg-soft",
};
