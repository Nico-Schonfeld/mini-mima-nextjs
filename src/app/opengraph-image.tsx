import { ImageResponse } from "next/og";

export const alt = "MiniMima! taller de costura creativa para chicas y chicos";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f7f3ef",
          padding: 72,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            color: "#8a7d76",
            fontWeight: 600,
          }}
        >
          couture
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              fontSize: 92,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              color: "#2b2422",
              lineHeight: 1,
            }}
          >
            Mini<span style={{ color: "#d9898a" }}>Mima!</span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 32,
              color: "#6b605c",
              maxWidth: 820,
              lineHeight: 1.35,
            }}
          >
            Taller de costura creativa para chicas y chicos de 8 a 14 años.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 22,
            color: "#d9898a",
            fontWeight: 600,
          }}
        >
          Aprender a crear, no solo a coser.
        </div>
      </div>
    ),
    size
  );
}
