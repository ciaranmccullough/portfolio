import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { WalkthroughPanelCallout } from "../../molecules";

/** One step in the {@link Walkthrough} showreel. */
export interface WalkthroughItem {
  /**
   * The screenshot for this step (e.g. a `next/image`). Omit for a graceful
   * fallback (e.g. a CMS item with a blank image field) — see `imageFallback`.
   */
  image?: ReactNode;
  /**
   * Mono kicker shown above the panel heading, and reused as the phone's
   * step label (e.g. "ONBOARDING") — the design uses the same word for both.
   */
  eyebrow?: ReactNode;
  /** Panel heading. */
  title: ReactNode;
  /** Panel body copy. */
  description?: ReactNode;
  /** Optional "THE CALL — …" callout. */
  callout?: WalkthroughPanelCallout;
  /** Optional extra content appended to this panel (e.g. a `PollBar`). */
  extra?: ReactNode;
}

/** Props for the {@link Walkthrough} organism. Renders a `<section>`. */
export interface WalkthroughProps extends Omit<
  ComponentPropsWithoutRef<"section">,
  "title"
> {
  /** Mono kicker above the heading, e.g. "// THE WALKTHROUGH". */
  eyebrow?: ReactNode;
  /** Section heading (e.g. "Five surfaces, one story"). */
  title?: ReactNode;
  items: WalkthroughItem[];
  /**
   * Content shown in the phone's screen area when the featured item's
   * `image` is omitted (e.g. the real CMS data's "Onboarding" item, which
   * ships with a blank image field).
   */
  imageFallback?: ReactNode;
}
