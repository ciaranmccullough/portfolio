import type { ComponentPropsWithoutRef } from "react";

/**
 * Props for the {@link Switch} atom — a toggle rendered as a
 * `<button role="switch">`. Controlled: drive it with `checked` and respond to
 * `onCheckedChange`. Extends native `<button>` attributes (minus `onChange`).
 */
export interface SwitchProps extends Omit<
  ComponentPropsWithoutRef<"button">,
  "onChange"
> {
  /** Whether the switch is on. */
  checked: boolean;
  /** Called with the next value when the user toggles the switch. */
  onCheckedChange?: (checked: boolean) => void;
  /**
   * Locks the switch on: it reads as checked, shows a lock glyph in the knob and
   * is non-interactive (e.g. a mandatory, always-on option).
   */
  locked?: boolean;
}
