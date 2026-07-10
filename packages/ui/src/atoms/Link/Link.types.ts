import type { ComponentPropsWithoutRef, ElementType } from "react";

import type { ButtonSize, ButtonVariant } from "../Button/Button.types";

export type LinkVariant = "nav" | "inline" | "cta" | "primary" | "social";

/** Props for the {@link Link} atom. Extends native `<a>` attributes. */
export interface LinkProps extends ComponentPropsWithoutRef<"a"> {
  variant?: LinkVariant;
  /**
   * Render as a button-styled pill instead of the plain text-link `variant`
   * styles, reusing `Button`'s own visual grammar (variant tone + size scale)
   * on an `<a>` so it can navigate — e.g. the Role/Close card's CTAs, which
   * the design renders as two large pills, not text links. Pair with
   * `buttonSize`. When set, `variant` is ignored.
   */
  buttonVariant?: ButtonVariant;
  /**
   * Size to pair with `buttonVariant` — Button's own padding/text scale,
   * always paired with a fully-rounded pill radius (never Button's own
   * per-size corner radius). Defaults to `"md"`, matching Button's default.
   */
  buttonSize?: ButtonSize;
  /**
   * Render as a different element/component (e.g. `next/link`) while keeping the
   * Link styling. Defaults to a native `<a>`.
   */
  as?: ElementType;
}
