import type { ComponentPropsWithoutRef, ReactNode } from "react";

/** One step in a {@link PhoneMockup}'s progress row. */
export interface PhoneMockupStep {
  /** Step label shown below the segments, e.g. "Onboarding". */
  label: ReactNode;
}

/**
 * Props for the {@link PhoneMockup} molecule. Renders a `<div>` device frame
 * around a single screenshot slot.
 */
export interface PhoneMockupProps extends ComponentPropsWithoutRef<"div"> {
  /** The screenshot (e.g. a `next/image` with `fill`), sized to cover the screen. */
  image?: ReactNode;
  /**
   * Content shown in the screen area when `image` is omitted — e.g. a CMS
   * walkthrough item with a blank image field. When this is also omitted the
   * screen renders empty (just its background), so the frame never looks
   * broken either way.
   */
  fallback?: ReactNode;
  /** Optional step indicator row below the frame: pill segments plus the
   * active step's label and an "NN / total" counter. */
  steps?: PhoneMockupStep[];
  /** 0-based index of the active step. Ignored when `steps` is omitted. Defaults to `0`. */
  activeStep?: number;
}
