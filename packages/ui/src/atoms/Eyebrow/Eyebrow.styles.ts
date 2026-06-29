import type { EyebrowTone } from "./Eyebrow.types";

export const eyebrowBase =
  "font-mono text-sm font-bold uppercase tracking-wider";

// Eyebrows sit on paper/card; orange and green need the AA-contrast `-deep`
// shades to clear 4.5:1 (violet already passes).
export const eyebrowTone: Record<EyebrowTone, string> = {
  violet: "text-brand-violet",
  orange: "text-brand-orange-deep",
  green: "text-brand-green-deep",
};
