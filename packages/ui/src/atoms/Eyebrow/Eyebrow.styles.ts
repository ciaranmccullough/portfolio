import type { EyebrowTone } from "./Eyebrow.types";

export const eyebrowBase =
  "font-mono text-sm font-bold uppercase tracking-wider";

// Default palette — for eyebrows on light surfaces (paper/card). orange/green
// use the darker `-deep` shades to clear AA there (the bright accents fail:
// ~2.7:1); violet already passes bright.
export const eyebrowTone: Record<EyebrowTone, string> = {
  violet: "text-brand-violet",
  orange: "text-brand-orange-deep",
  green: "text-brand-green-deep",
};

// Dark-surface palette (`onDark`) — for eyebrows on the dark ink panel, where
// the bright accents read well and the `-deep` shades would be too dim.
export const eyebrowToneOnDark: Record<EyebrowTone, string> = {
  violet: "text-brand-violet",
  orange: "text-brand-orange",
  green: "text-brand-green",
};
