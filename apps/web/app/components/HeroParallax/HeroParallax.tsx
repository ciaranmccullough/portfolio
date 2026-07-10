"use client";

import { CaseStudyHero } from "@portfolio/ui";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import { useScrollAnimationsEnabled } from "@/hooks/useScrollAnimationsEnabled";

import { heroParallaxLayerClass } from "./HeroParallax.styles";
import type { HeroParallaxProps } from "./HeroParallax.types";

/** Extra downward drift (px) applied to the background as the hero scrolls
 *  out — makes it lag behind the (normal-speed) foreground content, the
 *  classic parallax read. Subtle by design (design-spec E: "hero parallax").*/
const BACKGROUND_Y_RANGE: [number, number] = [0, 120];
/** Fades toward, not all the way to, transparent — the background stays a
 *  faint presence rather than popping out abruptly. */
const BACKGROUND_OPACITY_RANGE: [number, number] = [1, 0.35];

/**
 * HeroParallax — wraps the presentational `CaseStudyHero` organism and adds
 * a scroll-scrubbed drift + fade to its background media layer as the hero
 * scrolls out of view (design-spec E: "data-herobg… scale + opacity +
 * translateY tied to scroll position"). Only the `backgroundImage` slot is
 * ever touched — `CaseStudyHero` itself renders unmodified, so its markup,
 * styling and no-JS/SSR output stay exactly as `@portfolio/ui` defines them.
 *
 * The hero's own scroll-out progress is tracked via a ref on a plain
 * wrapper div (`useScroll({ target })`, offset "start start" → "end start":
 * 0 when the hero first reaches the top of the viewport, 1 once it has
 * fully scrolled past) — independent of `ScrollProgress`'s whole-page
 * tracking.
 *
 * Only active once `useScrollAnimationsEnabled` is true (mounted + no
 * reduced-motion preference); otherwise the background image renders
 * exactly as passed in, with no wrapper or transform at all — this is both
 * the reduced-motion fallback and what keeps the SSR/pre-hydration HTML
 * un-transformed (never shipped mid-fade).
 */
export function HeroParallax({ backgroundImage, ...props }: HeroParallaxProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const enabled = useScrollAnimationsEnabled();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], BACKGROUND_Y_RANGE);
  const opacity = useTransform(
    scrollYProgress,
    [0, 1],
    BACKGROUND_OPACITY_RANGE,
  );

  return (
    <div ref={heroRef}>
      <CaseStudyHero
        {...props}
        backgroundImage={
          backgroundImage && enabled ? (
            <motion.div
              style={{ y, opacity }}
              className={heroParallaxLayerClass}
            >
              {backgroundImage}
            </motion.div>
          ) : (
            backgroundImage
          )
        }
      />
    </div>
  );
}
