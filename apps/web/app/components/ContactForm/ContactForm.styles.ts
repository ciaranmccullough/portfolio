// On mobile the form sits directly on the Contact section's dark panel (no
// nested frame); from `sm` up it gets its own bordered, inset surface.
export const contactFormClass =
  "flex flex-col gap-2 sm:rounded-2xl sm:border sm:border-line-dark sm:bg-ink-soft sm:p-6";

export const contactFormActionsClass = "mt-2 flex gap-3";

/**
 * Fixed viewport that floats the toast above all content (bottom-centre on
 * mobile, bottom-right from `sm`). `pointer-events-none` lets clicks fall
 * through the empty gutter; the Toast itself re-enables pointer events.
 */
export const contactFormToastViewportClass =
  "pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex justify-center sm:inset-x-auto sm:bottom-6 sm:right-6 sm:justify-end";

/** The motion wrapper sizing: full-width on mobile, hug the Toast from `sm`. */
export const contactFormToastMotionClass = "w-full sm:w-auto";
