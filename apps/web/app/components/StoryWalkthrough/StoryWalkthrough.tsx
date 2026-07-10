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
  type Transition,
} from "motion/react";
import { type ReactNode, useEffect, useRef, useState } from "react";

import { useIsDesktopViewport } from "@/hooks/useIsDesktopViewport";
import { useScrollAnimationsEnabled } from "@/hooks/useScrollAnimationsEnabled";
import {
  getPanelRestProgress,
  isWalkthroughBoundary,
  resolveNearestPanelIndex,
  resolveWalkthroughStep,
} from "@/lib/scrollAnimation";

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

/** A single wheel/trackpad tick or touch-drag threshold can't advance more
 *  than one panel per gesture — see `resolveWalkthroughStep`. An inertial
 *  fling delivers many wheel events over its deceleration curve; only the
 *  first inside this window is accepted, every other is swallowed. Matches
 *  the design mock's own reference stepper (design-spec E). */
const STEP_DEBOUNCE_MS = 700;

/** Vertical touch-drag distance (px) that counts as one step gesture. */
const TOUCH_STEP_THRESHOLD_PX = 36;

/** How long to wait after scrolling stops before resolving a stray scroll
 *  position (scrollbar drag, keyboard scroll, a deep-anchor arrival — any
 *  movement that didn't go through the debounced wheel/touch stepper) to
 *  the nearest whole panel. Short enough to feel immediate, long enough not
 *  to fire mid-scroll. */
const SETTLE_IDLE_MS = 150;

/** Shared crossfade transition for both the copy panel and the phone's
 *  screenshot: a duration-based spring with a gentle single overshoot that
 *  damps out quickly — "bounces" the incoming panel/screen into place
 *  without feeling elastic or wobbly. */
const SNAP_TRANSITION: Transition = {
  type: "spring",
  bounce: 0.26,
  duration: 0.5,
};

/** Directional slide distance (px) applied to a panel while it's not the
 *  active one — panels ahead of the active index rest slightly below,
 *  panels behind it rest slightly above, so the spring has somewhere to
 *  travel *from* rather than a flat opacity-only cut. */
const PANEL_SLIDE_PX = 24;

/**
 * StoryWalkthrough — a discrete, debounced snap-stepper on top of the
 * presentational `Walkthrough` organism's content: while pinned, each
 * wheel/trackpad/touch gesture advances or retreats *exactly one* panel,
 * never leaves the reader resting between two, and releases the page to
 * scroll straight past at the first/last panel.
 *
 * Renders the plain `Walkthrough` organism, completely untouched, in three
 * cases — this is simultaneously the reduced-motion fallback, the no-JS/
 * pre-hydration output, and the small-viewport layout:
 * - before mount, or when the user prefers reduced motion
 *   (`useScrollAnimationsEnabled`);
 * - below Tailwind's `md` breakpoint (`useIsDesktopViewport`) — the pinned
 *   two-column layout has nowhere to put the copy panel at phone width, so
 *   mobile gets the organism's own natural-height stacked layout with a
 *   CSS-only sticky phone column instead.
 *
 * Once both are satisfied, renders a re-composed layout using `Walkthrough`'s
 * own exported pieces (`PhoneMockup` / `WalkthroughPanel`) inside a
 * natively-scrollable tall block (`items.length * 100vh`) with a
 * `position: sticky` viewport pinned inside it — see `PinnedWalkthrough` for
 * the stepper mechanics.
 */
export function StoryWalkthrough({
  eyebrow,
  title,
  items,
  imageFallback,
  ...props
}: StoryWalkthroughProps) {
  const animationsEnabled = useScrollAnimationsEnabled();
  const isDesktop = useIsDesktopViewport();

  if (!animationsEnabled || !isDesktop) {
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
  const count = items.length;
  const scrollRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  const [activeIndex, setActiveIndex] = useState(0);
  // Mirrors `activeIndex`, but readable synchronously inside native event
  // listeners (`wheel`/`touchmove`) without a stale closure — those are
  // attached once via `useEffect`, so they'd otherwise only ever see the
  // `activeIndex` from the render that set them up.
  const activeIndexRef = useRef(0);
  const lastStepAtRef = useRef(-Infinity);
  const touchYRef = useRef<number | null>(null);
  const prevProgressRef = useRef(0);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  function setIndex(next: number) {
    activeIndexRef.current = next;
    setActiveIndex(next);
  }

  /** The tall region's current absolute document bounds — `top` is where
   *  its scroll-progress-0 point sits, `bottom` is where its
   *  scroll-progress-1 point sits. Re-measured on every call (cheap; only
   *  called from a step/settle event, never per-frame) rather than cached,
   *  so it's never stale across a resize or layout shift. */
  function regionBounds() {
    const region = scrollRef.current;
    if (!region) return null;
    const top = region.getBoundingClientRect().top + window.scrollY;
    const scrollable = Math.max(region.offsetHeight - window.innerHeight, 0);
    return { top, bottom: top + scrollable };
  }

  /** Move the tall region's scroll position to `index`'s canonical resting
   *  offset — instant, not animated: while genuinely pinned this is
   *  invisible (the sticky viewport doesn't move), so there's nothing to
   *  animate; it exists purely to keep the page scrollbar honest and to
   *  guarantee the right amount of native scroll remains once a boundary
   *  releases the gesture. The panel/screen "bounce" lives entirely in the
   *  crossfade below (`SNAP_TRANSITION`), not here.
   *
   *  `behavior: "instant"` is load-bearing, not the default: the site's
   *  global `html { scroll-behavior: smooth }` (globals.css) applies to
   *  *every* `window.scrollTo` call that doesn't explicitly override it —
   *  including the two-argument form (despite that looking like a plain
   *  instant jump), and `behavior: "auto"` does NOT override it either
   *  (per the CSSOM View spec, "auto" specifically means "defer to the
   *  element's own `scroll-behavior` CSS" — only "instant" unconditionally
   *  forces a non-animated jump). Without this, a single correction (e.g.
   *  after a scrollbar drag lands far from a rest point) smoothly animates
   *  for the better part of a second, and a second correction queued right
   *  after it (from the very next step) restarts/extends that animation —
   *  a visibly janky, unpredictably-timed crawl instead of the intended
   *  instant sync. */
  function syncScrollPosition(index: number) {
    const bounds = regionBounds();
    if (!bounds) return;
    const targetProgress = getPanelRestProgress(index, count);
    window.scrollTo({
      left: 0,
      top: bounds.top + targetProgress * (bounds.bottom - bounds.top),
      behavior: "instant",
    });
  }

  function attemptStep(direction: 1 | -1) {
    const result = resolveWalkthroughStep(
      { index: activeIndexRef.current, lastStepAt: lastStepAtRef.current },
      direction,
      count,
      Date.now(),
      STEP_DEBOUNCE_MS,
    );
    if (result.index === activeIndexRef.current) return;
    lastStepAtRef.current = result.lastStepAt;
    setIndex(result.index);
    syncScrollPosition(result.index);
  }

  // Snapshot the current position the moment this mounts, rather than
  // waiting for the next scroll event — otherwise hydrating mid-scroll (or
  // landing on a deep `#anchor` inside the region) would leave the phone/
  // step label stuck on panel 0 until the user scrolls again.
  useEffect(() => {
    const initial = resolveNearestPanelIndex(scrollYProgress.get(), count);
    prevProgressRef.current = scrollYProgress.get();
    setIndex(initial);
    // Only ever needs to run once per mount/item-count — `scrollYProgress`
    // is a stable MotionValue reference, not reactive state (this project
    // has no react-hooks/exhaustive-deps lint rule enabled to satisfy).
  }, [count]);

  // Resolves any scroll position that *didn't* come from the debounced
  // wheel/touch stepper — scrollbar drags, native keyboard scrolling, a
  // deep-anchor arrival — to a whole panel once scrolling settles, and
  // snaps the *visual* straight to the correct end the instant either
  // boundary is first crossed (R3: "entering from below starts at the last
  // panel").
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const previous = prevProgressRef.current;
    prevProgressRef.current = latest;

    if (previous <= 0 && latest > 0) {
      setIndex(0);
    } else if (previous >= 1 && latest < 1) {
      setIndex(count - 1);
    }

    clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      // `scrollYProgress` is clamped to [0, 1], so it reports the *same*
      // value 1 (or 0) both "resting exactly on the last panel" and "the
      // user kept scrolling on past it into the next section" — indistinct
      // from the clamped progress alone. A stale timer scheduled while
      // arriving at that boundary must not fire *after* the user has since
      // scrolled on past it and pull them back — so re-measure the actual
      // scroll position against the region's real bounds at fire time, and
      // do nothing if we're no longer genuinely inside it (the boundary
      // release already did its job; this isn't ours to correct).
      const bounds = regionBounds();
      if (!bounds) return;
      const currentY = window.scrollY;
      if (currentY < bounds.top - 1 || currentY > bounds.bottom + 1) return;

      const nearest = resolveNearestPanelIndex(scrollYProgress.get(), count);
      if (nearest !== activeIndexRef.current) setIndex(nearest);
      syncScrollPosition(nearest);
    }, SETTLE_IDLE_MS);
  });

  // Cleanup only — cancel a pending settle correction if the section
  // unmounts (e.g. route change) mid-timer.
  useEffect(() => {
    return () => clearTimeout(idleTimerRef.current);
  }, []);

  // Native (non-passive) listeners: React's synthetic wheel/touch handlers
  // are passive by default, which can't `preventDefault()` reliably — and
  // attaching directly to the pinned element itself (rather than `window`)
  // means these only ever fire while the user's pointer/touch is actually
  // over it, which is exactly when it's on-screen (sticky-pinned, or docked
  // at the top/bottom edge of the tall region) — no separate "is this
  // engaged" geometry tracking needed.
  useEffect(() => {
    const node = stickyRef.current;
    if (!node) return;

    function handleWheel(event: WheelEvent) {
      const direction: 1 | -1 = event.deltaY > 0 ? 1 : -1;
      if (isWalkthroughBoundary(activeIndexRef.current, direction, count)) {
        return; // release — let the page scroll straight past the section
      }
      event.preventDefault();
      attemptStep(direction);
    }

    function handleTouchStart(event: TouchEvent) {
      touchYRef.current = event.touches[0]?.clientY ?? null;
    }

    function handleTouchMove(event: TouchEvent) {
      if (touchYRef.current == null) return;
      const currentY = event.touches[0]?.clientY ?? touchYRef.current;
      const dy = touchYRef.current - currentY; // >0 = swipe up = next
      const direction: 1 | -1 = dy > 0 ? 1 : -1;
      if (isWalkthroughBoundary(activeIndexRef.current, direction, count)) {
        return; // release — let the page scroll straight past the section
      }
      event.preventDefault();
      if (Math.abs(dy) > TOUCH_STEP_THRESHOLD_PX) {
        attemptStep(direction);
        touchYRef.current = currentY;
      }
    }

    node.addEventListener("wheel", handleWheel, { passive: false });
    node.addEventListener("touchstart", handleTouchStart, { passive: true });
    node.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => {
      node.removeEventListener("wheel", handleWheel);
      node.removeEventListener("touchstart", handleTouchStart);
      node.removeEventListener("touchmove", handleTouchMove);
    };
    // Re-subscribes only when `count` changes — the closures over
    // `scrollRef`/`activeIndexRef`/`lastStepAtRef` stay correct across
    // renders because those are refs, not values captured by identity.
  }, [count]);

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
        style={{ height: `${count * 100}vh` }}
        className={storyWalkthroughTallClass}
      >
        <div ref={stickyRef} className={storyWalkthroughStickyClass}>
          <div className={storyWalkthroughGridClass}>
            <div className={storyWalkthroughPhoneColClass}>
              <PhoneMockup
                image={
                  <div className={storyWalkthroughImageStackClass}>
                    {items.map((item, index) =>
                      item.image ? (
                        <ImageLayer key={index} active={index === activeIndex}>
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
                <PanelLayer key={index} index={index} activeIndex={activeIndex}>
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

/** One panel's crossfade wrapper: a real `<li>` (native motion element, so
 *  no ref-forwarding concerns) placed in the shared grid-stack cell.
 *  `activeIndex` is a discrete step (never a scrubbed fraction), so `opacity`
 *  only ever animates *toward* a fixed 0 or 1 and settles there — there is
 *  no scroll-linked in-between value, so no partially-faded state is ever
 *  visible at rest. `pointer-events` follows suit so a hidden panel can't
 *  intercept clicks/drag even though it (deliberately) stays mounted and
 *  never `aria-hidden`: every panel's text content stays in the
 *  accessibility tree regardless of its current visual opacity, so
 *  screen-reader users always have all of it. */
function PanelLayer({
  index,
  activeIndex,
  children,
}: {
  index: number;
  activeIndex: number;
  children: ReactNode;
}) {
  const active = index === activeIndex;
  return (
    <motion.li
      className={storyWalkthroughPanelLayerClass}
      initial={false}
      animate={{
        opacity: active ? 1 : 0,
        y: active ? 0 : index < activeIndex ? -PANEL_SLIDE_PX : PANEL_SLIDE_PX,
      }}
      transition={SNAP_TRANSITION}
      style={{ pointerEvents: active ? "auto" : "none" }}
      aria-current={active ? "step" : undefined}
    >
      {children}
    </motion.li>
  );
}

/** One screenshot's crossfade wrapper in the phone's screen — the same
 *  discrete opacity as its matching `PanelLayer` (so the phone and the copy
 *  panel snap in sync), plus a subtle scale "pop" so the incoming screenshot
 *  visibly bounces into place rather than just fading. */
function ImageLayer({
  active,
  children,
}: {
  active: boolean;
  children: ReactNode;
}) {
  return (
    <motion.div
      className={storyWalkthroughImageLayerClass}
      initial={false}
      animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.97 }}
      transition={SNAP_TRANSITION}
    >
      {children}
    </motion.div>
  );
}
