/* Fixed to the very top of the viewport, above the sticky nav (z-50) and all
   page content — z-[100] is a genuine one-off (Tailwind's default scale tops
   out at z-50), matching the design's always-on-top reading-progress chrome. */
export const scrollProgressClass = "fixed inset-x-0 top-0 z-[100]";
