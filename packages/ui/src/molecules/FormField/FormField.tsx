import { useId } from "react";

import { Input, Textarea } from "../../atoms";
import type { InputProps, TextareaProps } from "../../atoms";
import { cn } from "../../cn";
import {
  formFieldCaptionClass,
  formFieldControlInvalidClass,
  formFieldErrorClass,
  formFieldLabelClass,
} from "./FormField.styles";
import type { FormFieldProps } from "./FormField.types";

/**
 * FormField — a mono label bound to an {@link Input} (or a multi-line Textarea
 * when `multiline` is set). The label is associated with the control via
 * `htmlFor`/`id`; an `error` is wired up with `aria-invalid`/`aria-describedby`
 * and shown in a space-reserving slot so the layout never jumps.
 */
export function FormField({
  label,
  id,
  error,
  multiline,
  className,
  ...control
}: FormFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  const controlProps = {
    id: inputId,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
    className: cn(error ? formFieldControlInvalidClass : undefined, className),
  };

  return (
    <label htmlFor={inputId} className={formFieldLabelClass}>
      <span className={formFieldCaptionClass}>{label}</span>
      {multiline ? (
        <Textarea {...controlProps} {...(control as TextareaProps)} />
      ) : (
        <Input {...controlProps} {...(control as InputProps)} />
      )}
      <span id={errorId} className={formFieldErrorClass} aria-live="polite">
        {error}
      </span>
    </label>
  );
}
