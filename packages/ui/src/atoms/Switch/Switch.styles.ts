/* The <label> that wraps the hidden input and the visual track/knob. It sizes
   the control and forwards clicks to the input (native label behaviour). */
export const switchWrapperClass =
  "relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center has-[:disabled]:cursor-not-allowed";

/* The real control: a checkbox exposed as a switch, visually hidden but still
   focusable and in the accessibility tree. `peer` drives the track/knob state. */
export const switchInputClass = "peer sr-only";

/* Track base — a sibling of the input so `peer-*` variants apply. Focus is shown
   on the track via a ring when the (hidden) input is keyboard-focused. */
export const switchTrackBase =
  "pointer-events-none absolute inset-0 rounded-full border border-ink transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-brand-violet peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-card";

/** Interactive track: neutral when off, violet when the input is checked. */
export const switchTrackUnlocked =
  "bg-line-strong peer-checked:bg-brand-violet";

/** Locked track: statically green (a locked switch is always on). */
export const switchTrackLocked = "bg-brand-green";

/* Knob — a sibling after the input so `peer-checked:` slides it across. */
export const switchKnobClass =
  "pointer-events-none absolute left-1 top-1 flex size-5 items-center justify-center rounded-full border border-ink bg-card text-ink transition-transform duration-200 ease-out peer-checked:translate-x-5";
