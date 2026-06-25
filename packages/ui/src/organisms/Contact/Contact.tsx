import { Eyebrow, Link, Text } from "../../atoms";
import { cn } from "../../cn";
import {
  contactGlowOneClass,
  contactGlowTwoClass,
  contactGridClass,
  contactIntroClass,
  contactClass,
  contactSocialsClass,
  contactTitleClass,
} from "./Contact.styles";
import type { ContactProps } from "./Contact.types";

/**
 * Contact — a dark panel pairing the pitch (eyebrow, heading, intro, social
 * links) with the contact form, which is passed in as `children`. The form's
 * interactivity lives in the app; this organism stays presentational.
 */
export function Contact({
  eyebrow,
  title,
  intro,
  socials,
  className,
  children,
  ...props
}: ContactProps) {
  return (
    <section className={cn(contactClass, className)} {...props}>
      <span aria-hidden="true" className={contactGlowOneClass} />
      <span aria-hidden="true" className={contactGlowTwoClass} />
      <div className={contactGridClass}>
        <div>
          {eyebrow ? <Eyebrow tone="green">{eyebrow}</Eyebrow> : null}
          <Text as="h2" variant="h1" className={contactTitleClass}>
            {title}
          </Text>
          {intro ? (
            <Text variant="body" className={contactIntroClass}>
              {intro}
            </Text>
          ) : null}
          {socials?.length ? (
            <ul className={contactSocialsClass}>
              {socials.map((social) => (
                <li key={social.href}>
                  <Link
                    href={social.href}
                    variant="inline"
                    className="text-fg-on-dark"
                  >
                    {social.label}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}
