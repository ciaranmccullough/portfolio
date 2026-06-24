import { Eyebrow, Text } from "../../atoms";
import { cn } from "../../cn";
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
    <section
      className={cn("mx-auto max-w-5xl px-6 py-16", className)}
      {...props}
    >
      {badge ? <Eyebrow className="mb-4">{badge}</Eyebrow> : null}
      <Text variant="display" className="max-w-2xl">
        {title}
      </Text>
      {intro ? (
        <Text variant="body" className="mt-5 max-w-prose">
          {intro}
        </Text>
      ) : null}
      {children ? <div className="mt-7">{children}</div> : null}
    </section>
  );
}
