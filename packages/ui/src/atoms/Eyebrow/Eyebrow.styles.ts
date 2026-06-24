import type { EyebrowTone } from "./Eyebrow.types";

export const eyebrowBase =
  "font-mono text-sm font-bold uppercase tracking-wider";

export const eyebrowTone: Record<EyebrowTone, string> = {
  violet: "text-brand-violet",
  orange: "text-brand-orange",
  green: "text-brand-green",
};
