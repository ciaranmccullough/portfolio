import { Eyebrow, Text } from "../../atoms";
import { cn } from "../../cn";
import {
  reflectionClass,
  reflectionDescriptionClass,
  reflectionEyebrowClass,
  reflectionGridClass,
  reflectionHeaderClass,
  reflectionItemClass,
  reflectionTitleAccentClass,
} from "./Reflection.styles";
import type { ReflectionProps } from "./Reflection.types";

/**
 * Reflection — the "what it taught me" section: an optional header (eyebrow +
 * heading) above a grid of bordered takeaway cards.
 */
export function Reflection({
  eyebrow,
  title,
  reflections,
  className,
  ...props
}: ReflectionProps) {
  return (
    <section className={cn(reflectionClass, className)} {...props}>
      {eyebrow || title ? (
        <div className={reflectionHeaderClass}>
          {eyebrow ? (
            <Eyebrow className={reflectionEyebrowClass}>{eyebrow}</Eyebrow>
          ) : null}
          {title ? (
            <Text as="h2" variant="h1">
              {title}
            </Text>
          ) : null}
        </div>
      ) : null}

      <ul className={reflectionGridClass}>
        {reflections.map((item, index) => (
          <li key={index} className={reflectionItemClass}>
            <Text
              as="h3"
              variant="h3"
              className={cn(item.accent && reflectionTitleAccentClass)}
            >
              {item.title}
            </Text>
            {item.description ? (
              <Text variant="body" className={reflectionDescriptionClass}>
                {item.description}
              </Text>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
