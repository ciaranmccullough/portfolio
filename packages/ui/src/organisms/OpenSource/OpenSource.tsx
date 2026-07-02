import { Eyebrow, Text } from "../../atoms";
import { cn } from "../../cn";
import {
  openSourceActionClass,
  openSourceClass,
  openSourceEyebrowClass,
  openSourceHeaderClass,
  openSourcePanelClass,
} from "./OpenSource.styles";
import type { OpenSourceProps } from "./OpenSource.types";

/**
 * OpenSource — the "in the open" section: an optional header (eyebrow + heading
 * + action) above one bordered panel of RepoRow items.
 */
export function OpenSource({
  eyebrow,
  title,
  action,
  className,
  children,
  ...props
}: OpenSourceProps) {
  return (
    <section className={cn(openSourceClass, className)} {...props}>
      {eyebrow || title || action ? (
        <div className={openSourceHeaderClass}>
          <div>
            {eyebrow ? (
              <Eyebrow className={openSourceEyebrowClass}>{eyebrow}</Eyebrow>
            ) : null}
            {title ? (
              <Text as="h2" variant="h1">
                {title}
              </Text>
            ) : null}
          </div>
          {action ? (
            <div className={openSourceActionClass}>{action}</div>
          ) : null}
        </div>
      ) : null}

      <ul className={openSourcePanelClass}>{children}</ul>
    </section>
  );
}
