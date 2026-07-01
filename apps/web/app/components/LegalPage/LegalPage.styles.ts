// Full-height flex column so the footer is pinned to the bottom of the viewport.
export const legalPageWrapperClass = "flex min-h-dvh flex-col";

// `grow` lets the article fill the flex-column page so the footer is pushed to
// the bottom of the viewport even when the (currently short) content is small.
export const legalMainClass =
  "relative z-10 mx-auto w-full max-w-3xl grow px-6 py-16 sm:px-10 sm:py-24";

export const legalTitleClass = "mt-3";

/** Placeholder-fallback body wrapper (used when Contentful has no content). */
export const legalBodyClass = "mt-8 space-y-4";

export const legalBackClass = "mt-10 inline-flex";
