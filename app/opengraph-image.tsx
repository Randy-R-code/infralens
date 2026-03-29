import { readFileSync } from "fs";
import { ImageResponse } from "next/og";
import { join } from "path";

export const runtime = "nodejs";
export const alt = "InfraLens — Website inspection tool";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const checks = [
  { label: "HTTPS & TLS 1.3", status: "ok" },
  { label: "Security headers (CSP, HSTS…)", status: "ok" },
  { label: "DNS records (A, MX, NS, TXT)", status: "ok" },
  { label: "DNSSEC validation", status: "warn" },
  { label: "WAF / CDN detected", status: "ok" },
  { label: "DMARC policy", status: "error" },
  { label: "robots.txt & sitemap", status: "ok" },
  { label: "Compression (gzip / br)", status: "ok" },
];

const STATUS = {
  ok: {
    color: "#34d399",
    bg: "rgba(52,211,153,0.08)",
    border: "rgba(52,211,153,0.2)",
  },
  warn: {
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.08)",
    border: "rgba(251,191,36,0.2)",
  },
  error: {
    color: "#f87171",
    bg: "rgba(248,113,113,0.08)",
    border: "rgba(248,113,113,0.2)",
  },
} as const;

export default async function OgImage() {
  const fontBold = readFileSync(
    join(process.cwd(), "public/fonts/Geist-Bold.otf"),
  );
  const fontSemiBold = readFileSync(
    join(process.cwd(), "public/fonts/Geist-SemiBold.otf"),
  );

  return new ImageResponse(
    <div
      style={{
        background: "#09090b",
        width: "100%",
        height: "100%",
        display: "flex",
        fontFamily: "Geist",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle blue glow — top-left */}
      <div
        style={{
          position: "absolute",
          top: -120,
          left: -80,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)",
          display: "flex",
        }}
      />
      {/* Subtle blue glow — bottom-right */}
      <div
        style={{
          position: "absolute",
          bottom: -100,
          right: 300,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)",
          display: "flex",
        }}
      />

      {/* ── LEFT SECTION ─────────────────────────────── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 52px 56px 72px",
          width: 520,
          flexShrink: 0,
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {/* Logo mark + name */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 32,
            }}
          >
            {/* Lens icon */}
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                border: "2.5px solid #3b82f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: 13,
                  height: 13,
                  borderRadius: "50%",
                  background: "#3b82f6",
                  display: "flex",
                }}
              />
            </div>
            <span
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "#71717a",
                letterSpacing: "0.02em",
              }}
            >
              InfraLens
            </span>
          </div>

          {/* Headline */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <span
              style={{
                fontSize: 54,
                fontWeight: 700,
                color: "#fafafa",
                letterSpacing: "-0.03em",
                lineHeight: 1.08,
              }}
            >
              Inspect any
            </span>
            <span
              style={{
                fontSize: 54,
                fontWeight: 700,
                color: "#fafafa",
                letterSpacing: "-0.03em",
                lineHeight: 1.08,
              }}
            >
              website&apos;s
            </span>
            <span
              style={{
                fontSize: 54,
                fontWeight: 700,
                color: "#3b82f6",
                letterSpacing: "-0.03em",
                lineHeight: 1.08,
              }}
            >
              infrastructure.
            </span>
          </div>
        </div>

        {/* Footer area */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div
            style={{
              width: 40,
              height: 2,
              background: "#3b82f6",
              display: "flex",
            }}
          />

          {/* Category pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {["DNS", "HTTP", "TLS", "Security", "CDN", "Performance"].map(
              (cat) => (
                <span
                  key={cat}
                  style={{
                    padding: "4px 13px",
                    borderRadius: 20,
                    border: "1px solid #27272a",
                    background: "#18181b",
                    color: "#a1a1aa",
                    fontSize: 13,
                    fontWeight: 600,
                    display: "flex",
                  }}
                >
                  {cat}
                </span>
              ),
            )}
          </div>

          <span style={{ fontSize: 13, color: "#3f3f46", fontWeight: 600 }}>
            Built for developers · Open source · Free
          </span>
        </div>
      </div>

      {/* Vertical divider */}
      <div
        style={{
          width: 1,
          background: "#1c1c1f",
          margin: "48px 0",
          display: "flex",
          flexShrink: 0,
        }}
      />

      {/* ── RIGHT SECTION ────────────────────────────── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "48px 68px 48px 44px",
          gap: 12,
        }}
      >
        {/* URL bar with score */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "#18181b",
            border: "1px solid #27272a",
            borderRadius: 8,
            padding: "10px 14px",
            marginBottom: 4,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#34d399",
              display: "flex",
              flexShrink: 0,
            }}
          />
          <span
            style={{ color: "#52525b", fontSize: 13, fontWeight: 600, flex: 1 }}
          >
            example.com
          </span>
          {/* Score badge */}
          <div
            style={{
              background: "rgba(52,211,153,0.1)",
              border: "1px solid rgba(52,211,153,0.25)",
              borderRadius: 6,
              padding: "3px 12px",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span style={{ fontSize: 20, fontWeight: 700, color: "#34d399" }}>
              A
            </span>
            <span style={{ fontSize: 12, color: "#34d399", opacity: 0.75 }}>
              87 / 100
            </span>
          </div>
        </div>

        {/* Check rows */}
        {checks.map((check, i) => {
          const s = STATUS[check.status as keyof typeof STATUS];
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: s.bg,
                border: `1px solid ${s.border}`,
                borderRadius: 6,
                padding: "8px 13px",
              }}
            >
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: s.color,
                  flexShrink: 0,
                  display: "flex",
                }}
              />
              <span style={{ fontSize: 13, color: "#d4d4d8", fontWeight: 600 }}>
                {check.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Geist", data: fontBold, weight: 700 },
        { name: "Geist", data: fontSemiBold, weight: 600 },
      ],
    },
  );
}
