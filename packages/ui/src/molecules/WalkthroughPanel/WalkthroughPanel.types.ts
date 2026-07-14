import type { ComponentPropsWithoutRef, ReactNode } from "react";

/** A labelled callout within a {@link WalkthroughPanel}, e.g. "THE CALL — …". */
export interface WalkthroughPanelCallout {
  label: ReactNode;
  body: ReactNode;
}

/**
 * Props for the {@link WalkthroughPanel} molecule. Renders an `<article>`.
 * Pass `children` for extra per-step content (e.g. a `PollBar`) rendered
 * below the callout.
 */
export interface WalkthroughPanelProps extends Omit<
  ComponentPropsWithoutRef<"article">,
  "title"
> {
  /**
   * Large outline numeral, e.g. `"01"`. Decorative — pass a pre-formatted
   * string; omit to render no numeral.
   */
  index?: ReactNode;
  /** Mono kicker above the heading, e.g. "ONBOARDING". */
  eyebrow?: ReactNode;
  /** Panel heading. */
  title: ReactNode;
  /** Panel body copy. */
  description?: ReactNode;
  /** Optional labelled callout below the body (e.g. label "THE CALL —", body "Cached favourites on-device…"). */
  callout?: WalkthroughPanelCallout;
  /**
   * Hide the index numeral and eyebrow below Tailwind's `md` breakpoint
   * (CSS-only, via `max-md:hidden` — they stay in the DOM, just not laid
   * out/painted there). For a consumer that shows the same "which step,
   * what's it called" information elsewhere at narrow widths too (e.g. a
   * synced phone-mockup progress row), repeating it here again is pure
   * noise, and on a short mobile viewport the numeral alone is tall enough
   * to push real content off the bottom of a pinned/clipped container.
   * Desktop/tablet keep both, matching the design mock.
   */
  compact?: boolean;
}
