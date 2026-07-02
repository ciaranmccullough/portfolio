import type { RepoRowTone } from "./RepoRow.types";

export const repoRowItemClass = "list-none";

/* One seamless row inside the panel: a top divider separates it from the row
   above (the panel's `overflow-hidden` rounds the first row's corners).
   Mobile-first: the row wraps into a column (name + stars on the top line,
   description and language each on their own line below) so it never forces the
   viewport wider than the screen; at `sm` it collapses to a single row. */
export const repoRowLinkClass =
  "flex flex-wrap items-center gap-x-3.5 gap-y-1.5 border-t border-line-soft px-5.5 py-4.5 text-fg no-underline transition-colors hover:bg-inset sm:flex-nowrap sm:gap-4";

/* Dot base (shared by the leading status dot and the language dot); the colour
   comes from the tone map so `cn` never has two bg classes to resolve.
   `rounded-full` leads so it's the (dot-free, dot-unique) class tests select by. */
export const repoRowDotBase = "rounded-full size-2.5 shrink-0";

export const repoRowDotTone: Record<RepoRowTone, string> = {
  violet: "bg-brand-violet",
  orange: "bg-brand-orange",
  green: "bg-brand-green",
  amber: "bg-brand-amber",
};

/* Name shrinks (and truncates) on mobile so a long name can't stretch the row;
   it takes the fixed anchor width only from `sm` up. */
export const repoRowNameClass =
  "min-w-0 truncate font-mono text-sm font-bold sm:min-w-[190px]";

/* Description: its own full-width line on mobile (wraps freely); flexes inline
   and truncates from `sm` up. `order-1` keeps it below the name+stars line. */
export const repoRowDescClass =
  "order-1 w-full min-w-0 text-sm text-fg-soft sm:order-none sm:w-auto sm:flex-1 sm:truncate";

/* Language: its own line on mobile (below the description); inline from `sm`. */
export const repoRowLangClass =
  "order-2 flex w-full items-center gap-1.5 text-xs text-fg-soft sm:order-none sm:w-auto sm:shrink-0";

/* Stars sit at the end of the top line (pushed right by `ml-auto`) on every
   breakpoint. */
export const repoRowStarsClass =
  "ml-auto shrink-0 whitespace-nowrap text-sm font-semibold text-fg-muted";
