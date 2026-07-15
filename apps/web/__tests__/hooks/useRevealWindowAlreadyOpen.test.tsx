import { act, render } from "@testing-library/react";
import { useRef } from "react";

import { useRevealWindowAlreadyOpen } from "@/hooks/useRevealWindowAlreadyOpen";
import { REVEAL_START_VIEWPORT_FRACTION } from "@/lib/scrollAnimation";

/** The y coordinate where the reveal window opens, in jsdom's viewport
 *  (window.innerHeight defaults to 768 there). */
const START_LINE = window.innerHeight * REVEAL_START_VIEWPORT_FRACTION;

/** Stub layout for the probe element — jsdom performs no real layout, so the
 *  element's layout position is injected via an `offsetTop` spy (the hook
 *  reads the transform-independent offset chain, not a bounding rect; the
 *  probe has no offsetParent in jsdom, so its own offsetTop is the whole
 *  chain). */
function mockElementTop(top: number) {
  jest.spyOn(HTMLElement.prototype, "offsetTop", "get").mockReturnValue(top);
}

/** Renders the hook against a real element and records the value returned on
 *  every render pass, so both the pre-measurement (initial) and corrected
 *  (post-layout-effect) values are visible. */
function renderAndCaptureRenders() {
  const renders: boolean[] = [];
  function Probe() {
    const ref = useRef<HTMLDivElement>(null);
    renders.push(useRevealWindowAlreadyOpen(ref));
    return <div ref={ref} />;
  }
  render(<Probe />);
  return renders;
}

afterEach(() => {
  jest.restoreAllMocks();
});

describe("useRevealWindowAlreadyOpen", () => {
  it("is true when the element's top already sits above the reveal start line at mount", () => {
    mockElementTop(START_LINE - 1);
    const renders = renderAndCaptureRenders();
    expect(renders[renders.length - 1]).toBe(true);
  });

  it("is false when the element is still below the reveal start line at mount", () => {
    mockElementTop(window.innerHeight + 200);
    const renders = renderAndCaptureRenders();
    expect(renders[renders.length - 1]).toBe(false);
  });

  it("is false for an element sitting exactly on the start line (the window has not opened yet)", () => {
    mockElementTop(START_LINE);
    const renders = renderAndCaptureRenders();
    expect(renders[renders.length - 1]).toBe(false);
  });

  it("starts false and corrects within the same commit (layout effect, before paint)", () => {
    mockElementTop(0);
    const renders = renderAndCaptureRenders();
    // First render pass can't have measured yet; the layout-effect update
    // lands synchronously in the same commit, before the browser paints.
    expect(renders[0]).toBe(false);
    expect(renders[renders.length - 1]).toBe(true);
  });

  it("flips to true when late-loading fonts/images settle the element across the line (window load)", () => {
    // Below the line at mount (fallback-font layout)…
    mockElementTop(window.innerHeight + 100);
    const renders = renderAndCaptureRenders();
    expect(renders[renders.length - 1]).toBe(false);
    // …then the real fonts land and pull it inside the window, no scrolling.
    mockElementTop(START_LINE - 40);
    act(() => {
      window.dispatchEvent(new Event("load"));
    });
    expect(renders[renders.length - 1]).toBe(true);
  });

  it("stops re-checking once the visitor scrolls — the scrub owns the reveal from then on", () => {
    mockElementTop(window.innerHeight + 100);
    const renders = renderAndCaptureRenders();
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    // Even if a later load event finds the element inside the window, the
    // user is scrolling now, so the scroll-scrubbed fade applies instead.
    mockElementTop(START_LINE - 40);
    act(() => {
      window.dispatchEvent(new Event("load"));
    });
    expect(renders[renders.length - 1]).toBe(false);
  });
});
