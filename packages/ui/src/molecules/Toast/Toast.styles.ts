import type { ToastVariant } from "./Toast.types";

export const toastBase =
  "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border border-line-strong bg-card p-4 shadow-brutal";

/** Rounded badge behind the status icon — tinted per tone. */
export const toastBadge: Record<ToastVariant, string> = {
  success:
    "flex size-9 shrink-0 items-center justify-center rounded-full bg-tint-green text-brand-green",
  error:
    "flex size-9 shrink-0 items-center justify-center rounded-full bg-tint-orange text-brand-orange",
};

export const toastBodyClass = "flex min-w-0 flex-col gap-0.5";

/** Body variant already sets the colour; we only bump the weight here. */
export const toastTitleClass = "font-semibold";

export const toastCloseClass =
  "-mr-1 -mt-1 shrink-0 cursor-pointer rounded-md p-1 text-fg-faint transition hover:bg-chip hover:text-fg";
