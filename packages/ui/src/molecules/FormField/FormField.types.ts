import type { ReactNode } from "react";

import type { InputProps } from "../../atoms";

/**
 * Props for the {@link FormField} molecule. Extends the {@link InputProps} of
 * the underlying Input (including `ref`); adds the field label.
 */
export interface FormFieldProps extends InputProps {
  /** The field label. */
  label: ReactNode;
}
