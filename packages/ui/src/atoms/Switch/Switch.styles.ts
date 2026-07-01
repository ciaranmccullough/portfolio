export type SwitchState = "on" | "off" | "locked";

export const switchTrackBase =
  "relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border border-ink transition-colors disabled:cursor-not-allowed";

/** Track fill per state — a single bg-* class so `cn` never has to override. */
export const switchTrackState: Record<SwitchState, string> = {
  on: "bg-brand-violet",
  off: "bg-line-strong",
  locked: "bg-brand-green",
};

export const switchKnob =
  "absolute left-1 top-1 flex size-5 items-center justify-center rounded-full border border-ink bg-card text-ink transition-transform duration-200 ease-out";

export const switchKnobOn = "translate-x-5";
export const switchKnobOff = "translate-x-0";
