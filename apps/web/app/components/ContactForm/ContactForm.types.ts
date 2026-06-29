export type FieldName = "name" | "email" | "message";

export interface FieldCopy {
  label: string;
  placeholder: string;
}

/** Props for {@link ContactForm}. All copy is injected from the dictionary. */
export interface ContactFormProps {
  /** Formspree (or compatible) endpoint the form POSTs to. */
  endpoint: string;
  fields: Record<FieldName, FieldCopy>;
  errors: Record<FieldName, string>;
  submitLabel: string;
  /** Label shown on the submit button while the request is in flight. */
  sendingLabel: string;
  clearLabel: string;
  /** Success toast — heading and supporting line. */
  successTitle: string;
  successMessage: string;
  /** Error toast — heading and supporting line. */
  errorTitle: string;
  submitError: string;
  /** Accessible label for the toast's dismiss button. */
  dismissToastLabel: string;
}
