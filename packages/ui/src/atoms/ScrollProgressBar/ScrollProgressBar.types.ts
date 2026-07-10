import type { ComponentPropsWithoutRef } from "react";

/** Props for the {@link ScrollProgressBar} atom. Extends native `<div>` attributes. */
export interface ScrollProgressBarProps extends ComponentPropsWithoutRef<"div"> {
  /**
   * Scroll progress, `0`–`100`. Rendered as a horizontal fill via a CSS
   * `scaleX` transform computed from this value — there is no internal
   * scroll listener or other browser API. A client wrapper re-renders this
   * with a fresh value as the page scrolls, or drives the fill directly via
   * `style`/`className` (an explicit `style.transform` wins over the
   * computed one). Defaults to `0`.
   */
  progress?: number;
}
