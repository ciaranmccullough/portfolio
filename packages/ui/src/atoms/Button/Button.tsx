import type { CSSProperties } from "react";

import { colors, fonts, fontWeights, radii } from "@portfolio/tokens";

import type { ButtonProps, ButtonSize, ButtonVariant } from "./Button.types";

const variantStyle: Record<ButtonVariant, CSSProperties> = {
  primary: {
    background: colors.brand.violet,
    color: "#ffffff",
    border: "none",
  },
  dark: { background: colors.ink, color: colors.text.inverse, border: "none" },
  ghost: {
    background: "transparent",
    color: colors.ink,
    border: `1px solid ${colors.border.strong}`,
  },
};

const sizeStyle: Record<ButtonSize, CSSProperties> = {
  sm: { fontSize: "12.5px", padding: "7px 13px", borderRadius: "9px" },
  md: { fontSize: "14px", padding: "11px 18px", borderRadius: radii.lg },
  lg: { fontSize: "15.5px", padding: "14px 24px", borderRadius: "14px" },
};

/**
 * Button — the action atom. One `<button>`, three variants across three sizes.
 * Defaults to `type="button"` so it never submits a form by accident.
 */
export function Button({
  variant = "primary",
  size = "md",
  type = "button",
  style,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      style={{
        fontFamily: fonts.body,
        fontWeight: fontWeights.semibold,
        cursor: "pointer",
        ...variantStyle[variant],
        ...sizeStyle[size],
        ...style,
      }}
      {...props}
    />
  );
}
