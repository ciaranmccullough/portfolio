import { Eyebrow, Text } from "../../atoms";
import { cn } from "../../cn";
import {
  walkthroughPanelCalloutBodyClass,
  walkthroughPanelCalloutClass,
  walkthroughPanelCalloutLabelClass,
  walkthroughPanelClass,
  walkthroughPanelCompactHiddenClass,
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
  compact = false,
  className,
  children,
  ...props
}: WalkthroughPanelProps) {
  return (
    <article className={cn(walkthroughPanelClass, className)} {...props}>
      {index ? (
        <span
          aria-hidden="true"
          className={cn(
            walkthroughPanelIndexClass,
            compact && walkthroughPanelCompactHiddenClass,
          )}
        >
          {index}
        </span>
      ) : null}
      {eyebrow ? (
        <Eyebrow
          className={cn(
            walkthroughPanelEyebrowClass,
            compact && walkthroughPanelCompactHiddenClass,
          )}
        >
          {eyebrow}
        </Eyebrow>
      ) : null}
      {/* `variant="h1"` (not the semantic-sounding "h2") is deliberate: it's
          the type-scale tier that measures correctly against the design
          mock's panel heading — `as="h3"` still renders the correct
          semantic level regardless of which visual scale is applied. */}
      <Text as="h3" variant="h1" className={walkthroughPanelTitleClass}>
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
