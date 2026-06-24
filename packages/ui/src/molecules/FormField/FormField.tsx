import { useId } from "react";

import { colors, fonts, fontWeights } from "@portfolio/tokens";

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
    <label htmlFor={inputId} style={{ display: "block" }}>
      <span
        style={{
          display: "block",
          marginBottom: "7px",
          fontFamily: fonts.mono,
          fontSize: "11.5px",
          fontWeight: fontWeights.bold,
          letterSpacing: "0.05em",
          color: colors.text.faint,
        }}
      >
        {label}
      </span>
      <Input id={inputId} {...inputProps} />
    </label>
  );
}
