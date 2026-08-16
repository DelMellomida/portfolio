import { ImageResponse } from "next/og";

// Apple touch icons must be raster, so this renders the same glyph as icon.svg
// to a PNG at build time. Apple adds its own rounding, hence the square field.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#5561F5",
        }}
      >
        <svg width="180" height="180" viewBox="0 0 64 64" fill="none">
          <g
            stroke="#FFFFFF"
            strokeWidth="6.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          >
            <path d="M18 21 L30 32 L18 43" />
            <path d="M36 45 L47 45" />
          </g>
        </svg>
      </div>
    ),
    size,
  );
}
