import type { LinkVariant } from "./Link.types";

export const linkBase = "font-semibold transition";

export const linkVariant: Record<LinkVariant, string> = {
  nav: "text-fg-muted no-underline hover:text-brand-violet",
  inline:
    "border-b-2 border-brand-violet pb-0.5 text-fg no-underline hover:text-brand-violet",
  cta: "rounded-full bg-ink px-4 py-2 text-fg-inverse no-underline hover:-translate-y-px hover:bg-line-dark",
};
