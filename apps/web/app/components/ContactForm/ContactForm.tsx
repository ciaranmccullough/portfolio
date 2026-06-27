"use client";

import { Button, FormField, Text } from "@portfolio/ui";
import { useRef, useState, type FormEvent } from "react";

import {
  contactFormActionsClass,
  contactFormClass,
  contactFormSuccessButtonClass,
  contactFormSuccessClass,
  contactFormSuccessMessageClass,
  contactFormSuccessTitleClass,
} from "./ContactForm.styles";
import type { ContactFormProps, FieldName } from "./ContactForm.types";

/** Letters (incl. accented Latin), spaces and a few name punctuation marks. */
const NAME_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿ' .-]{2,}$/;
/** Pragmatic email shape: something@something.tld with no whitespace. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MESSAGE_MIN_LENGTH = 10;

const FIELD_NAMES: readonly FieldName[] = ["name", "email", "message"];

/**
 * ContactForm — the interactive, uncontrolled contact form.
 *
 * Field values are owned by the DOM and read through refs (no value state); we
 * keep React state only for validation messages, the submit-enabled flag and
 * the post-submit success view. Validation runs in real time against regex
 * patterns, the submit button stays disabled until every field is valid, and a
 * submit logs the collected data. Copy is injected from the localised
 * dictionary so this component holds no user-facing strings.
 */
export function ContactForm({
  fields,
  errors,
  submitLabel,
  clearLabel,
  successTitle,
  successMessage,
  sendAnotherLabel,
}: ContactFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const touched = useRef<Set<FieldName>>(new Set());

  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<FieldName, string>>
  >({});
  const [canSubmit, setCanSubmit] = useState(false);
  const [canClear, setCanClear] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function validate(field: FieldName, value: string): string {
    const trimmed = value.trim();
    if (field === "name") return NAME_PATTERN.test(trimmed) ? "" : errors.name;
    if (field === "email")
      return EMAIL_PATTERN.test(trimmed) ? "" : errors.email;
    return trimmed.length >= MESSAGE_MIN_LENGTH ? "" : errors.message;
  }

  function readValues(): Record<FieldName, string> {
    return {
      name: nameRef.current?.value ?? "",
      email: emailRef.current?.value ?? "",
      message: messageRef.current?.value ?? "",
    };
  }

  function isFormValid(values: Record<FieldName, string>): boolean {
    return FIELD_NAMES.every((field) => validate(field, values[field]) === "");
  }

  /** Re-check a single (touched) field on every keystroke / blur. */
  function handleFieldChange(field: FieldName) {
    return () => {
      touched.current.add(field);
      const values = readValues();
      setFieldErrors((prev) => ({
        ...prev,
        // Clear the error when a field is emptied; only validate real content.
        [field]:
          values[field].trim() === "" ? "" : validate(field, values[field]),
      }));
      setCanSubmit(isFormValid(values));
      setCanClear(FIELD_NAMES.some((f) => values[f].length > 0));
    };
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = readValues();
    const nextErrors: Record<FieldName, string> = {
      name: validate("name", values.name),
      email: validate("email", values.email),
      message: validate("message", values.message),
    };
    FIELD_NAMES.forEach((field) => touched.current.add(field));
    setFieldErrors(nextErrors);

    if (!isFormValid(values)) {
      setCanSubmit(false);
      const firstInvalid = FIELD_NAMES.find(
        (field) => nextErrors[field] !== "",
      );
      if (firstInvalid === "name") nameRef.current?.focus();
      else if (firstInvalid === "email") emailRef.current?.focus();
      else messageRef.current?.focus();
      return;
    }

    const data = {
      name: values.name.trim(),
      email: values.email.trim(),
      message: values.message.trim(),
    };
    // Task's definition of done: log the collected form-data object on submit.
    console.log("Contact form submission", data);
    setSubmitted(true);
  }

  function resetState() {
    touched.current.clear();
    setFieldErrors({});
    setCanSubmit(false);
    setCanClear(false);
  }

  function handleClear() {
    formRef.current?.reset();
    resetState();
  }

  function handleSendAnother() {
    resetState();
    setSubmitted(false);
  }

  if (submitted) {
    return (
      <div className={contactFormSuccessClass} role="status">
        <Text as="h3" variant="h3" className={contactFormSuccessTitleClass}>
          {successTitle}
        </Text>
        <Text variant="body" className={contactFormSuccessMessageClass}>
          {successMessage}
        </Text>
        <Button
          variant="ghost-dark"
          className={contactFormSuccessButtonClass}
          onClick={handleSendAnother}
        >
          {sendAnotherLabel}
        </Button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className={contactFormClass}
    >
      <FormField
        ref={nameRef}
        name="name"
        autoComplete="name"
        label={fields.name.label}
        placeholder={fields.name.placeholder}
        error={fieldErrors.name}
        onChange={handleFieldChange("name")}
        onBlur={handleFieldChange("name")}
      />
      <FormField
        ref={emailRef}
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        label={fields.email.label}
        placeholder={fields.email.placeholder}
        error={fieldErrors.email}
        onChange={handleFieldChange("email")}
        onBlur={handleFieldChange("email")}
      />
      <FormField
        ref={messageRef}
        multiline
        name="message"
        label={fields.message.label}
        placeholder={fields.message.placeholder}
        error={fieldErrors.message}
        onChange={handleFieldChange("message")}
        onBlur={handleFieldChange("message")}
      />
      <div className={contactFormActionsClass}>
        <Button type="submit" variant="primary" disabled={!canSubmit}>
          {submitLabel}
        </Button>
        <Button
          type="button"
          variant="ghost-dark"
          onClick={handleClear}
          disabled={!canClear}
        >
          {clearLabel}
        </Button>
      </div>
    </form>
  );
}
