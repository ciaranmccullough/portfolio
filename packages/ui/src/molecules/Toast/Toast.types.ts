import type { ComponentPropsWithoutRef } from "react";

/** Tone of a {@link Toast}: a positive confirmation or a failure. */
export type ToastVariant = "success" | "error";

/**
 * Props for the {@link Toast} molecule. Extends native `<div>` attributes
 * (`title` is omitted because we use it as the heading text, not the tooltip).
 */
export interface ToastProps extends Omit<
  ComponentPropsWithoutRef<"div">,
  "title"
> {
  /** Visual tone — drives the colour and the leading status icon. */
  variant: ToastVariant;
  /** Short heading line. */
  title: string;
  /** Optional supporting line beneath the title. */
  message?: string;
  /** When provided, a dismiss button is rendered and wired to this handler. */
  onDismiss?: () => void;
  /** Accessible label for the icon-only dismiss button. */
  dismissLabel?: string;
}
