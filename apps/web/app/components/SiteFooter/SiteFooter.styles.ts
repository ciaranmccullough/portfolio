/** Keeps the footer above the fixed page-texture layer (z-0). */
export const siteFooterClass = "relative z-10";

/** Colophon on the left, utility links on the right; wraps on small screens. */
export const siteFooterInnerClass =
  "flex flex-wrap items-center justify-between gap-x-6 gap-y-3";

/** The utility-link cluster. */
export const siteFooterNavClass = "flex flex-wrap items-center gap-x-5 gap-y-2";

/** A quiet footer link that darkens on hover (matches the mono footer tone). */
export const siteFooterLinkClass =
  "text-fg-soft no-underline transition-colors hover:text-fg";

/** The "Cookie settings" trigger — a link-styled button (resets button chrome). */
export const siteFooterButtonClass =
  "cursor-pointer border-none bg-transparent p-0 font-mono text-sm text-fg-soft transition-colors hover:text-fg";
