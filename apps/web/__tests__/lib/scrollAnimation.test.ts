/**
 * @jest-environment node
 */
import {
  clamp01,
  getActivePanelIndex,
  getPanelOpacity,
  getStaggeredProgress,
  getStaggeredRange,
  roundTo,
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

describe("getActivePanelIndex", () => {
  it("returns 0 at the very start of the sequence", () => {
    expect(getActivePanelIndex(0, 5)).toBe(0);
  });

  it("returns the last index at the very end of the sequence", () => {
    expect(getActivePanelIndex(1, 5)).toBe(4);
  });

  it("returns the panel whose equal-width slice contains progress", () => {
    // 5 panels -> slices [0,.2) [.2,.4) [.4,.6) [.6,.8) [.8,1]
    expect(getActivePanelIndex(0.05, 5)).toBe(0);
    expect(getActivePanelIndex(0.25, 5)).toBe(1);
    expect(getActivePanelIndex(0.45, 5)).toBe(2);
    expect(getActivePanelIndex(0.65, 5)).toBe(3);
    expect(getActivePanelIndex(0.95, 5)).toBe(4);
  });

  it("clamps out-of-range progress into [0, count-1]", () => {
    expect(getActivePanelIndex(-1, 5)).toBe(0);
    expect(getActivePanelIndex(2, 5)).toBe(4);
  });

  it("returns 0 for a non-positive count instead of dividing by zero", () => {
    expect(getActivePanelIndex(0.5, 0)).toBe(0);
  });
});

describe("getPanelOpacity", () => {
  const COUNT = 5; // slice width = 0.2, centres at .1 .3 .5 .7 .9

  it("is fully opaque at its own centre", () => {
    expect(getPanelOpacity(0.5, 2, COUNT)).toBe(1);
  });

  it("is fully transparent at the next panel's centre", () => {
    // panel 2's centre is .5; panel 3's centre (.7) is a full step away.
    expect(getPanelOpacity(0.7, 2, COUNT)).toBeCloseTo(0, 5);
  });

  it("is exactly 50/50 with its neighbour at the shared boundary", () => {
    // boundary between panel 1 (.2-.4) and panel 2 (.4-.6) is progress = .4
    const outgoing = getPanelOpacity(0.4, 1, COUNT);
    const incoming = getPanelOpacity(0.4, 2, COUNT);
    expect(outgoing).toBeCloseTo(0.5, 5);
    expect(incoming).toBeCloseTo(0.5, 5);
  });

  it("the first panel is fully visible from progress 0 (no fade-in before the sequence starts)", () => {
    expect(getPanelOpacity(0, 0, COUNT)).toBe(1);
    expect(getPanelOpacity(0.05, 0, COUNT)).toBe(1);
  });

  it("the last panel stays fully visible through progress 1 (no fade-out after the sequence ends)", () => {
    expect(getPanelOpacity(1, COUNT - 1, COUNT)).toBe(1);
    expect(getPanelOpacity(0.95, COUNT - 1, COUNT)).toBe(1);
  });

  it("the first panel still fades out as later panels take over", () => {
    expect(getPanelOpacity(0.3, 0, COUNT)).toBeCloseTo(0, 5);
  });

  it("the last panel still fades in from earlier panels", () => {
    expect(getPanelOpacity(0.7, COUNT - 1, COUNT)).toBe(0);
  });

  it("exactly two adjacent panels are ever substantially visible at once (no triple-overlap)", () => {
    const progress = 0.42;
    const opacities = [0, 1, 2, 3, 4].map((i) =>
      getPanelOpacity(progress, i, COUNT),
    );
    const visible = opacities.filter((o) => o > 0.001);
    expect(visible.length).toBeLessThanOrEqual(2);
  });

  it("a sharper fade (fade < 1) still peaks at 1 at the centre and 0 by the boundary", () => {
    expect(getPanelOpacity(0.5, 2, COUNT, 0.5)).toBe(1);
    // boundary is a full step (.1) from centre; fade=0.5 falls off over .1 (0.2 * 0.5)
    expect(getPanelOpacity(0.6, 2, COUNT, 0.5)).toBeCloseTo(0, 5);
  });

  it("returns 0 for a non-positive count instead of dividing by zero", () => {
    expect(getPanelOpacity(0.5, 0, 0)).toBe(0);
  });
});
