"use client";

import { Eyebrow, PrincipleCard, Text } from "@portfolio/ui";
import type { PrincipleCardTone } from "@portfolio/ui";
import { useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { useScrollAnimationsEnabled } from "@/hooks/useScrollAnimationsEnabled";
import { getStaggeredProgress, roundTo } from "@/lib/scrollAnimation";

import {
  principlesRevealEyebrowClass,
  principlesRevealGridClass,
  principlesRevealHeaderClass,
  principlesRevealSectionClass,
  principlesRevealTitleClass,
} from "./PrinciplesReveal.styles";
import type { PrinciplesRevealProps } from "./PrinciplesReveal.types";

/* Cycled by position, same as the Principles organism's own internal cycle
   (not a prop there either — kept identical here for visual parity). */
const TONE_CYCLE: PrincipleCardTone[] = ["violet", "orange", "green"];
const STAGGER_STEP = 0.22;
const RISE_DISTANCE_PX = 24;

/**
 * PrinciplesReveal — the Principles section with each card fading/rising in
 * on its own (staggered) scroll window, instead of `Principles`' single
 * static grid.
 *
 * `PrincipleCard` renders its own `<li>`, so unlike `ScrollReveal` this
 * can't wrap each card in a `motion.div`: a `<div>` between `<ol>` and `<li>`
 * breaks list semantics, and `display: contents` (the usual fix for that)
 * strips the wrapper's own box — which means opacity/transform on it
 * would have no visual effect at all. Instead, per-card progress is tracked
 * with a single shared `useScroll` (one ref on the grid) and committed to
 * React state — rounded so this only re-renders on a meaningfully different
 * value, not every scroll event — then applied directly through
 * `PrincipleCard`'s own native `style` prop. No extra DOM element, valid
 * list markup, real component reused as-is.
 *
 * Falls back to the plain, fully-visible grid (no state, no scroll
 * tracking applied) until `useScrollAnimationsEnabled` is true — covers
 * SSR/the initial client render and `prefers-reduced-motion`.
 */
export function PrinciplesReveal({
  eyebrow,
  title,
  principles,
  ...props
}: PrinciplesRevealProps) {
  const ref = useRef<HTMLOListElement>(null);
  const enabled = useScrollAnimationsEnabled();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 92%", "start 45%"],
  });
  const [cardProgress, setCardProgress] = useState<number[]>(() =>
    principles.map(() => 0),
  );

  // Snapshot the current position the moment animations turn on, rather than
  // waiting for the next scroll event — otherwise a page that hydrates while
  // already scrolled past this section would leave every card stuck at its
  // initial (hidden) progress until the user scrolls again.
  useEffect(() => {
    if (!enabled) return;
    const latest = scrollYProgress.get();
    setCardProgress(
      principles.map((_, index) =>
        roundTo(getStaggeredProgress(latest, index, STAGGER_STEP), 2),
      ),
    );
  }, [enabled, principles, scrollYProgress]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!enabled) return;
    setCardProgress((previous) => {
      let changed = false;
      const next = previous.map((value, index) => {
        const resolved = roundTo(
          getStaggeredProgress(latest, index, STAGGER_STEP),
          2,
        );
        if (resolved !== value) changed = true;
        return resolved;
      });
      return changed ? next : previous;
    });
  });

  return (
    <section className={principlesRevealSectionClass} {...props}>
      {eyebrow || title ? (
        <div className={principlesRevealHeaderClass}>
          {eyebrow ? (
            <Eyebrow className={principlesRevealEyebrowClass}>
              {eyebrow}
            </Eyebrow>
          ) : null}
          {title ? (
            <Text as="h2" variant="h1" className={principlesRevealTitleClass}>
              {title}
            </Text>
          ) : null}
        </div>
      ) : null}

      <ol ref={ref} className={principlesRevealGridClass}>
        {principles.map((principle, index) => {
          const t = enabled ? (cardProgress[index] ?? 1) : 1;
          return (
            <PrincipleCard
              key={index}
              index={String(index + 1).padStart(2, "0")}
              title={principle.title}
              description={principle.description}
              tone={TONE_CYCLE[index % TONE_CYCLE.length]}
              style={
                enabled
                  ? {
                      opacity: t,
                      transform: `translateY(${RISE_DISTANCE_PX * (1 - t)}px)`,
                    }
                  : undefined
              }
            />
          );
        })}
      </ol>
    </section>
  );
}
