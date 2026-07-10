// The rendered blocks (paragraphs via the Text atom, headings, lists, …) are
// spaced uniformly by the root; the Text atoms carry the typography themselves.
export const richTextRootClass = "mt-8 space-y-4";

// Statement variant (Brief): no offset of its own — Brief's own wrapper owns
// the statement's typography and sits flush against the eyebrow above it.
export const richTextStatementRootClass = "";

/* Statement-variant paragraph: intentionally carries NO font classes — it
   inherits font-family/size/weight/line-height/letter-spacing/color from
   Brief's wrapping element (briefBodyClass), so the statement-scale type
   actually applies instead of being clobbered by the `body` Text variant's
   own 16px override. Only spacing is owned here: ~0.5em between statement
   lines (paragraphs), none before the first, matching the design doc. */
export const richTextStatementLineClass = "mt-[0.5em] first:mt-0";

/* Bold runs in the Brief statement render in brand-violet per the design doc
   (`--color-brand-violet` already clears 4.5:1 on paper — see theme.css).
   `font-bold` pins the weight explicitly rather than relying on the
   browser's `bolder` heuristic against an already-bold (700) ancestor. */
export const richTextStatementBoldClass = "font-bold text-brand-violet";

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
