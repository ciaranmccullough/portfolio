import { act, render, renderHook } from "@testing-library/react";

import { useIsDesktopViewport } from "@/hooks/useIsDesktopViewport";

/** A controllable `MediaQueryList` stand-in, mirroring the real
 *  `addEventListener("change", ...)` API the hook uses so tests can flip
 *  `matches` and fire a change after mount (simulating a live resize across
 *  the breakpoint), not just the value at the moment `matchMedia` was
 *  called. */
function installMatchMedia(initialMatches: boolean) {
  let matches = initialMatches;
  let listener: ((event: MediaQueryListEvent) => void) | null = null;

  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: (
      _event: string,
      cb: (e: MediaQueryListEvent) => void,
    ) => {
      listener = cb;
    },
    removeEventListener: jest.fn(() => {
      listener = null;
    }),
    dispatchEvent: jest.fn(() => false),
  })) as unknown as typeof window.matchMedia;

  return {
    change(next: boolean) {
      matches = next;
      act(() => {
        listener?.({ matches: next } as MediaQueryListEvent);
      });
    },
  };
}

describe("useIsDesktopViewport", () => {
  it("is false on the very first render, before the mount effect runs (SSR/hydration-safe)", () => {
    installMatchMedia(true);
    const renders: boolean[] = [];
    function Probe() {
      renders.push(useIsDesktopViewport());
      return null;
    }
    render(<Probe />);
    expect(renders[0]).toBe(false);
  });

  it("becomes true after mounting when the viewport already matches the md breakpoint", () => {
    installMatchMedia(true);
    const { result } = renderHook(() => useIsDesktopViewport());
    expect(result.current).toBe(true);
  });

  it("stays false after mounting when the viewport is narrower than the md breakpoint", () => {
    installMatchMedia(false);
    const { result } = renderHook(() => useIsDesktopViewport());
    expect(result.current).toBe(false);
  });

  it("tracks a live resize across the breakpoint via the change event", () => {
    const media = installMatchMedia(false);
    const { result } = renderHook(() => useIsDesktopViewport());
    expect(result.current).toBe(false);

    media.change(true);
    expect(result.current).toBe(true);

    media.change(false);
    expect(result.current).toBe(false);
  });

  it("removes its change listener on unmount", () => {
    installMatchMedia(true);
    const removeEventListener = jest.fn();
    window.matchMedia = jest.fn().mockImplementation((query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener,
      dispatchEvent: jest.fn(() => false),
    })) as unknown as typeof window.matchMedia;

    const { unmount } = renderHook(() => useIsDesktopViewport());
    unmount();
    expect(removeEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function),
    );
  });
});
