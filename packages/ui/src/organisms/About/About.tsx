import { Text } from "../../atoms";
import { cn } from "../../cn";
import { StatBlock } from "../../molecules";
import {
  aboutClass,
  aboutGridClass,
  aboutPortraitClass,
  aboutStatsClass,
} from "./About.styles";
import type { AboutProps } from "./About.types";

/**
 * About — portrait, biography and a stat-block grid.
 */
export function About({
  portrait,
  bio,
  stats,
  className,
  ...props
}: AboutProps) {
  return (
    <section className={cn(aboutClass, className)} {...props}>
      <div className={aboutGridClass}>
        {portrait ? <div className={aboutPortraitClass}>{portrait}</div> : null}
        <div>
          <Text variant="body">{bio}</Text>
          {stats?.length ? (
            <ul className={aboutStatsClass}>
              {stats.map((stat, index) => (
                <StatBlock key={index} value={stat.value} label={stat.label} />
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}
