import type { ReactNode } from "react";

export interface ErrorScreenProps {
  /** Mono kicker above the heading (e.g. "Error"). */
  eyebrow?: ReactNode;
  /** The error heading. */
  title: ReactNode;
  /** Supporting message. */
  message?: ReactNode;
  /** Retry-link label; renders a link to `retryHref` when set. */
  retryLabel?: ReactNode;
  /** Where the retry link points. Defaults to "/". */
  retryHref?: string;
}
