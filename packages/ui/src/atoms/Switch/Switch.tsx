import { cn } from "../../cn";
import { LockIcon } from "../../icons";
import {
  switchInputClass,
  switchKnobClass,
  switchTrackBase,
  switchTrackLocked,
  switchTrackUnlocked,
  switchWrapperClass,
} from "./Switch.styles";
import type { SwitchProps } from "./Switch.types";

/**
 * Switch — an uncontrolled on/off toggle.
 *
 * Semantically a `<label>` wrapping a visually-hidden
 * `<input type="checkbox" role="switch">`; the track and knob are CSS-driven from
 * the input's `:checked` state (no React state). Uncontrolled by default: pass
 * `defaultChecked` and read the value from the DOM via `ref`. Pass `locked` for a
 * mandatory, always-on control (rendered checked + disabled with a lock glyph).
 * Give it an `aria-label`, as the switch carries no visible text of its own.
 */
export function Switch({
  locked = false,
  disabled,
  defaultChecked,
  className,
  ...props
}: SwitchProps) {
  return (
    <label className={cn(switchWrapperClass, className)}>
      <input
        {...props}
        type="checkbox"
        role="switch"
        disabled={disabled ?? locked}
        defaultChecked={locked || defaultChecked}
        className={switchInputClass}
      />
      <span
        aria-hidden="true"
        className={cn(
          switchTrackBase,
          locked ? switchTrackLocked : switchTrackUnlocked,
        )}
      />
      <span aria-hidden="true" className={switchKnobClass}>
        {locked ? <LockIcon className="size-2.5" /> : null}
      </span>
    </label>
  );
}
