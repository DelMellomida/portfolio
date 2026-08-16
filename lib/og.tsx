import { ImageResponse } from "next/og";
import { site } from "./site";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/**
 * Shared social card. This is what fixes the blank LinkedIn/Slack unfurl —
 * the old site had no OG image at all.
 *
 * Note: next/og runs in a constrained runtime, so these styles are plain
 * inline CSS (a flex subset), not Tailwind.
 */
export function ogImage({
  title,
  eyebrow,
  footer,
}: {
  title: string;
  eyebrow?: string;
  footer?: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0d0f14",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Accent rule */}
        <div style={{ display: "flex", width: "120px", height: "6px", background: "#7c86ff" }} />

        <div style={{ display: "flex", flexDirection: "column" }}>
          {eyebrow && (
            <div
              style={{
                display: "flex",
                fontSize: 24,
                color: "#7c86ff",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: "20px",
              }}
            >
              {eyebrow}
            </div>
          )}
          <div
            style={{
              display: "flex",
              fontSize: title.length > 60 ? 60 : 74,
              color: "#f2f4f8",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              maxWidth: "1000px",
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 26,
            color: "#9aa3b2",
          }}
        >
          <div style={{ display: "flex" }}>{site.name}</div>
          <div style={{ display: "flex" }}>{footer ?? site.url.replace(/^https?:\/\//, "")}</div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
