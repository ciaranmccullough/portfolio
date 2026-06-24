import type { ComponentPropsWithoutRef } from "react";

export type TextVariant = "display" | "h1" | "h2" | "h3" | "body" | "small";

export type TextElement = "h1" | "h2" | "h3" | "p" | "span";

/** Props for the {@link Text} atom. Extends native `<p>` attributes. */
export interface TextProps extends ComponentPropsWithoutRef<"p"> {
  /** Override the rendered semantic element. Defaults per `variant`. */
  as?: TextElement;
  /** Type-scale variant. */
  variant?: TextVariant;
}
