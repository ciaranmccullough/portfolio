import { Eyebrow, Text } from "../../atoms";
import { cn } from "../../cn";
import {
  aboutClass,
  aboutDescriptionClass,
  aboutEyebrowClass,
  aboutGridClass,
  aboutPortraitClass,
  aboutPortraitOffsetClass,
  aboutPortraitWrapClass,
  aboutStickerClass,
  aboutTabClass,
  aboutTabDescriptionClass,
  aboutTabsClass,
  aboutTabTitleClass,
  aboutTitleClass,
} from "./About.styles";
import type { AboutProps } from "./About.types";

/**
 * About — a two-column "who I am" section: a framed portrait beside an eyebrow,
 * heading, biography and a grid of value tabs (title + supporting line).
 */
export function About({
  eyebrow,
  title,
  description,
  portrait,
  sticker,
  tabs,
  className,
  ...props
}: AboutProps) {
  return (
    <section className={cn(aboutClass, className)} {...props}>
      <div className={aboutGridClass}>
        {portrait ? (
          <div className={aboutPortraitWrapClass}>
            <div aria-hidden="true" className={aboutPortraitOffsetClass} />
            <div className={aboutPortraitClass}>{portrait}</div>
            {sticker ? (
              <span className={aboutStickerClass}>{sticker}</span>
            ) : null}
          </div>
        ) : null}

        <div>
          {eyebrow ? (
            <Eyebrow tone="green" className={aboutEyebrowClass}>
              {eyebrow}
            </Eyebrow>
          ) : null}
          {title ? (
            <Text as="h2" variant="h1" className={aboutTitleClass}>
              {title}
            </Text>
          ) : null}
          {description ? (
            <Text variant="body" className={aboutDescriptionClass}>
              {description}
            </Text>
          ) : null}
          {tabs?.length ? (
            <ul className={aboutTabsClass}>
              {tabs.map((tab, index) => (
                <li key={index} className={aboutTabClass}>
                  <p className={aboutTabTitleClass}>{tab.title}</p>
                  <p className={aboutTabDescriptionClass}>{tab.description}</p>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}
