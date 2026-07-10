import type { ComponentPropsWithoutRef, ReactNode } from "react";

/** One row in a {@link PollBar}. */
export interface PollOption {
  label: ReactNode;
  /** Result value, `0`–`100` (a percentage). */
  value: number;
  /** Marks the leading option — its label and fill render in the accent colour. */
  leading?: boolean;
}

/**
 * Props for the {@link PollBar} molecule. Renders a `<ul>` of horizontal
 * result rows (label, percentage, and a filled track).
 */
export interface PollBarProps extends ComponentPropsWithoutRef<"ul"> {
  options: PollOption[];
}
