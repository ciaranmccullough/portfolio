import { colors, fonts, fontWeights, radii } from "@portfolio/tokens";

import type { StatBlockProps } from "./StatBlock.types";

/**
 * StatBlock — a number paired with a label. Renders an `<li>`; place in a list.
 */
export function StatBlock({ value, label, style, ...props }: StatBlockProps) {
  return (
    <li
      style={{
        listStyle: "none",
        background: colors.card,
        border: `1px solid ${colors.border.default}`,
        borderRadius: radii.xl,
        padding: "15px 16px",
        ...style,
      }}
      {...props}
    >
      <strong
        style={{
          display: "block",
          fontFamily: fonts.heading,
          fontWeight: fontWeights.extrabold,
          fontSize: "26px",
          letterSpacing: "-0.02em",
          color: colors.text.primary,
        }}
      >
        {value}
      </strong>
      <span
        style={{
          display: "block",
          marginTop: "2px",
          fontFamily: fonts.body,
          fontSize: "13px",
          color: colors.text.muted,
        }}
      >
        {label}
      </span>
    </li>
  );
}
