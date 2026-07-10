import type { Document } from "@contentful/rich-text-types";

/**
 * `"body"` (default) renders paragraphs through the design system's `Text`
 * atom — the 16px Hanken body copy used for prose (Privacy/Terms pages).
 * `"statement"` renders paragraphs as bare, unstyled lines that inherit the
 * *ancestor's* typography instead — for slotting into `Brief`, whose
 * oversized Bricolage statement class lives on its own wrapping element, not
 * on the rich text itself — and colors bold runs in brand-violet.
 */
export type RichTextVariant = "body" | "statement";

/** Props for {@link RichText}. */
export interface RichTextProps {
  /** The Contentful Rich Text document to render. */
  document: Document;
  /** Rendering treatment for paragraphs/bold marks. Defaults to `"body"`. */
  variant?: RichTextVariant;
}
