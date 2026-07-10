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
  reflectionTitleClass,
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
            <h3
              className={cn(
                reflectionTitleClass,
                item.accent && reflectionTitleAccentClass,
              )}
            >
              {item.title}
            </h3>
            {item.description ? (
              <p className={reflectionDescriptionClass}>{item.description}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
