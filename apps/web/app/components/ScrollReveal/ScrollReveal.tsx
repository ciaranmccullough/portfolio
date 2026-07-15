"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import { useRevealWindowAlreadyOpen } from "@/hooks/useRevealWindowAlreadyOpen";
import { useScrollAnimationsEnabled } from "@/hooks/useScrollAnimationsEnabled";
import {
  getStaggeredRange,
  REVEAL_START_VIEWPORT_FRACTION,
} from "@/lib/scrollAnimation";

import type { ScrollRevealProps } from "./ScrollReveal.types";

const RISE_DISTANCE_PX = 28;
const SCALE_FROM = 0.94;
/** Each stagger step delays the next instance's window by this much of the
 *  (already short) reveal range — see `getStaggeredRange`. */
const STAGGER_STEP = 0.18;

/**
 * ScrollReveal — a single reusable scroll-scrubbed fade/rise (or fade/scale)
 * wrapper, used for every whole-section reveal on the story page (Brief,
 * Reflection, the Role CTA) instead of one bespoke implementation per
 * section.
 *
 * Tracks its own children's position (`useScroll` against its own ref +
 * `REVEAL_OFFSET`) and maps that window to opacity/y (or opacity/scale) with
 * `useTransform` — a continuous function of scroll position, updated via
 * Motion's own scheduler outside React, not a time-based transition.
 *
 * `staggerIndex` shifts this instance's *input* thresholds later (see
 * `getStaggeredRange`) rather than requiring a shared parent ref — several
 * `ScrollReveal`s placed side by side (e.g. a row of cards) each track their
 * own near-identical scroll position, but reveal in sequence because later
 * instances need more progress before their window opens.
 *
 * Renders `children` completely statically (no wrapper, no motion styling)
 * until `useScrollAnimationsEnabled` is true. That covers both SSR/the
 * initial client render — so the server-rendered HTML is never shipped
 * pre-faded — and `prefers-reduced-motion`, per the reduced-motion
 * requirement that the static layout renders with no scrubbing.
 */
export function ScrollReveal({
  children,
  staggerIndex = 0,
  variant = "rise",
}: ScrollRevealProps) {
  const enabled = useScrollAnimationsEnabled();

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <EnabledScrollReveal staggerIndex={staggerIndex} variant={variant}>
      {children}
    </EnabledScrollReveal>
  );
}

/**
 * Inner component mounted only once animations are enabled, so the
 * `useScroll` target ref is guaranteed to attach on its very first render.
 * Registering `useScroll({ target })` in a component that can return without
 * rendering the ref'd element (the `!enabled` branch above) makes Motion
 * throw "Target ref is defined but not hydrated" on that pre-enabled render
 * pass — the same reason StoryWalkthrough splits into a mounted-only
 * PinnedWalkthrough.
 */
function EnabledScrollReveal({
  children,
  staggerIndex = 0,
  variant = "rise",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    // Starts when the element's top is 92% of the way down the viewport
    // (just entering from the bottom) and finishes once it reaches 55% —
    // comfortably before a typical reading position, so nothing is still
    // mid-fade once the user is looking at it (reveals should complete
    // early in the section's entry, per the design spec).
    offset: [`start ${REVEAL_START_VIEWPORT_FRACTION * 100}%`, "start 55%"],
  });
  // A window that's already open at mount (tall viewport, restored scroll)
  // renders fully revealed instead of frozen mid-fade — see the hook's doc.
  // The motion.div stays mounted either way so `useScroll`'s target ref never
  // detaches (Motion throws when the ref'd element disappears).
  const alreadyOpen = useRevealWindowAlreadyOpen(ref);
  const inputRange = getStaggeredRange(staggerIndex, STAGGER_STEP);

  const opacity = useTransform(scrollYProgress, inputRange, [0, 1]);
  const y = useTransform(
    scrollYProgress,
    inputRange,
    variant === "rise" ? [RISE_DISTANCE_PX, 0] : [0, 0],
  );
  const scale = useTransform(
    scrollYProgress,
    inputRange,
    variant === "scale" ? [SCALE_FROM, 1] : [1, 1],
  );

  return (
    <motion.div
      ref={ref}
      // Static full-reveal values rather than dropping the styles: Motion
      // writes MotionValues to the element imperatively, so a plain
      // `undefined` here would leave the last scrubbed opacity/transform
      // stuck on the DOM node.
      style={
        alreadyOpen ? { opacity: 1, y: 0, scale: 1 } : { opacity, y, scale }
      }
    >
      {children}
    </motion.div>
  );
}
