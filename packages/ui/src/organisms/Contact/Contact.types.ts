import type { ComponentPropsWithoutRef, ReactNode } from "react";

/** Props for the {@link Contact} organism. Renders a `<section>` (dark panel). */
export interface ContactProps extends Omit<
  ComponentPropsWithoutRef<"section">,
  "title"
> {
  /** Pitch heading. */
  title: ReactNode;
  /** Supporting copy. */
  intro?: ReactNode;
  /** Submit button label. */
  submitLabel?: ReactNode;
  /** Message shown after a successful submit. */
  successMessage?: ReactNode;
}
