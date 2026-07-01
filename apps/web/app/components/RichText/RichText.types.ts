import type { Document } from "@contentful/rich-text-types";

/** Props for {@link RichText}. */
export interface RichTextProps {
  /** The Contentful Rich Text document to render. */
  document: Document;
}
