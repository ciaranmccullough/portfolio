import { Eyebrow, Text } from "../../atoms";
import { cn } from "../../cn";
import { PhoneMockup, WalkthroughPanel } from "../../molecules";
import {
  walkthroughClass,
  walkthroughEyebrowClass,
  walkthroughGridClass,
  walkthroughHeaderClass,
  walkthroughPanelsClass,
  walkthroughPhoneColClass,
} from "./Walkthrough.styles";
import type { WalkthroughProps } from "./Walkthrough.types";

/**
 * Walkthrough — the pinned showreel section: a phone mockup beside a series
 * of step panels.
 *
 * Renders statically with every panel visible in normal document flow — this
 * is also the no-JS/reduced-motion fallback (per design-spec E, which shows
 * the source design has an equivalent "just reveal everything, no animation"
 * path). The phone column uses CSS `position: sticky` (no JS, no hooks) so it
 * naturally tracks alongside the panels as the page scrolls. A client wrapper
 * added later in the consuming app can layer scroll-driven pinning/cross-fade
 * on top by targeting each panel's `[data-walkthrough-panel]` /
 * `data-walkthrough-panel-index` attributes and the phone's
 * `[data-phone-mockup-screen]` hook, without needing to change this markup.
 */
export function Walkthrough({
  eyebrow,
  title,
  items,
  imageFallback,
  className,
  ...props
}: WalkthroughProps) {
  return (
    <section className={cn(walkthroughClass, className)} {...props}>
      {eyebrow || title ? (
        <div className={walkthroughHeaderClass}>
          {eyebrow ? (
            <Eyebrow className={walkthroughEyebrowClass}>{eyebrow}</Eyebrow>
          ) : null}
          {title ? (
            <Text as="h2" variant="h1">
              {title}
            </Text>
          ) : null}
        </div>
      ) : null}

      <div className={walkthroughGridClass}>
        <div className={walkthroughPhoneColClass}>
          <PhoneMockup
            image={items[0]?.image}
            fallback={imageFallback}
            steps={items.map((item) => ({ label: item.eyebrow }))}
            activeStep={0}
          />
        </div>

        <ol className={walkthroughPanelsClass}>
          {items.map((item, index) => (
            <li key={index}>
              <WalkthroughPanel
                index={String(index + 1).padStart(2, "0")}
                eyebrow={item.eyebrow}
                title={item.title}
                description={item.description}
                callout={item.callout}
                data-walkthrough-panel=""
                data-walkthrough-panel-index={index}
              >
                {item.extra}
              </WalkthroughPanel>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
