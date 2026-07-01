// `motion/react` ships ESM (skipped by next/jest) and drives real scroll
// listeners — so mock it with a controllable stub. The mock keeps its state
// object internally and exposes it as `__state` so the test can set the
// "previous" scroll position and fire the registered "change" callback.
jest.mock("motion/react", () => {
  const state: {
    previous: number;
    cb: ((latest: number) => void) | null;
  } = { previous: 0, cb: null };
  return {
    __state: state,
    useScroll: () => ({ scrollY: { getPrevious: () => state.previous } }),
    useMotionValueEvent: (
      _value: unknown,
      _event: string,
      cb: (latest: number) => void,
    ) => {
      state.cb = cb;
    },
  };
});

import { act, renderHook } from "@testing-library/react";

import { useHideOnScroll } from "@/hooks/useHideOnScroll";

const { __state } = jest.requireMock("motion/react") as {
  __state: { previous: number; cb: ((latest: number) => void) | null };
};

/** Simulate a scroll: set where we were, then fire the change event at `latest`. */
function scroll(from: number, to: number) {
  __state.previous = from;
  act(() => {
    __state.cb?.(to);
  });
}

beforeEach(() => {
  __state.previous = 0;
  __state.cb = null;
});

describe("useHideOnScroll", () => {
  it("starts visible (not hidden)", () => {
    const { result } = renderHook(() => useHideOnScroll());
    expect(result.current).toBe(false);
  });

  it("hides when scrolling down past the reveal threshold", () => {
    const { result } = renderHook(() => useHideOnScroll());
    scroll(130, 200); // downward, past the default 120px threshold
    expect(result.current).toBe(true);
  });

  it("stays visible when scrolling down but still above the threshold", () => {
    const { result } = renderHook(() => useHideOnScroll());
    scroll(10, 100); // downward, but 100 <= 120
    expect(result.current).toBe(false);
  });

  it("reveals again when scrolling back up, even far down the page", () => {
    const { result } = renderHook(() => useHideOnScroll());
    scroll(130, 200);
    expect(result.current).toBe(true);
    scroll(300, 200); // upward
    expect(result.current).toBe(false);
  });

  it("honours a custom revealAt threshold", () => {
    const { result } = renderHook(() => useHideOnScroll(50));
    scroll(40, 80); // downward, past the custom 50px threshold
    expect(result.current).toBe(true);
  });

  it("treats a first change with no previous value as scrolling down from 0", () => {
    const { result } = renderHook(() => useHideOnScroll());
    scroll(0, 200); // previous 0, latest 200 → down and past threshold
    expect(result.current).toBe(true);
  });
});
