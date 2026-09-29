import { ImageResponse } from "next/og";

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
          background: "#f7f3ef",
          borderRadius: 40,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 92,
            fontWeight: 700,
            color: "#d9898a",
            letterSpacing: "-0.06em",
            lineHeight: 1,
          }}
        >
          M!
        </div>
      </div>
    ),
    size
  );
}
