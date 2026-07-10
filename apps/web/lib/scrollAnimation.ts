/**
 * Pure scroll-progress math shared by the story page's scroll-driven
 * animation components (`ScrollReveal`, `PrinciplesReveal`,
 * `StoryWalkthrough`). Dependency-free (no React, no Motion) so it's
 * trivially unit-testable without jsdom or a live scroll position — jsdom
 * can't simulate real scrolling, so this is where the actual "windowing"
 * logic lives and gets exercised, rather than in the components themselves.
 */

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
 * Which panel (0-based) is "active" at a given overall scroll `progress`
 * (0–1) through a sequence of `count` equal-width panels. Used for the
 * walkthrough's discrete UI (the phone's step label/counter) — the
 * continuous crossfade itself is {@link getPanelOpacity}.
 */
export function getActivePanelIndex(progress: number, count: number): number {
  if (count <= 0) return 0;
  const index = Math.floor(clamp01(progress) * count);
  return Math.min(count - 1, Math.max(0, index));
}

/**
 * Opacity (0–1) for panel `index` of `count` equal-width panels at overall
 * scroll `progress` (0–1).
 *
 * Each panel has a triangular visibility profile peaking (opacity 1) at its
 * own centre and falling linearly to 0 by the time `progress` reaches the
 * *next* panel's centre — so adjacent panels are exactly 50/50 at the
 * boundary between them (a smooth crossfade, not a jump-cut). `fade` scales
 * that fall-off distance as a multiple of one panel's width (`1` = falls off
 * over exactly one panel-width, matching the neighbour's centre; `< 1`
 * sharpens the transition and adds a fully-opaque plateau in the middle of
 * each panel's slice).
 *
 * The first panel doesn't fade in before `progress` reaches its own centre
 * (it's already fully visible when the sequence begins) and the last panel
 * doesn't fade out after its centre (it stays visible through the end) —
 * there's no earlier/later panel to crossfade with at either end.
 */
export function getPanelOpacity(
  progress: number,
  index: number,
  count: number,
  fade = 1,
): number {
  if (count <= 0) return 0;
  const p = clamp01(progress);
  const step = 1 / count;
  const center = (index + 0.5) * step;
  const isFirst = index === 0;
  const isLast = index === count - 1;

  const effectiveP =
    (isFirst && p < center) || (isLast && p > center) ? center : p;
  const distance = Math.abs(effectiveP - center);
  const falloff = step * Math.max(fade, 0.0001);
  return clamp01(1 - distance / falloff);
}
