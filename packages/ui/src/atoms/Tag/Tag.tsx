import { colors, fonts, fontWeights, radii } from "@portfolio/tokens";

import type { TagProps } from "./Tag.types";

/**
 * Tag — a quiet metadata chip. Renders an `<li>`; place inside a `<ul>`/`<ol>`.
 */
export function Tag({ style, ...props }: TagProps) {
  return (
    <li
      style={{
        display: "inline-flex",
        alignItems: "center",
        listStyle: "none",
        fontFamily: fonts.mono,
        fontSize: "11.5px",
        fontWeight: fontWeights.medium,
        color: colors.text.secondary,
        background: "#f1eee4",
        border: `1px solid ${colors.border.default}`,
        borderRadius: radii.sm,
        padding: "4px 8px",
        ...style,
      }}
      {...props}
    />
  );
}
