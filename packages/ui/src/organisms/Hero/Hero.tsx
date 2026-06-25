import { Eyebrow, Icon, Text } from "../../atoms";
import { cn } from "../../cn";
import {
  heroActionsClass,
  heroBadgeClass,
  heroClass,
  heroIntroClass,
  heroTabClass,
  heroTabFloat,
  heroTabIconClass,
  heroTabsClass,
  heroTitleClass,
} from "./Hero.styles";
import type { HeroProps } from "./Hero.types";

/**
 * Hero — the landing section: status badge, display heading, intro, a slot for
 * actions (e.g. a CtaGroup) and a row of floating tech tabs.
 */
export function Hero({
  badge,
  title,
  intro,
  tabs,
  className,
  children,
  ...props
}: HeroProps) {
  return (
    <section className={cn(heroClass, className)} {...props}>
      {badge ? <Eyebrow className={heroBadgeClass}>{badge}</Eyebrow> : null}
      <Text variant="display" className={heroTitleClass}>
        {title}
      </Text>
      {intro ? (
        <Text variant="body" className={heroIntroClass}>
          {intro}
        </Text>
      ) : null}
      {children ? <div className={heroActionsClass}>{children}</div> : null}
      {tabs?.length ? (
        <ul className={heroTabsClass}>
          {tabs.map((tab, index) => (
            <li
              key={index}
              className={cn(
                heroTabClass,
                heroTabFloat[index % heroTabFloat.length],
              )}
            >
              <Icon className={heroTabIconClass}>{tab.icon}</Icon>
              {tab.title}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
