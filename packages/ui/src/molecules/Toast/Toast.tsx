import type { ReactNode } from "react";

import { Icon, Text } from "../../atoms";
import { cn } from "../../cn";
import {
  toastBadge,
  toastBase,
  toastBodyClass,
  toastCloseClass,
  toastTitleClass,
} from "./Toast.styles";
import type { ToastProps, ToastVariant } from "./Toast.types";

/** Leading status glyph per tone (inherits the badge's text colour). */
const variantIcon: Record<ToastVariant, ReactNode> = {
  success: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m20 6-11 11-5-5" />
    </svg>
  ),
  error: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5" />
      <path d="M12 16.5h.01" />
    </svg>
  ),
};

const closeIcon = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

/**
 * Toast — a transient notification card confirming success or reporting an
 * error. Presentational only: it renders the message and (optionally) a dismiss
 * button, but owns no timers or positioning — the consumer mounts it in a fixed
 * viewport and controls its lifetime. An error is announced assertively
 * (`role="alert"`), a success politely (`role="status"`).
 */
export function Toast({
  variant,
  title,
  message,
  onDismiss,
  dismissLabel,
  className,
  ...props
}: ToastProps) {
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      aria-live={variant === "error" ? "assertive" : "polite"}
      className={cn(toastBase, className)}
      {...props}
    >
      <span className={toastBadge[variant]}>
        <Icon>{variantIcon[variant]}</Icon>
      </span>
      <div className={toastBodyClass}>
        <Text variant="body" className={toastTitleClass}>
          {title}
        </Text>
        {message ? <Text variant="small">{message}</Text> : null}
      </div>
      {onDismiss ? (
        <button
          type="button"
          aria-label={dismissLabel}
          onClick={onDismiss}
          className={toastCloseClass}
        >
          <Icon>{closeIcon}</Icon>
        </button>
      ) : null}
    </div>
  );
}
