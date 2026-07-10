/* Fixed, full-width, 3px tall; `origin-left` so the scaleX transform grows
   from the left edge as `progress` increases. `z-[100]` keeps it above all
   page content, including the Navbar. */
export const scrollProgressBarClass =
  "fixed inset-x-0 top-0 z-[100] h-[3px] origin-left bg-brand-violet";
