"use client";

import { Button, FormField, Toast, type ToastVariant } from "@portfolio/ui";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, type FormEvent } from "react";

import { track } from "@/lib/analytics/mixpanel";

import {
  contactFormActionsClass,
  contactFormClass,
  contactFormToastMotionClass,
  contactFormToastViewportClass,
} from "./ContactForm.styles";
import type { ContactFormProps, FieldName } from "./ContactForm.types";

/** Letters (incl. accented Latin), spaces and a few name punctuation marks. */
const NAME_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿ' .-]{2,}$/;
/** Pragmatic email shape: something@something.tld with no whitespace. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MESSAGE_MIN_LENGTH = 10;

const FIELD_NAMES: readonly FieldName[] = ["name", "email", "message"];

/** How long a toast stays up before auto-dismissing (ms). */
const TOAST_DURATION = 6000;

/** A single active toast; `id` re-triggers the animation on repeat submits. */
interface ActiveToast {
  id: number;
  variant: ToastVariant;
}

/**
 * ContactForm — the interactive, uncontrolled contact form.
 *
 * Field values are owned by the DOM and read through refs (no value state); we
 * keep React state only for validation messages, the submit-enabled flag and
 * the in-flight status. Validation runs in real time against regex patterns and
 * the submit button stays disabled until every field is valid. A valid submit
 * POSTs the data to the Formspree `endpoint` as JSON (AJAX, so the page never
 * navigates); the outcome is surfaced through a transient {@link Toast} —
 * success also resets the form. Copy is injected from the localised dictionary.
 */
export function ContactForm({
  endpoint,
  fields,
  errors,
  submitLabel,
  sendingLabel,
  clearLabel,
  successTitle,
  successMessage,
  errorTitle,
  submitError,
  dismissToastLabel,
}: ContactFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const touched = useRef<Set<FieldName>>(new Set());
  const toastId = useRef(0);

  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<FieldName, string>>
  >({});
  const [canSubmit, setCanSubmit] = useState(false);
  const [canClear, setCanClear] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<ActiveToast | null>(null);

  // Auto-dismiss the current toast; the timer resets whenever a new one shows.
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), TOAST_DURATION);
    return () => clearTimeout(timer);
  }, [toast]);

  function showToast(variant: ToastVariant) {
    toastId.current += 1;
    setToast({ id: toastId.current, variant });
  }

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

  function resetState() {
    touched.current.clear();
    setFieldErrors({});
    setCanSubmit(false);
    setCanClear(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
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

    // AJAX submit to Formspree: POST JSON with an Accept: application/json
    // header so the endpoint answers with JSON instead of redirecting, keeping
    // the single-page experience intact.
    setSubmitting(true);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`Submit failed: ${response.status}`);
      // Success: wipe the form (DOM + validation state) and confirm via toast.
      formRef.current?.reset();
      resetState();
      showToast("success");
      // Value Moment — a visitor reached out. No PII: the message content and
      // sender details are never sent to analytics.
      track("form_sent", { form: "contact" });
    } catch (error) {
      showToast("error");
      track("form_send_failed", {
        form: "contact",
        reason: error instanceof Error ? error.message : "unknown",
      });
    } finally {
      setSubmitting(false);
    }
  }

  function handleClear() {
    formRef.current?.reset();
    resetState();
  }

  return (
    <>
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
          <Button
            type="submit"
            variant="primary"
            disabled={!canSubmit || submitting}
          >
            {submitting ? sendingLabel : submitLabel}
          </Button>
          <Button
            type="button"
            variant="ghost-dark"
            onClick={handleClear}
            disabled={!canClear || submitting}
          >
            {clearLabel}
          </Button>
        </div>
      </form>

      <div className={contactFormToastViewportClass}>
        <AnimatePresence>
          {toast ? (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className={contactFormToastMotionClass}
            >
              <Toast
                variant={toast.variant}
                title={toast.variant === "success" ? successTitle : errorTitle}
                message={
                  toast.variant === "success" ? successMessage : submitError
                }
                onDismiss={() => setToast(null)}
                dismissLabel={dismissToastLabel}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </>
  );
}
