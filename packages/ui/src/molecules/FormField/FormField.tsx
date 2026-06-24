import { useId } from "react";

import { Input } from "../../atoms";
import type { FormFieldProps } from "./FormField.types";

/**
 * FormField — a mono label bound to an {@link Input}. The label is explicitly
 * associated with the input via `htmlFor`/`id` for accessibility.
 */
export function FormField({ label, id, ...inputProps }: FormFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <label htmlFor={inputId} className="block">
      <span className="mb-2 block font-mono text-2xs font-bold uppercase tracking-wide text-fg-faint">
        {label}
      </span>
      <Input id={inputId} {...inputProps} />
    </label>
  );
}
