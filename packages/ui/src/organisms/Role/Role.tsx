import { Eyebrow, Text } from "../../atoms";
import { cn } from "../../cn";
import {
  roleActionsClass,
  roleClass,
  roleDescriptionClass,
  roleEyebrowClass,
  rolePanelClass,
  roleTitleClass,
} from "./Role.styles";
import type { RoleProps } from "./Role.types";

/**
 * Role — the closing "what I owned" CTA: a dark card with an eyebrow,
 * heading, body copy and a slot for action buttons (e.g. a primary + a
 * `ghost-dark` pill `Button`, passed as `children`).
 */
export function Role({
  eyebrow,
  title,
  description,
  className,
  children,
  ...props
}: RoleProps) {
  return (
    <section className={cn(roleClass, className)} {...props}>
      <div className={rolePanelClass}>
        {eyebrow ? (
          <Eyebrow onDark className={roleEyebrowClass}>
            {eyebrow}
          </Eyebrow>
        ) : null}
        <Text as="h2" variant="h1" className={roleTitleClass}>
          {title}
        </Text>
        {description ? (
          <Text variant="body" className={roleDescriptionClass}>
            {description}
          </Text>
        ) : null}
        {children ? <div className={roleActionsClass}>{children}</div> : null}
      </div>
    </section>
  );
}
