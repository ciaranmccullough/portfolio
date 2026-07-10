// ScrollProgressBar is ESM in @portfolio/ui (skipped by next/jest); stub it
// down to a plain div, mapping the numeric `progress` prop to a `data-*`
// attribute (React warns about unrecognized non-data/aria props on a DOM
// element) so tests can assert on it without triggering that warning.
jest.mock("@portfolio/ui", () => {
  const React = require("react");
  return {
    ScrollProgressBar: ({ progress, ...rest }: Record<string, unknown>) =>
      React.createElement("div", {
        "data-testid": "progress-bar",
        "data-progress": progress,
        ...rest,
      }),
  };
});

// motion/react is ESM (skipped by next/jest) and drives real scroll
// listeners — mock it with a controllable stub, mirroring the pattern used
// by `useHideOnScroll.test.tsx`. `scrollYProgress` must be a STABLE object
// reference across renders (as a real MotionValue is) — a fresh object per
// render would make any effect that depends on it re-fire every render.
const motionState: {
  value: number;
  cb: ((latest: number) => void) | null;
} = { value: 0, cb: null };
const scrollYProgress = { get: () => motionState.value };
jest.mock("motion/react", () => ({
  useScroll: () => ({ scrollYProgress }),
  useMotionValueEvent: (
    _value: unknown,
    _event: string,
    cb: (latest: number) => void,
  ) => {
    motionState.cb = cb;
  },
}));

jest.mock("@/hooks/useScrollAnimationsEnabled", () => ({
  useScrollAnimationsEnabled: jest.fn(),
}));

import { act, render, screen } from "@testing-library/react";

import { ScrollProgress } from "@/app/components/ScrollProgress/ScrollProgress";
import { useScrollAnimationsEnabled } from "@/hooks/useScrollAnimationsEnabled";

const mockEnabled = useScrollAnimationsEnabled as jest.MockedFunction<
  typeof useScrollAnimationsEnabled
>;

/** Simulate scrolling to `to`: updates what `.get()` returns *and* fires the
 *  registered "change" callback with it — a real MotionValue does both
 *  together (the callback fires because the value itself changed). */
function scrollTo(to: number) {
  motionState.value = to;
  act(() => {
    motionState.cb?.(to);
  });
}

beforeEach(() => {
  motionState.value = 0;
  motionState.cb = null;
  mockEnabled.mockReturnValue(false);
});

describe("ScrollProgress", () => {
  it("renders the accessible label on the progress bar", () => {
    render(<ScrollProgress label="Reading progress" />);
    expect(screen.getByTestId("progress-bar")).toHaveAttribute(
      "aria-label",
      "Reading progress",
    );
  });

  it("renders at 0% when scroll animations are disabled (reduced motion / not yet mounted)", () => {
    mockEnabled.mockReturnValue(false);
    motionState.value = 0.7; // even if the page happens to already be scrolled
    render(<ScrollProgress label="Reading progress" />);
    expect(screen.getByTestId("progress-bar")).toHaveAttribute(
      "data-progress",
      "0",
    );
  });

  it("syncs to the current scroll position as soon as animations are enabled", () => {
    mockEnabled.mockReturnValue(true);
    motionState.value = 0.42;
    render(<ScrollProgress label="Reading progress" />);
    expect(screen.getByTestId("progress-bar")).toHaveAttribute(
      "data-progress",
      "42",
    );
  });

  it("updates on scroll changes while enabled, rounded to a whole percent", () => {
    mockEnabled.mockReturnValue(true);
    render(<ScrollProgress label="Reading progress" />);

    scrollTo(0.256);

    expect(screen.getByTestId("progress-bar")).toHaveAttribute(
      "data-progress",
      "26",
    );
  });

  it("ignores scroll change events while disabled", () => {
    mockEnabled.mockReturnValue(false);
    render(<ScrollProgress label="Reading progress" />);

    scrollTo(0.9);

    expect(screen.getByTestId("progress-bar")).toHaveAttribute(
      "data-progress",
      "0",
    );
  });
});
