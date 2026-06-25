"use client";

import { useState } from "react";

import { Button } from "../../atoms";
import { cn } from "../../cn";
import {
  contactClass,
  contactFormClass,
  contactIntroClass,
  contactSuccessClass,
  contactTitleClass,
} from "./Contact.styles";
import type { ContactProps } from "./Contact.types";

/**
 * Contact — a dark panel pairing a pitch with a FormField stack (passed as
 * children) and a success state shown after submit. The heading/intro are
 * rendered directly (the Text atom's colours target light surfaces).
 */
export function Contact({
  title,
  intro,
  submitLabel = "Send message",
  successMessage = "Thanks — I'll be in touch.",
  className,
  children,
  ...props
}: ContactProps) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className={cn(contactClass, className)} {...props}>
      <h2 className={contactTitleClass}>{title}</h2>
      {intro ? <p className={contactIntroClass}>{intro}</p> : null}
      {submitted ? (
        <p className={contactSuccessClass} role="status">
          {successMessage}
        </p>
      ) : (
        <form
          className={contactFormClass}
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(true);
          }}
        >
          {children}
          <Button type="submit">{submitLabel}</Button>
        </form>
      )}
    </section>
  );
}
