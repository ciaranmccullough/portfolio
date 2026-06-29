import type { ComponentType } from "react";

import { Text } from "../../atoms";
import { cn } from "../../cn";
import { AlertIcon, CheckIcon, CloseIcon, type GlyphProps } from "../../icons";
import {
  toastBadge,
  toastBase,
  toastBodyClass,
  toastCloseClass,
  toastTitleClass,
} from "./Toast.styles";
import type { ToastProps, ToastVariant } from "./Toast.types";

/** Leading status glyph per tone (inherits the badge's text colour). */
const variantIcon: Record<ToastVariant, ComponentType<GlyphProps>> = {
  success: CheckIcon,
  error: AlertIcon,
};

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
  const StatusIcon = variantIcon[variant];
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      aria-live={variant === "error" ? "assertive" : "polite"}
      className={cn(toastBase, className)}
      {...props}
    >
      <span className={toastBadge[variant]}>
        <StatusIcon />
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
          <CloseIcon />
        </button>
      ) : null}
    </div>
  );
}
