export type FieldName = "name" | "email" | "message";

export interface FieldCopy {
  label: string;
  placeholder: string;
}

/** Props for {@link ContactForm}. All copy is injected from the dictionary. */
export interface ContactFormProps {
  fields: Record<FieldName, FieldCopy>;
  errors: Record<FieldName, string>;
  submitLabel: string;
  clearLabel: string;
  successTitle: string;
  successMessage: string;
  sendAnotherLabel: string;
}
