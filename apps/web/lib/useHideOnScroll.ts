"use client";

import { useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";

/**
 * Reports whether a pinned element (e.g. the navbar) should hide, based on
 * scroll direction. Hides when scrolling down past `revealAt` pixels and shows
 * again when scrolling back up — the classic "hide-on-scroll" header.
 *
 * Built on Motion's `scrollY` MotionValue and `useMotionValueEvent`, so the
 * scroll position is read from a single shared listener rather than a manual
 * `scroll` handler. Reusable for any sticky element.
 */
export function useHideOnScroll(revealAt = 120) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    const scrollingDown = latest > previous;
    setHidden(scrollingDown && latest > revealAt);
  });

  return hidden;
}
