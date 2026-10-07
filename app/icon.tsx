import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// "OJ" monogram — same mark as the loading screen, on the accent blue.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 14,
          background: "#2563eb",
          color: "#ffffff",
          fontSize: 30,
          fontWeight: 700,
          letterSpacing: 1,
        }}
      >
        OJ
      </div>
    ),
    size
  );
}
