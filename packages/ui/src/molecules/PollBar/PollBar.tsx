import { cn } from "../../cn";
import {
  pollBarClass,
  pollBarFillClass,
  pollBarFillDefaultClass,
  pollBarFillLeadingClass,
  pollBarLabelClass,
  pollBarLabelLeadingClass,
  pollBarLabelRowClass,
  pollBarTrackClass,
  pollBarValueClass,
} from "./PollBar.styles";
import type { PollBarProps } from "./PollBar.types";

/**
 * PollBar — a set of horizontal result bars: a label + percentage row above a
 * filled track per option (e.g. a live poll or vote result). The leading
 * option renders in the accent colour. The label/percentage text already
 * carries the full result, so the track itself is decorative
 * (`aria-hidden`) rather than a second, redundant ARIA readout. Renders a
 * `<ul>`.
 */
export function PollBar({ options, className, ...props }: PollBarProps) {
  return (
    <ul className={cn(pollBarClass, className)} {...props}>
      {options.map((option, index) => {
        const clamped = Math.min(100, Math.max(0, option.value));
        return (
          <li key={index}>
            <div className={pollBarLabelRowClass}>
              <span
                className={cn(
                  pollBarLabelClass,
                  option.leading && pollBarLabelLeadingClass,
                )}
              >
                {option.label}
              </span>
              <span className={pollBarValueClass}>{clamped}%</span>
            </div>
            <div aria-hidden="true" className={pollBarTrackClass}>
              <div
                className={cn(
                  pollBarFillClass,
                  option.leading
                    ? pollBarFillLeadingClass
                    : pollBarFillDefaultClass,
                )}
                style={{ width: `${clamped}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
