import { cn } from "../../cn";
import {
  phoneMockupBezelClass,
  phoneMockupClass,
  phoneMockupFallbackClass,
  phoneMockupProgressClass,
  phoneMockupProgressCounterClass,
  phoneMockupProgressLabelClass,
  phoneMockupProgressLabelRowClass,
  phoneMockupScreenClass,
  phoneMockupSegmentActiveClass,
  phoneMockupSegmentClass,
  phoneMockupSegmentsClass,
} from "./PhoneMockup.styles";
import type { PhoneMockupProps } from "./PhoneMockup.types";

/**
 * PhoneMockup — a dark device frame around a single screenshot slot, with an
 * optional step-progress row (segments + label + counter) below it. Renders a
 * graceful empty screen when no `image` is given, so a missing CMS asset
 * never breaks the layout.
 */
export function PhoneMockup({
  image,
  fallback,
  steps,
  activeStep = 0,
  className,
  ...props
}: PhoneMockupProps) {
  return (
    <div className={cn(phoneMockupClass, className)} {...props}>
      <div className={phoneMockupBezelClass}>
        <div data-phone-mockup-screen className={phoneMockupScreenClass}>
          {image ??
            (fallback ? (
              <div className={phoneMockupFallbackClass}>{fallback}</div>
            ) : null)}
        </div>
      </div>

      {steps && steps.length > 0 ? (
        <div className={phoneMockupProgressClass}>
          <ul aria-hidden="true" className={phoneMockupSegmentsClass}>
            {steps.map((step, index) => (
              <li
                key={index}
                className={cn(
                  phoneMockupSegmentClass,
                  index <= activeStep && phoneMockupSegmentActiveClass,
                )}
              />
            ))}
          </ul>
          <div className={phoneMockupProgressLabelRowClass}>
            {steps[activeStep] ? (
              <span className={phoneMockupProgressLabelClass}>
                {steps[activeStep].label}
              </span>
            ) : null}
            <span className={phoneMockupProgressCounterClass}>
              {String(activeStep + 1).padStart(2, "0")} /{" "}
              {String(steps.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
