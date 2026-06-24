import type { ElementType } from "react";

import { cn } from "../../cn";
import { textVariant, textVariantTag } from "./Text.styles";
import type { TextProps } from "./Text.types";

/**
 * Text — the typographic atom.
 *
 * Renders the semantic element for its `variant` (Bricolage for headings,
 * Hanken for body), or an explicit element via `as`.
 */
export function Text({ as, variant = "body", className, ...props }: TextProps) {
  const Tag = (as ?? textVariantTag[variant]) as ElementType;
  return <Tag className={cn(textVariant[variant], className)} {...props} />;
}
