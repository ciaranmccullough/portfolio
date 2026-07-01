import {
  documentToReactComponents,
  type Options,
} from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES, MARKS } from "@contentful/rich-text-types";
import { Link, Text } from "@portfolio/ui";
import NextLink from "next/link";

import {
  richTextCodeClass,
  richTextHeadingClass,
  richTextHrClass,
  richTextListClass,
  richTextListItemClass,
  richTextOrderedListClass,
  richTextQuoteClass,
  richTextRootClass,
} from "./RichText.styles";
import type { RichTextProps } from "./RichText.types";

/**
 * Maps Contentful Rich Text nodes onto the design system's typographic atoms.
 * Headings are demoted to h2/h3 (the page already owns the single `<h1>`); links
 * open in a new tab when absolute and route via `next/link` when in-app.
 */
const options: Options = {
  renderMark: {
    [MARKS.BOLD]: (text) => <strong>{text}</strong>,
    [MARKS.ITALIC]: (text) => <em>{text}</em>,
    [MARKS.UNDERLINE]: (text) => <u>{text}</u>,
    [MARKS.CODE]: (text) => <code className={richTextCodeClass}>{text}</code>,
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (_node, children) => <Text>{children}</Text>,
    [BLOCKS.HEADING_1]: (_node, children) => (
      <Text as="h2" variant="h2" className={richTextHeadingClass}>
        {children}
      </Text>
    ),
    [BLOCKS.HEADING_2]: (_node, children) => (
      <Text as="h2" variant="h2" className={richTextHeadingClass}>
        {children}
      </Text>
    ),
    [BLOCKS.HEADING_3]: (_node, children) => (
      <Text as="h3" variant="h3" className={richTextHeadingClass}>
        {children}
      </Text>
    ),
    [BLOCKS.HEADING_4]: (_node, children) => (
      <Text as="h3" variant="h3" className={richTextHeadingClass}>
        {children}
      </Text>
    ),
    [BLOCKS.UL_LIST]: (_node, children) => (
      <ul className={richTextListClass}>{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (_node, children) => (
      <ol className={richTextOrderedListClass}>{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (_node, children) => (
      <li className={richTextListItemClass}>{children}</li>
    ),
    [BLOCKS.QUOTE]: (_node, children) => (
      <blockquote className={richTextQuoteClass}>{children}</blockquote>
    ),
    [BLOCKS.HR]: () => <hr className={richTextHrClass} />,
    [INLINES.HYPERLINK]: (node, children) => {
      const href = String(node.data.uri ?? "");
      const isExternal = /^https?:\/\//i.test(href);
      return isExternal ? (
        <Link
          href={href}
          variant="inline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </Link>
      ) : (
        <Link as={NextLink} href={href} variant="inline">
          {children}
        </Link>
      );
    },
  },
};

/** Renders a Contentful Rich Text document with the design system's atoms. */
export function RichText({ document }: RichTextProps) {
  return (
    <div className={richTextRootClass}>
      {documentToReactComponents(document, options)}
    </div>
  );
}
