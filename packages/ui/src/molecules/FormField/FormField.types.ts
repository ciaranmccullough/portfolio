import type { ReactNode } from "react";

import type { InputProps, TextareaProps } from "../../atoms";

interface FormFieldOwnProps {
  /** The field label. */
  label: ReactNode;
  /**
   * Validation message. When set, the control is flagged invalid and the message
   * is announced. The error slot always reserves space, so the surrounding
   * layout never jumps as the message appears or clears.
   */
  error?: ReactNode;
}

/**
 * Props for the {@link FormField} molecule. A discriminated union on
 * `multiline`: a single-line {@link Input} by default, or a multi-line Textarea
 * when `multiline` is set. Both expose `ref` (React 19) for uncontrolled use.
 */
export type FormFieldProps =
  | (FormFieldOwnProps & { multiline?: false } & InputProps)
  | (FormFieldOwnProps & { multiline: true } & TextareaProps);
