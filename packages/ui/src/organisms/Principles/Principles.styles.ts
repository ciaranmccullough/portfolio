import type { PrincipleCardTone } from "../../molecules";

/* Fluid rhythm measured off the design doc (clamp(60px,12vw,150px) top and
   bottom) — approximated on the Tailwind breakpoint scale since this section
   grows noticeably more generous at desktop widths than a single fixed
   `py-16` allows. Keep in sync by hand with the app's `PrinciplesReveal`
   (its own copy — see that file's own comment on why it can't reuse this
   one directly). */
export const principlesClass =
  "mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-24 lg:px-14 lg:py-32 xl:py-36";

export const principlesHeaderClass = "mb-9";

export const principlesEyebrowClass = "mb-2.5";

export const principlesTitleClass = "max-w-[18ch]";

/* 1-col by default, 3-col from md — mirrors the design's ≤900px breakpoint
   (Tailwind's default `md` is 768px, close enough without a custom
   breakpoint token). `list-none` clears the <ol>'s native decimal markers —
   PrincipleCard renders its own big numeral instead. */
export const principlesGridClass =
  "grid list-none grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3";

/* Cycled across cards by position (not a prop) — same pattern as Hero's
   internal heroTabFloat/heroTabAlign/heroTabSlant cycles. */
export const principlesToneCycle: PrincipleCardTone[] = [
  "violet",
  "orange",
  "green",
];
