import { Eyebrow, Text } from "../../atoms";
import { cn } from "../../cn";
import {
  heroActionsClass,
  heroBadgeClass,
  heroClass,
  heroIntroClass,
  heroTitleClass,
} from "./Hero.styles";
import type { HeroProps } from "./Hero.types";

/**
 * Hero — the landing section: status badge, display heading, intro and a slot
 * for actions (e.g. a CtaGroup).
 */
export function Hero({
  badge,
  title,
  intro,
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
    </section>
  );
}
