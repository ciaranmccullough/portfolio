import type { ButtonSize, ButtonVariant } from "./Button.types";

export const buttonBase =
  "cursor-pointer font-body font-semibold transition hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0";

export const buttonVariant: Record<ButtonVariant, string> = {
  primary: "bg-brand-violet text-white hover:opacity-90",
  dark: "bg-ink text-fg-inverse hover:opacity-90",
  ghost: "border border-line-strong bg-transparent text-ink hover:bg-chip",
  // Quiet secondary on a dark panel: transparent with a subtle border that
  // turns violet on hover (e.g. the Contact form's Clear / Send-another).
  "ghost-dark":
    "border border-line-dark bg-transparent text-fg-on-dark hover:border-brand-violet hover:text-fg-inverse",
};

export const buttonSize: Record<ButtonSize, string> = {
  sm: "px-3 py-2 text-xs",
  md: "px-4.5 py-3 text-md",
  lg: "px-6 py-3.5 text-lg",
};

// Radius is kept separate from `buttonSize` (rather than bundled in, as
// CLAUDE.md's reference snippet does) so `pill` can swap it out for
// `buttonPillClass` without ever having two radius utilities on the element
// at once — Tailwind's cascade order between two same-property utilities
// isn't controlled by class-list order, so avoiding the overlap entirely is
// the robust choice.
export const buttonRadius: Record<ButtonSize, string> = {
  sm: "rounded-md",
  md: "rounded-lg",
  lg: "rounded-xl",
};

/** Fully-rounded pill radius, used instead of `buttonRadius[size]` when `pill` is set. */
export const buttonPillClass = "rounded-full";
