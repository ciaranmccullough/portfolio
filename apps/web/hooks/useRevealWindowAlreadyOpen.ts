"use client";

import type { RefObject } from "react";
import { useLayoutEffect, useState } from "react";

import { REVEAL_START_VIEWPORT_FRACTION } from "@/lib/scrollAnimation";

/**
 * Whether `ref`'s scroll-reveal window is already open with the page at rest
 * — i.e. the element's top sits above the `REVEAL_START_VIEWPORT_FRACTION`
 * line without the visitor having scrolled it there.
 *
 * On a tall viewport the section below the hero loads in exactly that state,
 * and scrubbing it would freeze its text at a small fraction of full opacity
 * (near-invisible against the paper background — a real WCAG contrast
 * failure, and precisely the frame Lighthouse/axe samples) until the first
 * scroll event. Consumers (`ScrollReveal`, `PrinciplesReveal`) treat `true`
 * as "render fully revealed, skip the scrub": scroll-entry reveals are for
 * content that *enters* from below, not content the visitor can already see.
 *
 * Measured in a layout effect (pre-paint, so a corrected first render
 * replaces the mid-fade one before either is shown), then re-checked when
 * web fonts and the load event settle the layout — swapping in the real
 * fonts can pull the element up across the line without any scrolling. The
 * first scroll cancels the re-checks: from then on the scrub owns the
 * reveal. A load that arrives already scrolled past the element (browser
 * scroll restoration, deep anchors) lands fully revealed through the same
 * mount-time check.
 */
export function useRevealWindowAlreadyOpen(
  ref: RefObject<HTMLElement | null>,
): boolean {
  const [alreadyOpen, setAlreadyOpen] = useState(false);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Layout (offset-chain) position, NOT getBoundingClientRect: by the time
    // this effect runs, the scrub has already applied its own initial
    // translateY to the element, and a rect would include that transform —
    // reading an element that sits just inside the window as "still below
    // the line" while Motion's own transform-independent offset math has its
    // reveal window fractionally open. `offsetTop` ignores transforms, so
    // this measures the same geometry Motion scrubs against.
    const layoutTop = () => {
      let top = 0;
      let el: HTMLElement | null = node;
      while (el) {
        top += el.offsetTop;
        el = el.offsetParent as HTMLElement | null;
      }
      return top - window.scrollY;
    };
    const isOpen = () =>
      layoutTop() < window.innerHeight * REVEAL_START_VIEWPORT_FRACTION;

    if (isOpen()) {
      setAlreadyOpen(true);
      return;
    }

    let done = false;
    const finish = () => {
      done = true;
      window.removeEventListener("scroll", finish);
      window.removeEventListener("load", onSettle);
    };
    const onSettle = () => {
      if (done) return;
      if (isOpen()) {
        setAlreadyOpen(true);
        finish();
      }
    };

    // The first scroll cancels everything — the scrub owns the reveal now.
    window.addEventListener("scroll", finish, { passive: true });
    window.addEventListener("load", onSettle);
    // `document.fonts` is universal in the browsers this app targets, but
    // absent in jsdom — hence the optional chain.
    document.fonts?.ready.then(onSettle).catch(() => {});
    return finish;
  }, [ref]);

  return alreadyOpen;
}
