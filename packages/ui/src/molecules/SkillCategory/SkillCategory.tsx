import { colors, fonts, fontWeights, radii } from "@portfolio/tokens";

import type { SkillCategoryProps } from "./SkillCategory.types";

/**
 * SkillCategory — a titled, tinted card grouping related skill items. The
 * heading names the group; the items live in a `<ul>`.
 */
export function SkillCategory({
  title,
  children,
  style,
  ...props
}: SkillCategoryProps) {
  return (
    <section
      style={{
        background: colors.tint.violet,
        border: `1px solid ${colors.border.default}`,
        borderRadius: radii.xl,
        padding: "16px",
        ...style,
      }}
      {...props}
    >
      <h3
        style={{
          display: "flex",
          alignItems: "center",
          gap: "9px",
          margin: "0 0 12px",
          fontFamily: fonts.heading,
          fontWeight: fontWeights.bold,
          fontSize: "16px",
          color: colors.brand.violet,
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: "11px",
            height: "11px",
            borderRadius: "50%",
            background: colors.brand.violet,
          }}
        />
        {title}
      </h3>
      <ul
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "7px",
          listStyle: "none",
          margin: 0,
          padding: 0,
        }}
      >
        {children}
      </ul>
    </section>
  );
}
