// The rendered blocks (paragraphs via the Text atom, headings, lists, …) are
// spaced uniformly by the root; the Text atoms carry the typography themselves.
export const richTextRootClass = "mt-8 space-y-4";

/** Headings get a little extra breathing room above (except the very first). */
export const richTextHeadingClass = "pt-4 first:pt-0";

const richTextListBase =
  "space-y-2 pl-5 font-body text-lg leading-relaxed text-fg-muted";
export const richTextListClass = `list-disc ${richTextListBase}`;
export const richTextOrderedListClass = `list-decimal ${richTextListBase}`;

/** List item; the inner paragraph's margin is reset so it hugs the marker. */
export const richTextListItemClass = "pl-1 [&>p]:m-0";

export const richTextQuoteClass =
  "border-l-2 border-line-strong pl-4 font-body text-lg italic leading-relaxed text-fg-soft [&>p]:m-0";

export const richTextHrClass = "border-t border-line-soft";

export const richTextCodeClass =
  "rounded bg-chip px-1.5 py-0.5 font-mono text-sm text-fg";
