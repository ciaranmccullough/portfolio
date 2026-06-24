import { colors, fonts, radii } from "@portfolio/tokens";

import type { InputProps } from "./Input.types";

/**
 * Input — uncontrolled text-field atom (dark surface, violet border).
 *
 * Pass a `ref` and `defaultValue` and read the value from the DOM. The native
 * focus outline is preserved for keyboard accessibility.
 */
export function Input({ style, ...props }: InputProps) {
  return (
    <input
      style={{
        width: "100%",
        background: colors.inkSoft,
        border: `1px solid ${colors.brand.violet}`,
        borderRadius: radii.lg,
        padding: "13px 14px",
        color: colors.text.inverse,
        fontFamily: fonts.body,
        fontSize: "15px",
        ...style,
      }}
      {...props}
    />
  );
}
