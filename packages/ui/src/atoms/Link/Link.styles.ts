import type { LinkVariant } from "./Link.types";

export const linkBase = "font-semibold transition";

export const linkVariant: Record<LinkVariant, string> = {
  nav: "text-fg-muted no-underline hover:text-brand-violet",
  inline:
    "border-b-2 border-brand-violet pb-0.5 text-fg no-underline hover:text-brand-violet",
  cta: "rounded-full bg-ink px-4 py-2 text-fg-inverse no-underline hover:-translate-y-px hover:bg-line-dark",
  primary:
    "inline-flex items-center gap-1.5 rounded-xl bg-brand-violet px-5.5 py-3 text-base text-white no-underline shadow-brand hover:-translate-y-0.5 hover:bg-brand-violet-dark",
  // Dark-surface inline link (e.g. the Contact panel's socials): a quiet 1px
  // underline that brightens and turns violet on hover.
  social:
    "border-b border-line-dark pb-0.5 text-fg-on-dark no-underline hover:border-brand-violet hover:text-fg-inverse",
};

// Re-exported (not redefined) from Button — `buttonVariant`/`buttonSize`
// aren't part of the public barrel (styles are package-internal), so this is
// Link's only way to reuse Button's exact visual grammar for its
// `buttonVariant`/`buttonSize` pill mode without duplicating any class
// string. Always paired with `buttonPillClass`, never Button's own per-size
// radius — see Link.types.ts.
export {
  buttonBase as linkButtonBase,
  buttonPillClass as linkButtonPillClass,
  buttonSize as linkButtonSize,
  buttonVariant as linkButtonVariant,
} from "../Button/Button.styles";
