import { ImageResponse } from "next/og";

// Next.js uses this file convention to generate the og:image (and, via the
// twitter metadata, the Twitter card image) at /opengraph-image.
export const alt = "Kaushal Patel — Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#0f0f11",
          padding: "80px",
          color: "#f0f0f0",
        }}
      >
        <div
          style={{
            display: "flex",
            color: "#60a5fa",
            fontSize: 28,
            letterSpacing: 8,
            marginBottom: 28,
          }}
        >
          PORTFOLIO
        </div>
        <div style={{ display: "flex", fontSize: 96, fontWeight: 700 }}>
          Kaushal Patel
        </div>
        <div style={{ display: "flex", fontSize: 42, color: "#888888", marginTop: 24 }}>
          Software Engineer | AI/ML & Full Stack
        </div>
        <div
          style={{
            display: "flex",
            width: 120,
            height: 8,
            backgroundColor: "#60a5fa",
            borderRadius: 4,
            marginTop: 48,
          }}
        />
      </div>
    ),
    { ...size },
  );
}
