import type { ElementType } from "react";

import { cn } from "../../cn";
import type { TextElement, TextProps, TextVariant } from "./Text.types";

const variantTag: Record<TextVariant, TextElement> = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  body: "p",
  small: "p",
};

const variantClass: Record<TextVariant, string> = {
  display:
    "font-heading font-extrabold text-display tracking-tighter leading-tight text-fg",
  h1: "font-heading font-extrabold text-heading tracking-tight leading-tight text-fg",
  h2: "font-heading font-bold text-2xl tracking-snug leading-snug text-fg",
  h3: "font-heading font-bold text-xl leading-snug text-fg",
  body: "font-body text-lg leading-relaxed text-fg-muted",
  small: "font-body text-md leading-normal text-fg-soft",
};

/**
 * Text — the typographic atom.
 *
 * Renders the semantic element for its `variant` (Bricolage for headings,
 * Hanken for body), or an explicit element via `as`.
 */
export function Text({ as, variant = "body", className, ...props }: TextProps) {
  const Tag = (as ?? variantTag[variant]) as ElementType;
  return <Tag className={cn(variantClass[variant], className)} {...props} />;
}
