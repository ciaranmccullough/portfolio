// `motion/react`'s `useReducedMotion` drives a real `matchMedia` check;
// mock it with a controllable stub so tests can simulate either preference.
// (`useEffect`/`useState` come from real `react` — only the reduced-motion
// source is faked here.)
let mockReducedMotion: boolean | null = false;
jest.mock("motion/react", () => ({
  useReducedMotion: () => mockReducedMotion,
}));

import { render } from "@testing-library/react";

import { useScrollAnimationsEnabled } from "@/hooks/useScrollAnimationsEnabled";

beforeEach(() => {
  mockReducedMotion = false;
});

/** Renders the hook and records the value it returns on every render pass,
 *  so the test can see both the pre-effect (initial) and post-effect
 *  (mounted) values instead of only the final settled one. */
function renderAndCaptureRenders() {
  const renders: boolean[] = [];
  function Probe() {
    const enabled = useScrollAnimationsEnabled();
    renders.push(enabled);
    return null;
  }
  render(<Probe />);
  return renders;
}

describe("useScrollAnimationsEnabled", () => {
  it("is false on the very first render, before the mount effect runs (SSR/hydration-safe)", () => {
    const renders = renderAndCaptureRenders();
    expect(renders[0]).toBe(false);
  });

  it("becomes true after mounting when the user has not requested reduced motion", () => {
    mockReducedMotion = false;
    const renders = renderAndCaptureRenders();
    expect(renders[renders.length - 1]).toBe(true);
  });

  it("stays false after mounting when the user prefers reduced motion", () => {
    mockReducedMotion = true;
    const renders = renderAndCaptureRenders();
    expect(renders[renders.length - 1]).toBe(false);
  });

  it("treats an undetermined (null) reduced-motion value as not explicitly reduced", () => {
    mockReducedMotion = null;
    const renders = renderAndCaptureRenders();
    expect(renders[renders.length - 1]).toBe(true);
  });
});
