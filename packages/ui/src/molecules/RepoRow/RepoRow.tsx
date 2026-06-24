import { colors, fonts, fontWeights, radii } from "@portfolio/tokens";

import type { RepoRowProps } from "./RepoRow.types";

/**
 * RepoRow — a repository link: status dot, name and star count in one anchor.
 * Renders an `<li>`; place inside a `<ul>`.
 */
export function RepoRow({ name, href, stars, style, ...props }: RepoRowProps) {
  return (
    <li style={{ listStyle: "none", ...style }} {...props}>
      <a
        href={href}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          background: colors.card,
          border: `1px solid ${colors.border.default}`,
          borderRadius: radii.md,
          padding: "12px 14px",
          textDecoration: "none",
          color: colors.text.primary,
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: "9px",
            height: "9px",
            borderRadius: "50%",
            background: colors.brand.violet,
            flex: "none",
          }}
        />
        <span
          style={{
            fontFamily: fonts.mono,
            fontWeight: fontWeights.bold,
            fontSize: "13.5px",
          }}
        >
          {name}
        </span>
        {stars != null ? (
          <span
            style={{
              marginLeft: "auto",
              fontSize: "13px",
              fontWeight: fontWeights.semibold,
              color: colors.text.secondary,
            }}
          >
            <span aria-hidden="true">★ </span>
            {stars}
          </span>
        ) : null}
      </a>
    </li>
  );
}
