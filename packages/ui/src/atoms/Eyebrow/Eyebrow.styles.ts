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
// violet uses its own lighter `-on-dark` tint instead of the base brand
// colour: the base only clears ~3.4:1 on ink (fails WCAG AA's 4.5:1 — see
// theme.css), where orange/green's bright shades already clear it there.
export const eyebrowToneOnDark: Record<EyebrowTone, string> = {
  violet: "text-brand-violet-on-dark",
  orange: "text-brand-orange",
  green: "text-brand-green",
};
