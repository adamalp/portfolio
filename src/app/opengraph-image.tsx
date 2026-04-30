import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "Adam Alpert — Founder, Builder, Operator. Pangea, NYC & Cambridge Founders Clubs, MIT Sloan.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "radial-gradient(120% 80% at 0% 0%, #1a1208 0%, #0a0a0c 55%, #050507 100%)",
          color: "#f5f0e6",
          fontFamily: "Inter, system-ui, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(#26262d 1px, transparent 1px), linear-gradient(90deg, #26262d 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            opacity: 0.18,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 520,
            height: 520,
            background:
              "radial-gradient(circle at 70% 30%, rgba(255,122,69,0.35), transparent 60%)",
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 22,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#7a7a85",
            fontFamily: "monospace",
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              background: "#5fe3c9",
              boxShadow: "0 0 16px #5fe3c9",
            }}
          />
          adam-alpert.com
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              fontSize: 92,
              lineHeight: 1.02,
              letterSpacing: "-0.025em",
              fontWeight: 600,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex" }}>Adam Alpert</div>
            <div
              style={{
                display: "flex",
                color: "#ff7a45",
                fontStyle: "italic",
                fontFamily: "Georgia, serif",
                fontWeight: 400,
              }}
            >
              founder · builder · operator
            </div>
          </div>
          <div
            style={{
              fontSize: 30,
              lineHeight: 1.35,
              color: "#d8d2c4",
              maxWidth: 980,
              display: "flex",
            }}
          >
            Building marketplaces, AI products, and founder communities. Pangea
            · NYC & Cambridge Founders Clubs · MIT Sloan MBA &rsquo;27.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 22,
            color: "#7a7a85",
            fontFamily: "monospace",
            letterSpacing: "0.1em",
          }}
        >
          <div style={{ display: "flex", gap: 28 }}>
            <span>PANGEA.APP</span>
            <span style={{ color: "#34343d" }}>/</span>
            <span>NYFC</span>
            <span style={{ color: "#34343d" }}>/</span>
            <span>CFC</span>
            <span style={{ color: "#34343d" }}>/</span>
            <span>MIT SLOAN</span>
          </div>
          <div style={{ display: "flex", color: "#5fe3c9" }}>↗ portfolio</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
