import { ImageResponse } from "next/og";

export const alt = "Mapulengua — Viaje por Chile";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #faf5ee 0%, #f0e0c8 100%)",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative background shapes */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(200, 84, 42, 0.08)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            left: -60,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(200, 84, 42, 0.06)",
            display: "flex",
          }}
        />

        {/* Map pin dots */}
        {[
          { top: 80, left: 120 },
          { top: 200, left: 980 },
          { top: 480, left: 200 },
          { top: 360, left: 1050 },
        ].map((pos, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: pos.top,
              left: pos.left,
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: "rgba(200, 84, 42, 0.25)",
              display: "flex",
            }}
          />
        ))}

        {/* Pudu emoji */}
        <div style={{ fontSize: 130, marginBottom: 24, display: "flex" }}>
          🦌
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 88,
            fontWeight: "900",
            color: "#c8542a",
            letterSpacing: "-2px",
            display: "flex",
          }}
        >
          Mapulengua
        </div>

        {/* Divider */}
        <div
          style={{
            width: 80,
            height: 4,
            borderRadius: 2,
            background: "#c8542a",
            margin: "20px 0",
            opacity: 0.4,
            display: "flex",
          }}
        />

        {/* Tagline */}
        <div
          style={{
            fontSize: 34,
            color: "#6b4c3b",
            fontWeight: "600",
            display: "flex",
          }}
        >
          Viaja por Chile · Aprende Mapudungun
        </div>

        {/* Region chips */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 36,
            flexWrap: "nowrap",
          }}
        >
          {["Arica", "Temuco", "Chiloé", "Aysén", "Magallanes"].map((r) => (
            <div
              key={r}
              style={{
                padding: "8px 20px",
                borderRadius: 100,
                background: "rgba(200, 84, 42, 0.12)",
                color: "#c8542a",
                fontSize: 22,
                fontWeight: "700",
                display: "flex",
              }}
            >
              {r}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
