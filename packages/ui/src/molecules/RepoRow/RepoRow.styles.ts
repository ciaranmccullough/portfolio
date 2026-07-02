import type { RepoRowTone } from "./RepoRow.types";

export const repoRowItemClass = "list-none";

/* One seamless row inside the panel: a top divider separates it from the row
   above (the panel's `overflow-hidden` rounds the first row's corners). */
export const repoRowLinkClass =
  "flex items-center gap-4 border-t border-line-soft px-5.5 py-4.5 text-fg no-underline transition-colors hover:bg-inset";

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

/* Name is the fixed-width anchor of the row; the description flexes beside it. */
export const repoRowNameClass = "min-w-[190px] font-mono text-sm font-bold";

export const repoRowDescClass = "min-w-0 flex-1 truncate text-sm text-fg-soft";

export const repoRowLangClass =
  "flex shrink-0 items-center gap-1.5 text-xs text-fg-soft";

export const repoRowStarsClass =
  "ml-auto shrink-0 whitespace-nowrap text-sm font-semibold text-fg-muted";
