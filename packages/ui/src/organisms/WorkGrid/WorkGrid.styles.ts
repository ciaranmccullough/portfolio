export const workGridClass = "mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-14";

/* Section header: heading block on the left, mono meta note opposite (the meta
   is hidden on the narrowest screens, mirroring the design). */
export const workGridHeaderClass = "mb-9 flex items-end justify-between gap-5";

export const workGridEyebrowClass = "mb-2.5";

export const workGridMetaClass =
  "hidden whitespace-nowrap pb-1.5 font-mono text-xs text-fg-faint sm:block";

export const workGridListClass =
  "grid list-none grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3";

/* Card: cover image flush to the rounded top edges, text body padded below.
   `relative` anchors the title link's stretched ::after (whole-card click area);
   `focus-within` rings the card when that link is keyboard-focused. */
export const workCardClass =
  "relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-[0_1px_3px_rgba(23,22,29,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_48px_-22px_rgba(23,22,29,0.28)] focus-within:ring-2 focus-within:ring-brand-violet";

/* Media slot is positioned so a `next/image` with `fill` covers it. */
export const workCardMediaClass =
  "relative h-48 w-full overflow-hidden bg-inset";

export const workCardBodyClass = "flex flex-1 flex-col p-5";

export const workCardTitleClass = "mb-2";

/* Stretched link: ::after covers the whole card, so the entire card is clickable
   (and shows the pointer) while the link's accessible name stays the title. */
export const workCardLinkClass =
  "cursor-pointer text-fg no-underline transition-colors after:absolute after:inset-0 hover:text-brand-violet";

export const workCardDescriptionClass = "text-base text-fg-soft";

/* Tags row pinned to the bottom of the card (mt-auto); ↗ pushed to the far end. */
export const workCardTagsClass =
  "mt-auto flex list-none flex-wrap items-center gap-1.5 pt-4";

/* The external-link arrow, pushed to the far end; colour flows to the SVG. */
export const workCardArrowClass = "ml-auto text-brand-violet";
export const workCardArrowIconClass = "size-4";
