import type { ElementType } from "react";

import { cn } from "../../cn";
import {
  linkBase,
  linkButtonBase,
  linkButtonPillClass,
  linkButtonSize,
  linkButtonVariant,
  linkVariant,
} from "./Link.styles";
import type { LinkProps } from "./Link.types";

/**
 * Link — the anchor atom. A styled `<a>` by default; pass `as` (e.g. the app's
 * `next/link`) to keep these styles on a routing component.
 *
 * Pass `buttonVariant` (+ optional `buttonSize`) to render a button-styled
 * pill instead — reuses `Button`'s own visual grammar rather than the plain
 * text-link `variant` styles. See `Link.types.ts`.
 */
export function Link({
  as,
  variant = "nav",
  buttonVariant,
  buttonSize = "md",
  className,
  children,
  ...props
}: LinkProps) {
  const Tag = (as ?? "a") as ElementType;
  const classes = buttonVariant
    ? cn(
        linkButtonBase,
        linkButtonVariant[buttonVariant],
        linkButtonSize[buttonSize],
        linkButtonPillClass,
        className,
      )
    : cn(linkBase, linkVariant[variant], className);

  return (
    <Tag className={classes} {...props}>
      {children}
    </Tag>
  );
}
