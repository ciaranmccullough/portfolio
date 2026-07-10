"use client";

import { useEffect, useState } from "react";

/** Tailwind's default `md` breakpoint (768px) — the same width the
 *  presentational `Walkthrough`/`WorkGrid`/etc. organisms switch layouts at,
 *  so this hook's threshold stays visually consistent with their own CSS
 *  breakpoints rather than drifting out of sync as a hand-picked number. */
const DESKTOP_QUERY = "(min-width: 768px)";

/**
 * Whether the viewport is at least Tailwind's `md` breakpoint — gates
 * desktop-only pinned/scroll-jacking layouts (e.g. `StoryWalkthrough`'s
 * snap-stepper) that need real horizontal room for a two-column layout and
 * don't degrade gracefully on a narrow viewport; those should render their
 * plain stacked layout instead below this width.
 *
 * `false` during SSR and the initial client render (no `window` on the
 * server; starting `false` avoids a hydration mismatch and defaults to the
 * safe, always-readable stacked layout). Updates once mounted, and keeps
 * tracking live resizes/orientation changes via the `MediaQueryList`
 * `change` event — a browser window resized across the breakpoint mid-visit
 * is honoured, not just the size at mount.
 */
export function useIsDesktopViewport(): boolean {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(DESKTOP_QUERY);
    setIsDesktop(mediaQueryList.matches);

    function onChange(event: MediaQueryListEvent) {
      setIsDesktop(event.matches);
    }

    mediaQueryList.addEventListener("change", onChange);
    return () => mediaQueryList.removeEventListener("change", onChange);
  }, []);

  return isDesktop;
}
