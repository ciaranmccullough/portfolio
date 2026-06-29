import type { EyebrowTone } from "./Eyebrow.types";

export const eyebrowBase =
  "font-mono text-sm font-bold uppercase tracking-wider";

// Tone colours are chosen for the surface each eyebrow actually sits on:
// - orange (Toolbox) sits on light paper → needs the AA-contrast `-deep` shade.
// - green (Contact) sits on the *dark* ink panel, where the bright
//   `text-brand-green` already clears AA (5.96:1) and the darker `-deep` would
//   REGRESS it (3.45:1). So green stays bright; do not switch it to `-deep`.
// - violet already passes on light.
export const eyebrowTone: Record<EyebrowTone, string> = {
  violet: "text-brand-violet",
  orange: "text-brand-orange-deep",
  green: "text-brand-green",
};
