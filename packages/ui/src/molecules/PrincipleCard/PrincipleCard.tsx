import { Text } from "../../atoms";
import { cn } from "../../cn";
import {
  principleCardClass,
  principleCardDescriptionClass,
  principleCardIndexClass,
  principleCardIndexTone,
  principleCardTitleClass,
} from "./PrincipleCard.styles";
import type { PrincipleCardProps } from "./PrincipleCard.types";

/**
 * PrincipleCard — a neo-brutalist card: a large ordinal numeral above a title
 * and supporting description. Renders an `<li>`; place inside a list.
 */
export function PrincipleCard({
  index,
  title,
  description,
  tone = "violet",
  className,
  ...props
}: PrincipleCardProps) {
  return (
    <li className={cn(principleCardClass, className)} {...props}>
      <span
        aria-hidden="true"
        className={cn(principleCardIndexClass, principleCardIndexTone[tone])}
      >
        {index}
      </span>
      <Text as="h3" variant="h3" className={principleCardTitleClass}>
        {title}
      </Text>
      {description ? (
        <Text variant="body" className={principleCardDescriptionClass}>
          {description}
        </Text>
      ) : null}
    </li>
  );
}
