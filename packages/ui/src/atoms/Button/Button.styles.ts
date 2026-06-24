import type { ButtonSize, ButtonVariant } from "./Button.types";

export const buttonBase = "cursor-pointer font-body font-semibold";

export const buttonVariant: Record<ButtonVariant, string> = {
  primary: "bg-brand-violet text-white",
  dark: "bg-ink text-fg-inverse",
  ghost: "border border-line-strong bg-transparent text-ink",
};

export const buttonSize: Record<ButtonSize, string> = {
  sm: "rounded-md px-3 py-2 text-xs",
  md: "rounded-lg px-4.5 py-3 text-md",
  lg: "rounded-xl px-6 py-3.5 text-lg",
};
