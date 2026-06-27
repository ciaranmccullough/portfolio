/** A social / off-site link shown under the contact pitch. */
export interface ContactLink {
  href: string;
  label: string;
}

/** Contact content as the UI consumes it — the clean frontend entity. */
export interface Contact {
  title: string;
  intro: string;
  socials: ContactLink[];
}
