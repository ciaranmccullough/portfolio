import type { ComponentPropsWithRef } from "react";

/**
 * Props for the {@link Switch} atom — an uncontrolled on/off toggle rendered as
 * a `<label>` wrapping a visually-hidden `<input type="checkbox" role="switch">`.
 *
 * Extends native `<input>` attributes (including `ref` for React 19 uncontrolled
 * usage): pass `defaultChecked` and read the value from the DOM via `ref`. Native
 * input props (`name`, `disabled`, `onChange`, `aria-label`, `ref`, …) flow to
 * the input; `className` styles the outer track. The controlled props (`checked`,
 * `value`) are intentionally omitted — this atom is uncontrolled by design.
 */
export interface SwitchProps extends Omit<
  ComponentPropsWithRef<"input">,
  "type" | "role" | "checked" | "value"
> {
  /**
   * Locks the switch on: it renders checked, is disabled and shows a lock glyph
   * — a mandatory, always-on option that can't be turned off.
   */
  locked?: boolean;
}
