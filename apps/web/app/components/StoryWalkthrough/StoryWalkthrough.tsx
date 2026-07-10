"use client";

import {
  Eyebrow,
  PhoneMockup,
  Text,
  Walkthrough,
  WalkthroughPanel,
} from "@portfolio/ui";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { type ReactNode, useEffect, useRef, useState } from "react";

import { useScrollAnimationsEnabled } from "@/hooks/useScrollAnimationsEnabled";
import { getActivePanelIndex, getPanelOpacity } from "@/lib/scrollAnimation";

import {
  storyWalkthroughEyebrowClass,
  storyWalkthroughGridClass,
  storyWalkthroughHeaderClass,
  storyWalkthroughImageLayerClass,
  storyWalkthroughImageStackClass,
  storyWalkthroughPanelLayerClass,
  storyWalkthroughPanelsClass,
  storyWalkthroughPhoneColClass,
  storyWalkthroughSectionClass,
  storyWalkthroughStickyClass,
  storyWalkthroughTallClass,
} from "./StoryWalkthrough.styles";
import type { StoryWalkthroughProps } from "./StoryWalkthrough.types";

/**
 * StoryWalkthrough — scroll-driven pinning on top of the presentational
 * `Walkthrough` organism's content.
 *
 * On reduced motion (or before mount — see `useScrollAnimationsEnabled`),
 * renders `Walkthrough` completely untouched: its own natural-height grid
 * with a CSS-only sticky phone column and every panel stacked, fully
 * visible, in normal document flow. That is both the reduced-motion
 * fallback and the no-JS output; nothing here changes it.
 *
 * Once animations are enabled, renders a re-composed layout instead (using
 * `Walkthrough`'s own exported pieces — `PhoneMockup` / `WalkthroughPanel` —
 * rather than `Walkthrough` itself, which has no "tall region + sticky
 * viewport" structure to hook into): a natively-scrollable tall block
 * (`items.length * 100vh` — no wheel/touch interception, just an ordinary
 * tall block) with a `position: sticky` viewport pinned inside it. Overall
 * scroll progress through that tall block (`useScroll` against its own ref)
 * selects/crossfades the active panel and the phone's screenshot in sync,
 * via `getPanelOpacity` — all panels and all screenshots stay mounted
 * throughout (crossfaded with opacity/pointer-events, never unmounted).
 */
export function StoryWalkthrough({
  eyebrow,
  title,
  items,
  imageFallback,
  ...props
}: StoryWalkthroughProps) {
  const enabled = useScrollAnimationsEnabled();

  if (!enabled) {
    return (
      <Walkthrough
        eyebrow={eyebrow}
        title={title}
        items={items}
        imageFallback={imageFallback}
        {...props}
      />
    );
  }

  return (
    <PinnedWalkthrough
      eyebrow={eyebrow}
      title={title}
      items={items}
      imageFallback={imageFallback}
      {...props}
    />
  );
}

function PinnedWalkthrough({
  eyebrow,
  title,
  items,
  imageFallback,
  ...props
}: StoryWalkthroughProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });
  const [activeIndex, setActiveIndex] = useState(0);

  // Snapshot the current position the moment this mounts, rather than
  // waiting for the next scroll event — otherwise hydrating mid-scroll would
  // leave the phone/step label stuck on panel 0 until the user scrolls again.
  useEffect(() => {
    setActiveIndex(getActivePanelIndex(scrollYProgress.get(), items.length));
  }, [scrollYProgress, items.length]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const next = getActivePanelIndex(latest, items.length);
    setActiveIndex((previous) => (previous === next ? previous : next));
  });

  return (
    <section className={storyWalkthroughSectionClass} {...props}>
      {eyebrow || title ? (
        <div className={storyWalkthroughHeaderClass}>
          {eyebrow ? (
            <Eyebrow className={storyWalkthroughEyebrowClass}>
              {eyebrow}
            </Eyebrow>
          ) : null}
          {title ? (
            <Text as="h2" variant="h1">
              {title}
            </Text>
          ) : null}
        </div>
      ) : null}

      <div
        ref={scrollRef}
        style={{ height: `${items.length * 100}vh` }}
        className={storyWalkthroughTallClass}
      >
        <div className={storyWalkthroughStickyClass}>
          <div className={storyWalkthroughGridClass}>
            <div className={storyWalkthroughPhoneColClass}>
              <PhoneMockup
                image={
                  <div className={storyWalkthroughImageStackClass}>
                    {items.map((item, index) =>
                      item.image ? (
                        <ImageLayer
                          key={index}
                          index={index}
                          count={items.length}
                          progress={scrollYProgress}
                        >
                          {item.image}
                        </ImageLayer>
                      ) : null,
                    )}
                  </div>
                }
                fallback={imageFallback}
                steps={items.map((item) => ({ label: item.eyebrow }))}
                activeStep={activeIndex}
              />
            </div>

            <ol className={storyWalkthroughPanelsClass}>
              {items.map((item, index) => (
                <PanelLayer
                  key={index}
                  index={index}
                  count={items.length}
                  progress={scrollYProgress}
                  active={index === activeIndex}
                >
                  <WalkthroughPanel
                    index={String(index + 1).padStart(2, "0")}
                    eyebrow={item.eyebrow}
                    title={item.title}
                    description={item.description}
                    callout={item.callout}
                  >
                    {item.extra}
                  </WalkthroughPanel>
                </PanelLayer>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

interface LayerProps {
  index: number;
  count: number;
  progress: MotionValue<number>;
  children: ReactNode;
}

/** One panel's crossfade wrapper: a real `<li>` (native motion element, so
 *  no ref-forwarding concerns) placed in the shared grid-stack cell, with a
 *  continuous scroll-driven opacity — see `getPanelOpacity`. `pointer-events`
 *  follows the same value so a fully-faded panel can't intercept clicks/drag
 *  even though (deliberately) never unmounted or `aria-hidden`: every
 *  panel's text content stays in the accessibility tree regardless of its
 *  current visual opacity, so screen-reader users always have all of it. */
function PanelLayer({
  index,
  count,
  progress,
  active,
  children,
}: LayerProps & { active: boolean }) {
  const opacity = useTransform(progress, (latest: number) =>
    getPanelOpacity(latest, index, count),
  );
  const pointerEvents = useTransform(opacity, (latest: number) =>
    latest > 0.05 ? "auto" : "none",
  );

  return (
    <motion.li
      className={storyWalkthroughPanelLayerClass}
      style={{ opacity, pointerEvents }}
      aria-current={active ? "step" : undefined}
    >
      {children}
    </motion.li>
  );
}

/** One screenshot's crossfade wrapper in the phone's screen — same windowed
 *  opacity as its matching `PanelLayer`, so the phone and the copy panel
 *  cross-fade in sync. */
function ImageLayer({ index, count, progress, children }: LayerProps) {
  const opacity = useTransform(progress, (latest: number) =>
    getPanelOpacity(latest, index, count),
  );

  return (
    <motion.div className={storyWalkthroughImageLayerClass} style={{ opacity }}>
      {children}
    </motion.div>
  );
}
