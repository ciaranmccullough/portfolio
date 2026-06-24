import { useId } from "react";

import { Input } from "../../atoms";
import { formFieldCaptionClass, formFieldLabelClass } from "./FormField.styles";
import type { FormFieldProps } from "./FormField.types";

/**
 * FormField — a mono label bound to an {@link Input}. The label is explicitly
 * associated with the input via `htmlFor`/`id` for accessibility.
 */
export function FormField({ label, id, ...inputProps }: FormFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <label htmlFor={inputId} className={formFieldLabelClass}>
      <span className={formFieldCaptionClass}>{label}</span>
      <Input id={inputId} {...inputProps} />
    </label>
  );
}
