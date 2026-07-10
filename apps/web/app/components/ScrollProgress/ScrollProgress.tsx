"use client";

import { ScrollProgressBar } from "@portfolio/ui";
import { useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";

import { useScrollAnimationsEnabled } from "@/hooks/useScrollAnimationsEnabled";
import { roundTo } from "@/lib/scrollAnimation";

import { scrollProgressClass } from "./ScrollProgress.styles";
import type { ScrollProgressProps } from "./ScrollProgress.types";

/**
 * ScrollProgress — drives the presentational `ScrollProgressBar` atom from
 * the page's own scroll position (`useScroll().scrollYProgress`, no
 * `target`, so it tracks the whole document), fixed to the top of the
 * viewport.
 *
 * The rendered `progress` also drives the bar's real `aria-valuenow`, so it
 * has to be a plain number the atom can read on every meaningful change —
 * `scrollYProgress` is observed via `useMotionValueEvent` and only committed
 * to React state when the rounded whole-percent value actually changes, so
 * this re-renders at most ~100 times across an entire page scroll (not once
 * per scroll event/frame) while still reading as continuous: a 1%-of
 * -viewport-width step on a 3px-tall bar is imperceptible.
 *
 * Honors reduced motion: while `useScrollAnimationsEnabled` is false (not
 * yet mounted, or the user prefers reduced motion), the bar renders
 * statically at 0% instead of scrubbing with scroll position.
 */
export function ScrollProgress({ label }: ScrollProgressProps) {
  const enabled = useScrollAnimationsEnabled();
  const { scrollYProgress } = useScroll();
  const [percent, setPercent] = useState(0);

  // Snapshot the current position the moment animations turn on, rather than
  // waiting for the next scroll event — otherwise a page that hydrates while
  // already scrolled down (browsers often restore scroll position on
  // reload) would show 0% until the user scrolls again.
  useEffect(() => {
    if (!enabled) return;
    setPercent(roundTo(scrollYProgress.get() * 100, 0));
  }, [enabled, scrollYProgress]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!enabled) return;
    const rounded = roundTo(latest * 100, 0);
    setPercent((previous) => (previous === rounded ? previous : rounded));
  });

  return (
    <ScrollProgressBar
      progress={enabled ? percent : 0}
      aria-label={label}
      className={scrollProgressClass}
    />
  );
}
