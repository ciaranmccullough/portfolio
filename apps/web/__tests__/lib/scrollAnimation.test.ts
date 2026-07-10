/**
 * @jest-environment node
 */
import {
  clamp01,
  getPanelRestProgress,
  getStaggeredProgress,
  getStaggeredRange,
  isWalkthroughBoundary,
  resolveNearestPanelIndex,
  resolveWalkthroughStep,
  roundTo,
  type WalkthroughStepState,
} from "@/lib/scrollAnimation";

describe("clamp01", () => {
  it("passes through values already inside [0, 1]", () => {
    expect(clamp01(0)).toBe(0);
    expect(clamp01(0.5)).toBe(0.5);
    expect(clamp01(1)).toBe(1);
  });

  it("clamps values below 0 up to 0", () => {
    expect(clamp01(-0.2)).toBe(0);
    expect(clamp01(-100)).toBe(0);
  });

  it("clamps values above 1 down to 1", () => {
    expect(clamp01(1.2)).toBe(1);
    expect(clamp01(100)).toBe(1);
  });
});

describe("roundTo", () => {
  it("rounds to the given number of decimal places", () => {
    expect(roundTo(0.12345, 2)).toBe(0.12);
    expect(roundTo(0.126, 2)).toBe(0.13);
    expect(roundTo(0.5, 0)).toBe(1); // banker's-adjacent — Math.round rounds .5 up
  });

  it("supports precision 0 for whole-number rounding", () => {
    expect(roundTo(41.6, 0)).toBe(42);
    expect(roundTo(41.4, 0)).toBe(41);
  });

  it("is stable across repeated equal inputs (throttling relies on this)", () => {
    expect(roundTo(0.301, 2)).toBe(roundTo(0.304, 2));
  });
});

describe("getStaggeredRange", () => {
  it("returns [0, 1] for index 0 regardless of step", () => {
    expect(getStaggeredRange(0, 0.15)).toEqual([0, 1]);
  });

  it("shifts the start later by index * step, keeping the end at 1", () => {
    expect(getStaggeredRange(1, 0.15)).toEqual([0.15, 1]);
    expect(getStaggeredRange(2, 0.15)).toEqual([0.3, 1]);
  });

  it("caps the shifted start at `max` so a large index still leaves a reveal window", () => {
    const [start, end] = getStaggeredRange(10, 0.15, 0.85);
    expect(start).toBe(0.85);
    expect(end).toBe(1);
  });

  it("defaults max to 0.85", () => {
    const [start] = getStaggeredRange(20, 0.2);
    expect(start).toBe(0.85);
  });

  it("never returns a negative start", () => {
    const [start] = getStaggeredRange(-3, 0.15);
    expect(start).toBeGreaterThanOrEqual(0);
  });
});

describe("getStaggeredProgress", () => {
  it("is 0 before the (possibly delayed) window opens", () => {
    expect(getStaggeredProgress(0, 1, 0.15)).toBe(0);
    expect(getStaggeredProgress(0.1, 1, 0.15)).toBe(0); // window starts at .15
  });

  it("is 1 once progress reaches the end of the window", () => {
    expect(getStaggeredProgress(1, 0, 0.15)).toBe(1);
    expect(getStaggeredProgress(1, 3, 0.15)).toBe(1);
  });

  it("is linear in between, matching the un-shifted case for index 0", () => {
    expect(getStaggeredProgress(0.5, 0, 0.15)).toBeCloseTo(0.5, 5);
  });

  it("accounts for the shifted start on later indices", () => {
    // index 1, step .15 -> window [.15, 1], width .85
    expect(getStaggeredProgress(0.15, 1, 0.15)).toBe(0);
    expect(getStaggeredProgress(1, 1, 0.15)).toBe(1);
    const midway = 0.15 + 0.85 / 2;
    expect(getStaggeredProgress(midway, 1, 0.15)).toBeCloseTo(0.5, 5);
  });

  it("never returns a value outside [0, 1]", () => {
    expect(getStaggeredProgress(-1, 2, 0.15)).toBe(0);
    expect(getStaggeredProgress(5, 2, 0.15)).toBe(1);
  });
});

describe("getPanelRestProgress / resolveNearestPanelIndex (round-trip inverses)", () => {
  const COUNT = 5;

  it("rests index 0 at progress 0 and the last index at progress 1", () => {
    expect(getPanelRestProgress(0, COUNT)).toBe(0);
    expect(getPanelRestProgress(COUNT - 1, COUNT)).toBe(1);
  });

  it("spaces the middle indices evenly", () => {
    expect(getPanelRestProgress(1, COUNT)).toBeCloseTo(0.25, 5);
    expect(getPanelRestProgress(2, COUNT)).toBeCloseTo(0.5, 5);
    expect(getPanelRestProgress(3, COUNT)).toBeCloseTo(0.75, 5);
  });

  it("always rests at progress 0 for a single-panel sequence (no divide-by-zero)", () => {
    expect(getPanelRestProgress(0, 1)).toBe(0);
  });

  it("resolveNearestPanelIndex is the exact inverse of getPanelRestProgress for every index", () => {
    for (let i = 0; i < COUNT; i += 1) {
      const progress = getPanelRestProgress(i, COUNT);
      expect(resolveNearestPanelIndex(progress, COUNT)).toBe(i);
    }
  });

  it("resolveNearestPanelIndex rounds an in-between progress to the closer panel", () => {
    // Rest points at 0, .25, .5, .75, 1 — .3 is closer to .25 (index 1) than .5 (index 2).
    expect(resolveNearestPanelIndex(0.3, COUNT)).toBe(1);
    expect(resolveNearestPanelIndex(0.4, COUNT)).toBe(2);
  });

  it("resolveNearestPanelIndex clamps out-of-range progress into [0, count-1]", () => {
    expect(resolveNearestPanelIndex(-1, COUNT)).toBe(0);
    expect(resolveNearestPanelIndex(2, COUNT)).toBe(COUNT - 1);
  });

  it("resolveNearestPanelIndex returns 0 for a non-positive count instead of dividing by zero", () => {
    expect(resolveNearestPanelIndex(0.5, 0)).toBe(0);
  });
});

describe("isWalkthroughBoundary", () => {
  const COUNT = 5;

  it("is a boundary when stepping forward from the last index", () => {
    expect(isWalkthroughBoundary(COUNT - 1, 1, COUNT)).toBe(true);
  });

  it("is a boundary when stepping backward from the first index", () => {
    expect(isWalkthroughBoundary(0, -1, COUNT)).toBe(true);
  });

  it("is not a boundary anywhere in the interior", () => {
    expect(isWalkthroughBoundary(2, 1, COUNT)).toBe(false);
    expect(isWalkthroughBoundary(2, -1, COUNT)).toBe(false);
  });

  it("is not a boundary stepping forward from the first index or backward from the last", () => {
    expect(isWalkthroughBoundary(0, 1, COUNT)).toBe(false);
    expect(isWalkthroughBoundary(COUNT - 1, -1, COUNT)).toBe(false);
  });
});

describe("resolveWalkthroughStep", () => {
  const COUNT = 5;

  it("advances by exactly one index on a fresh step", () => {
    const state: WalkthroughStepState = { index: 1, lastStepAt: 0 };
    const next = resolveWalkthroughStep(state, 1, COUNT, 1000);
    expect(next).toEqual({ index: 2, lastStepAt: 1000 });
  });

  it("steps backward by exactly one index", () => {
    const state: WalkthroughStepState = { index: 3, lastStepAt: 0 };
    const next = resolveWalkthroughStep(state, -1, COUNT, 1000);
    expect(next.index).toBe(2);
  });

  it("swallows a second step attempt inside the debounce window (still one step)", () => {
    const first = resolveWalkthroughStep(
      { index: 0, lastStepAt: 0 },
      1,
      COUNT,
      1000,
    );
    expect(first.index).toBe(1);

    // A second burst 200ms later — well inside the 700ms window.
    const second = resolveWalkthroughStep(first, 1, COUNT, 1200);
    expect(second).toBe(first); // same reference: genuinely unchanged, not just equal
    expect(second.index).toBe(1);
  });

  it("accepts a new step once the debounce window has fully elapsed", () => {
    const first = resolveWalkthroughStep(
      { index: 0, lastStepAt: 0 },
      1,
      COUNT,
      1000,
    );
    const second = resolveWalkthroughStep(first, 1, COUNT, 1700);
    expect(second.index).toBe(2);
  });

  it("respects a custom debounce duration", () => {
    const first = resolveWalkthroughStep(
      { index: 0, lastStepAt: 0 },
      1,
      COUNT,
      1000,
      300,
    );
    const tooSoon = resolveWalkthroughStep(first, 1, COUNT, 1200, 300);
    expect(tooSoon.index).toBe(1);

    const longEnough = resolveWalkthroughStep(first, 1, COUNT, 1301, 300);
    expect(longEnough.index).toBe(2);
  });

  it("never advances past the last index — returns state unchanged at the upper bound", () => {
    const state: WalkthroughStepState = { index: COUNT - 1, lastStepAt: 0 };
    const next = resolveWalkthroughStep(state, 1, COUNT, 1000);
    expect(next).toBe(state);
  });

  it("never advances past the first index — returns state unchanged at the lower bound", () => {
    const state: WalkthroughStepState = { index: 0, lastStepAt: 0 };
    const next = resolveWalkthroughStep(state, -1, COUNT, 1000);
    expect(next).toBe(state);
  });

  it("a rapid burst of many events only ever advances one step, however many fire", () => {
    // `-Infinity` is the "no step has ever happened yet" sentinel (matches
    // the real component's initial state) — using `0` here would make the
    // very first event of the burst its own false debounce hit against a
    // coincidentally-equal `now`.
    let state: WalkthroughStepState = { index: 0, lastStepAt: -Infinity };
    // Simulate an inertial fling: 20 wheel events 10ms apart (200ms total),
    // all well inside the 700ms debounce window.
    for (let i = 0; i < 20; i += 1) {
      state = resolveWalkthroughStep(state, 1, COUNT, i * 10);
    }
    expect(state.index).toBe(1);
  });
});
