import { ImageResponse } from "next/og";

import { SITE_NAME, SITE_URL } from "@/site-config";

/**
 * Branded social share card (Open Graph + Twitter fall back to it). Generated at
 * build via Satori — uses the default font for build robustness (no external
 * font fetch) and the brand violet palette.
 */
export const alt = `${SITE_NAME} — Software Engineer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px",
        background: "linear-gradient(135deg, #6a47ff 0%, #5a3df0 100%)",
        color: "#ffffff",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 96,
            height: 96,
            borderRadius: 22,
            background: "rgba(255,255,255,0.16)",
            fontSize: 56,
            fontWeight: 700,
          }}
        >
          {">_"}
        </div>
        <div style={{ display: "flex", fontSize: 28, opacity: 0.85 }}>
          {SITE_URL.replace("https://", "")}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            fontSize: 92,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
          }}
        >
          {SITE_NAME}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 38,
            marginTop: 18,
            opacity: 0.92,
          }}
        >
          Software Engineer · Frontend · Android · Full-stack
        </div>
      </div>
    </div>,
    { ...size },
  );
}
