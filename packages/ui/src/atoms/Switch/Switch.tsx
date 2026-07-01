import { cn } from "../../cn";
import { LockIcon } from "../../icons";
import {
  switchKnob,
  switchKnobOff,
  switchKnobOn,
  switchTrackBase,
  switchTrackState,
  type SwitchState,
} from "./Switch.styles";
import type { SwitchProps } from "./Switch.types";

/**
 * Switch — an on/off toggle rendered as a `<button role="switch">`.
 *
 * Controlled: pass `checked` and handle `onCheckedChange`. Pass `locked` for a
 * mandatory, always-on control — it reads as checked, shows a lock glyph and is
 * non-interactive. Give it an `aria-label`, as the switch carries no visible
 * text of its own.
 */
export function Switch({
  checked,
  onCheckedChange,
  locked = false,
  disabled,
  className,
  ...props
}: SwitchProps) {
  const on = locked || checked;
  const state: SwitchState = locked ? "locked" : on ? "on" : "off";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      disabled={disabled ?? locked}
      onClick={onCheckedChange ? () => onCheckedChange(!checked) : undefined}
      className={cn(switchTrackBase, switchTrackState[state], className)}
      {...props}
    >
      <span className={cn(switchKnob, on ? switchKnobOn : switchKnobOff)}>
        {locked ? <LockIcon className="size-2.5" /> : null}
      </span>
    </button>
  );
}
