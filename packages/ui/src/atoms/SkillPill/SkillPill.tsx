import { colors, fonts, fontWeights, radii, shadows } from "@portfolio/tokens";

import type { SkillPillProps, SkillPillTone } from "./SkillPill.types";

const toneBg: Record<SkillPillTone, string> = {
  android: colors.accent.android,
  react: colors.accent.react,
  violet: colors.brand.violet,
  orange: colors.brand.orange,
  green: colors.brand.green,
};

/**
 * SkillPill — a brand-coloured, neobrutalist chip (glyph + label, hard shadow).
 * Renders an `<li>`; place inside a `<ul>`.
 */
export function SkillPill({
  tone = "android",
  icon,
  style,
  children,
  ...props
}: SkillPillProps) {
  return (
    <li
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        listStyle: "none",
        background: toneBg[tone],
        color: colors.ink,
        border: `1.5px solid ${colors.ink}`,
        borderRadius: radii.lg,
        padding: "8px 13px",
        fontFamily: fonts.mono,
        fontWeight: fontWeights.bold,
        fontSize: "13px",
        boxShadow: shadows.brutal,
        ...style,
      }}
      {...props}
    >
      {icon}
      {children}
    </li>
  );
}
