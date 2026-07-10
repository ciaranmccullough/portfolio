import { Eyebrow, Text } from "../../atoms";
import { cn } from "../../cn";
import {
  walkthroughPanelCalloutBodyClass,
  walkthroughPanelCalloutClass,
  walkthroughPanelCalloutLabelClass,
  walkthroughPanelClass,
  walkthroughPanelDescriptionClass,
  walkthroughPanelEyebrowClass,
  walkthroughPanelExtraClass,
  walkthroughPanelIndexClass,
  walkthroughPanelTitleClass,
} from "./WalkthroughPanel.styles";
import type { WalkthroughPanelProps } from "./WalkthroughPanel.types";

/**
 * WalkthroughPanel — one step of a scroll-driven showreel: a large outline
 * numeral, a mono eyebrow, a heading, body copy, an optional labelled
 * callout, and a slot for extra content (e.g. a `PollBar`). Renders an
 * `<article>`; several panels are typically stacked inside the `Walkthrough`
 * organism.
 */
export function WalkthroughPanel({
  index,
  eyebrow,
  title,
  description,
  callout,
  className,
  children,
  ...props
}: WalkthroughPanelProps) {
  return (
    <article className={cn(walkthroughPanelClass, className)} {...props}>
      {index ? (
        <span aria-hidden="true" className={walkthroughPanelIndexClass}>
          {index}
        </span>
      ) : null}
      {eyebrow ? (
        <Eyebrow className={walkthroughPanelEyebrowClass}>{eyebrow}</Eyebrow>
      ) : null}
      <Text as="h3" variant="h2" className={walkthroughPanelTitleClass}>
        {title}
      </Text>
      {description ? (
        <Text variant="body" className={walkthroughPanelDescriptionClass}>
          {description}
        </Text>
      ) : null}
      {callout ? (
        <p className={walkthroughPanelCalloutClass}>
          <span className={walkthroughPanelCalloutLabelClass}>
            {callout.label}
          </span>{" "}
          <span className={walkthroughPanelCalloutBodyClass}>
            {callout.body}
          </span>
        </p>
      ) : null}
      {children ? (
        <div className={walkthroughPanelExtraClass}>{children}</div>
      ) : null}
    </article>
  );
}
