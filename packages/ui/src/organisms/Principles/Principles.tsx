import { Eyebrow, Text } from "../../atoms";
import { cn } from "../../cn";
import { PrincipleCard } from "../../molecules";
import {
  principlesClass,
  principlesEyebrowClass,
  principlesGridClass,
  principlesHeaderClass,
  principlesTitleClass,
  principlesToneCycle,
} from "./Principles.styles";
import type { PrinciplesProps } from "./Principles.types";

/**
 * Principles — the "what held it together" section: an optional header
 * (eyebrow + heading) above a numbered grid of PrincipleCards. The card index
 * and accent tone are derived from position, cycling violet/orange/green.
 */
export function Principles({
  eyebrow,
  title,
  principles,
  className,
  ...props
}: PrinciplesProps) {
  return (
    <section className={cn(principlesClass, className)} {...props}>
      {eyebrow || title ? (
        <div className={principlesHeaderClass}>
          {eyebrow ? (
            <Eyebrow className={principlesEyebrowClass}>{eyebrow}</Eyebrow>
          ) : null}
          {title ? (
            <Text as="h2" variant="h1" className={principlesTitleClass}>
              {title}
            </Text>
          ) : null}
        </div>
      ) : null}

      <ol className={principlesGridClass}>
        {principles.map((principle, index) => (
          <PrincipleCard
            key={index}
            index={String(index + 1).padStart(2, "0")}
            title={principle.title}
            description={principle.description}
            tone={principlesToneCycle[index % principlesToneCycle.length]}
          />
        ))}
      </ol>
    </section>
  );
}
