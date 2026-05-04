import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "star-rating-x — Changelog",
};

// ─── Types ────────────────────────────────────────────────────────────────────
type ChangeType = "new" | "fix" | "improve" | "break";

interface Change {
  type: ChangeType;
  text: string;
}

interface Release {
  version: string;
  date: string;
  tag?: string;
  tagColor?: string;
  summary: string;
  changes: Change[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const RELEASES: Release[] = [
  {
    version: "2.0.0",
    date: "2025-05-05",
    tag: "Latest",
    tagColor: "#a78bfa",
    summary:
      "Major release introducing 4 powerful new features: Emoji/character mode, custom SVG icons, mount animation, and group rating.",
    changes: [
      {
        type: "new",
        text: "character prop — use any emoji, text, or render function instead of SVG icons",
      },
      {
        type: "new",
        text: "customIcon prop — pass a custom SVG path string or full render function",
      },
      {
        type: "new",
        text: "mountAnimation + mountDuration props — count-up fill animation on first render",
      },
      {
        type: "new",
        text: "RatingGroup component — rate multiple categories with auto overall average",
      },
      {
        type: "new",
        text: "IconRenderContext and CharacterRenderContext TypeScript interfaces exported",
      },
      {
        type: "improve",
        text: "Full TypeScript rewrite — forwardRef properly typed with generics",
      },
      {
        type: "improve",
        text: "All implicit any parameters annotated — zero TS errors on strict mode",
      },
      {
        type: "improve",
        text: "RatingGroup forwards all StarRating props via spread",
      },
      {
        type: "fix",
        text: "forwardRef generic type mismatch (RefObject<unknown> vs HTMLSpanElement)",
      },
      {
        type: "fix",
        text: "THEMES record type prevents implicit any index signature errors",
      },
    ],
  },
  {
    version: "1.0.1",
    date: "2025-05-04",
    tag: "Patch",
    tagColor: "#34d399",
    summary: "Added all npm metadata links and bumped version for re-publish.",
    changes: [
      {
        type: "new",
        text: "author.url — LinkedIn profile linked from npm package page",
      },
      {
        type: "new",
        text: "homepage — links to live demo at star-rating-x-demo.vercel.app",
      },
      { type: "new", text: "bugs.url — GitHub issues linked from npm" },
      { type: "new", text: "funding — LinkedIn URL in Fund button on npm" },
      {
        type: "improve",
        text: "package.json author field upgraded from string to object",
      },
    ],
  },
  {
    version: "1.0.0",
    date: "2025-05-03",
    tag: "Initial",
    tagColor: "#60a5fa",
    summary:
      "First public release of star-rating-x — a fully-featured, accessible React rating component.",
    changes: [
      {
        type: "new",
        text: "StarRating component with controlled and uncontrolled modes",
      },
      {
        type: "new",
        text: "9 built-in colour themes: gold, fire, ocean, neon, rose, mono, violet, sunset, mint",
      },
      {
        type: "new",
        text: "8 icon shapes: star, heart, circle, diamond, thumb, flag, lightning, flower",
      },
      { type: "new", text: "4 click animations: bounce, pulse, wiggle, pop" },
      { type: "new", text: "Half-star precision via precision={0.5}" },
      { type: "new", text: "Full keyboard navigation: ← → ↑ ↓ Home End" },
      { type: "new", text: "ARIA role=slider with aria-valuemin/max/now/text" },
      { type: "new", text: "RTL layout support via direction prop" },
      {
        type: "new",
        text: "Custom colour overrides: filledColor, emptyColor, strokeColor",
      },
      { type: "new", text: "showValue prop to display numeric label" },
      { type: "new", text: "tooltips prop — custom label per star" },
      { type: "new", text: "allowClear prop — re-click to reset to 0" },
      {
        type: "new",
        text: "highlightSelected prop — focus ring on selected star",
      },
      { type: "new", text: "disabled and readOnly states" },
      { type: "new", text: "useRating hook for external state management" },
      { type: "new", text: "Full TypeScript declarations (.d.ts)" },
      { type: "new", text: "Built with Rollup — ESM + CJS dual output" },
      {
        type: "new",
        text: "Zero runtime dependencies — only React as peer dep",
      },
    ],
  },
];

// ─── Change type config ────────────────────────────────────────────────────────
const TYPE_CONFIG: Record<
  ChangeType,
  { label: string; color: string; bg: string }
> = {
  new: { label: "New", color: "#34d399", bg: "#34d39918" },
  fix: { label: "Fix", color: "#f87171", bg: "#f8717118" },
  improve: { label: "Improve", color: "#60a5fa", bg: "#60a5fa18" },
  break: { label: "Breaking", color: "#fbbf24", bg: "#fbbf2418" },
};

// ─── Component ─────────────────────────────────────────────────────────────────
export default function ChangelogPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#080c14" }}>
      {/* Header */}
      <div
        style={{
          borderBottom: "1px solid #1e293b",
          padding: "56px 24px 48px",
          textAlign: "center",
          background: "linear-gradient(180deg,#0f172a 0%,#080c14 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 500,
            height: 200,
            background: "radial-gradient(ellipse,#7c3aed18,transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative" }}>
          <p
            style={{
              margin: "0 0 8px",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#64748b",
            }}
          >
            Release History
          </p>
          <h1
            style={{
              margin: "0 0 12px",
              fontSize: 40,
              fontWeight: 900,
              color: "#f1f5f9",
            }}
          >
            Changelog
          </h1>
          <p style={{ margin: 0, color: "#64748b", fontSize: 15 }}>
            All notable changes to{" "}
            <span style={{ color: "#a78bfa", fontWeight: 600 }}>
              star-rating-x
            </span>{" "}
            are documented here.
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div
        style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 80px" }}
      >
        {RELEASES.map((release, idx) => (
          <div
            key={release.version}
            style={{
              display: "flex",
              gap: 24,
              marginBottom: idx < RELEASES.length - 1 ? 48 : 0,
              position: "relative",
            }}
          >
            {/* timeline line */}
            {idx < RELEASES.length - 1 && (
              <div
                style={{
                  position: "absolute",
                  left: 19,
                  top: 40,
                  bottom: -48,
                  width: 1,
                  background: "linear-gradient(to bottom,#334155,transparent)",
                }}
              />
            )}

            {/* dot */}
            <div style={{ flexShrink: 0, paddingTop: 2 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  background: release.tagColor
                    ? release.tagColor + "18"
                    : "#1e293b",
                  border: `1.5px solid ${release.tagColor ?? "#334155"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 800,
                  color: release.tagColor ?? "#64748b",
                }}
              >
                v
              </div>
            </div>

            {/* content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* version header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 6,
                  flexWrap: "wrap",
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: 22,
                    fontWeight: 900,
                    color: "#f1f5f9",
                  }}
                >
                  v{release.version}
                </h2>
                {release.tag && (
                  <span
                    style={{
                      padding: "3px 10px",
                      borderRadius: 999,
                      fontSize: 11,
                      fontWeight: 700,
                      background: (release.tagColor ?? "#64748b") + "18",
                      color: release.tagColor ?? "#64748b",
                      border: `1px solid ${release.tagColor ?? "#64748b"}28`,
                    }}
                  >
                    {release.tag}
                  </span>
                )}
                <span
                  style={{ fontSize: 12, color: "#475569", marginLeft: "auto" }}
                >
                  {new Date(release.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              <p
                style={{
                  margin: "0 0 16px",
                  color: "#94a3b8",
                  fontSize: 14,
                  lineHeight: 1.6,
                }}
              >
                {release.summary}
              </p>

              {/* changes */}
              <div
                style={{
                  background: "#0f172a",
                  border: "1px solid #1e293b",
                  borderRadius: 14,
                  overflow: "hidden",
                }}
              >
                {release.changes.map((change, i) => {
                  const cfg = TYPE_CONFIG[change.type];
                  return (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                        padding: "12px 16px",
                        borderBottom:
                          i < release.changes.length - 1
                            ? "1px solid #1e293b"
                            : "none",
                      }}
                    >
                      <span
                        style={{
                          flexShrink: 0,
                          marginTop: 1,
                          padding: "2px 8px",
                          borderRadius: 6,
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          background: cfg.bg,
                          color: cfg.color,
                          border: `1px solid ${cfg.color}28`,
                          minWidth: 62,
                          textAlign: "center",
                        }}
                      >
                        {cfg.label}
                      </span>
                      <span
                        style={{
                          fontSize: 13,
                          color: "#94a3b8",
                          lineHeight: 1.6,
                        }}
                      >
                        {change.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
