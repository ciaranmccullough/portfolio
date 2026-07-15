/**
 * Pure scroll-progress math shared by the story page's scroll-driven
 * animation components (`ScrollReveal`, `PrinciplesReveal`,
 * `StoryWalkthrough`). Dependency-free (no React, no Motion) so it's
 * trivially unit-testable without jsdom or a live scroll position — jsdom
 * can't simulate real scrolling, so this is where the actual "windowing"
 * logic lives and gets exercised, rather than in the components themselves.
 */

/**
 * Fraction of the viewport height at which a scroll-reveal's window opens —
 * an element's top crossing this line from below starts its fade/rise scrub
 * (the `useScroll` offset `` `start ${fraction * 100}%` ``). Shared with
 * `useRevealWindowAlreadyOpen`'s mount-time "already past the line?" check
 * so the scrub and the check can never disagree about where the window is.
 */
export const REVEAL_START_VIEWPORT_FRACTION = 0.92;

/** Clamp `value` to the inclusive `[0, 1]` range. */
export function clamp01(value: number): number {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

/**
 * Round `value` to `precision` decimal places. Used to throttle scroll-driven
 * React state updates (e.g. a progress percentage or an active panel index)
 * to one re-render per meaningfully-different value instead of one per
 * scroll/animation-frame event — finer differences are visually
 * indistinguishable, so this keeps the motion looking continuous without
 * re-rendering on every frame.
 */
export function roundTo(value: number, precision: number): number {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

/**
 * Shift a `[0, 1]` scroll-progress input range later by `index * step`, for
 * staggering several elements that each track their own (near-identical)
 * scroll position — e.g. a row of cards revealing in sequence rather than
 * all at once. The end of the range stays at `1` (later elements "catch up"
 * to finish revealing at the same point as the first); the start is capped
 * at `max` so a large index never eats the whole window and leaves nothing
 * to animate through.
 */
export function getStaggeredRange(
  index: number,
  step: number,
  max = 0.85,
): [number, number] {
  const start = clamp01(Math.min(index * step, max));
  return [start, 1];
}

/**
 * The local `[0, 1]` progress of a single staggered element (see
 * {@link getStaggeredRange}) at overall scroll `progress` — `0` before its
 * (delayed) window opens, `1` once it's fully revealed, linear in between.
 * Used where the per-element value must end up as a plain resolved number
 * (e.g. committed to React state) rather than fed into `useTransform`.
 */
export function getStaggeredProgress(
  progress: number,
  index: number,
  step: number,
  max = 0.85,
): number {
  const [start, end] = getStaggeredRange(index, step, max);
  if (end <= start) return 1;
  return clamp01((progress - start) / (end - start));
}

/**
 * The canonical scroll-progress (0–1) "resting" position for panel `index`
 * of `count` evenly-spaced panels in the snap-stepper — index `0` rests at
 * progress `0`, the last index rests at progress `1`, evenly spaced in
 * between. Used to compute where to programmatically settle the tall
 * region's scroll position after a step, so the page scrollbar always
 * reflects a whole panel, never a point between two.
 *
 * The exact inverse of {@link resolveNearestPanelIndex} — round-tripping
 * `resolveNearestPanelIndex(getPanelRestProgress(i, count), count)` always
 * returns `i` — which matters: the stepper and the "settle a stray scroll
 * position" correction (scrollbar drags, keyboard scroll, deep-anchor
 * arrivals) must agree on the same resting points, or they'd fight each
 * other back and forth.
 */
export function getPanelRestProgress(index: number, count: number): number {
  if (count <= 1) return 0;
  return clamp01(index / (count - 1));
}

/**
 * The nearest whole panel (0-based) for a given scroll `progress` (0–1)
 * through `count` evenly-spaced panels — the exact inverse of
 * {@link getPanelRestProgress}. Used to resolve an arbitrary scroll position
 * (scrollbar drag, keyboard scroll, deep-anchor arrival — anything that
 * didn't go through the debounced wheel/touch stepper) to a single discrete
 * panel, so the visible state is always a whole panel, never a blend of two.
 */
export function resolveNearestPanelIndex(
  progress: number,
  count: number,
): number {
  if (count <= 0) return 0;
  const index = Math.round(clamp01(progress) * (count - 1));
  return Math.min(count - 1, Math.max(0, index));
}

/** One accepted-or-swallowed step attempt's resulting state — see
 *  {@link resolveWalkthroughStep}. */
export interface WalkthroughStepState {
  /** The active panel index (0-based). */
  index: number;
  /** Timestamp (`Date.now()`/`performance.now()`, same clock as `now` below)
   *  of the last *accepted* step — the debounce window is measured from
   *  this, not from every attempt. */
  lastStepAt: number;
}

/**
 * Whether stepping `direction` (`1` = next, `-1` = previous) from `index`
 * would go out of bounds — i.e. the gesture should be released to native
 * scroll (not intercepted) rather than stepped. Callers check this *before*
 * calling `preventDefault()`/{@link resolveWalkthroughStep}: at the first
 * panel scrolling up, or the last panel scrolling down, the page must scroll
 * straight past the section instead of trapping the gesture.
 */
export function isWalkthroughBoundary(
  index: number,
  direction: 1 | -1,
  count: number,
): boolean {
  return (direction > 0 && index >= count - 1) || (direction < 0 && index <= 0);
}

/**
 * Whether `now` still falls inside the cooldown window of the last
 * *accepted* step ({@link resolveWalkthroughStep}'s debounce). Used to hold
 * the pin at a boundary panel: the gesture that steps onto the first/last
 * panel keeps delivering events over its inertial tail, and releasing those
 * to native scroll would carry the page straight past the section in the
 * same motion the reader used to arrive — the pinned phone must stay in
 * situ on the final step. While inside this window, boundary-direction
 * events are still swallowed; only a second, deliberate gesture (after the
 * cooldown) releases the page. This is the same clock and window as the
 * stepper's own debounce, so "one gesture = exactly one panel" also means
 * "one gesture never both lands on a boundary panel and leaves the section".
 */
export function isWithinStepCooldown(
  lastStepAt: number,
  now: number,
  debounceMs = 700,
): boolean {
  return now - lastStepAt < debounceMs;
}

/**
 * The snap-stepper's core, dependency-free state transition: attempt to move
 * one step (`direction`: `1` next, `-1` previous) from `state`, honouring a
 * `debounceMs` cooldown since the last *accepted* step.
 *
 * Returns `state` unchanged (same object reference — callers can use that to
 * detect a no-op) in two cases: the step would go out of bounds (the caller
 * should have already checked {@link isWalkthroughBoundary} and released the
 * gesture instead of calling this at all — this is a defensive second
 * guard), or `now` is within `debounceMs` of `state.lastStepAt` — an
 * inertial wheel/trackpad fling delivers many discrete events over its
 * deceleration curve, and a real touch swipe can cross the move threshold
 * more than once; only the *first* event of such a burst should ever advance
 * the index, so every following one in the same ~700ms window is swallowed,
 * never skipped-ahead. This is what guarantees "one gesture = exactly one
 * panel, never two."
 *
 * Pure and clock-agnostic (`now` is a parameter, not read internally) so the
 * debounce boundary is exactly, deterministically testable without fake
 * timers.
 */
export function resolveWalkthroughStep(
  state: WalkthroughStepState,
  direction: 1 | -1,
  count: number,
  now: number,
  debounceMs = 700,
): WalkthroughStepState {
  const next = state.index + direction;
  if (next < 0 || next >= count) return state;
  if (now - state.lastStepAt < debounceMs) return state;
  return { index: next, lastStepAt: now };
}
