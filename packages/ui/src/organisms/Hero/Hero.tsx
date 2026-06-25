import { Eyebrow, Icon, Text } from "../../atoms";
import { cn } from "../../cn";
import {
  heroActionsClass,
  heroBadgeClass,
  heroClass,
  heroContentClass,
  heroIntroClass,
  heroTabAlign,
  heroTabClass,
  heroTabFloat,
  heroTabIconClass,
  heroTabSlant,
  heroTabsClass,
  heroTitleClass,
} from "./Hero.styles";
import type { HeroProps } from "./Hero.types";

/**
 * Hero — the landing section: status badge, display heading, intro and a slot
 * for actions (left column), beside a column of floating tech tabs (right).
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
      <div className={heroContentClass}>
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
      </div>
      {tabs?.length ? (
        <ul className={heroTabsClass}>
          {tabs.map((tab, index) => (
            <li
              key={index}
              className={cn(
                heroTabClass,
                heroTabFloat[index % heroTabFloat.length],
                heroTabAlign[index % heroTabAlign.length],
                heroTabSlant[index % heroTabSlant.length],
                tab.className,
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
