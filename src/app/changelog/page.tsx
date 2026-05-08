import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "star-rating-x — Changelog",
};

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

const RELEASES: Release[] = [
  {
    version: "5.0.0",
    date: "2025-05-08",
    tag: "Latest",
    tagColor: "#a78bfa",
    summary:
      "Major release — 4 new components, 3 new hooks, and 6 new StarRating props. The most feature-complete version yet.",
    changes: [
      {
        type: "new",
        text: "RatingBadge — compact inline ⭐ 4.8 (1.2k) badge in 4 sizes",
      },
      {
        type: "new",
        text: "RatingSummary — full Amazon-style review summary card",
      },
      {
        type: "new",
        text: "RatingWall — masonry grid of review cards with load-more and helpful voting",
      },
      {
        type: "new",
        text: "RatingPrompt — smart prompt triggered by time, scroll depth, or manually",
      },
      {
        type: "new",
        text: "useRatingAnalytics — average, median, mode, NPS, trend, recentTrend, distribution",
      },
      {
        type: "new",
        text: "useRatingPersistence — auto-save to localStorage with optional TTL expiry",
      },
      {
        type: "new",
        text: "useRatingExport — export ratings array as CSV, JSON, or copy to clipboard",
      },
      {
        type: "new",
        text: "glowEffect + glowIntensity props — drop-shadow glow around filled stars",
      },
      {
        type: "new",
        text: "loading prop — skeleton shimmer placeholder while data loads",
      },
      {
        type: "new",
        text: "allowUndo + undoTimeout + onUndo — undo toast after each rating change",
      },
      {
        type: "new",
        text: "onRatingComplete + debounceMs — fires only after user stops changing",
      },
      {
        type: "improve",
        text: "CSS keyframes added: srx-shimmer, srx-prompt-in, srx-undo-in",
      },
      {
        type: "improve",
        text: "TypeScript declarations extended with 14 new exported interfaces",
      },
    ],
  },
  {
    version: "4.0.0",
    date: "2025-05-07",
    tag: "Stable",
    tagColor: "#ec4899",
    summary:
      "Gradient fill, compare mode, confetti on max rating, and major RatingGroup upgrades.",
    changes: [
      {
        type: "new",
        text: "filledGradient prop — multi-stop colour gradient fill on stars",
      },
      {
        type: "new",
        text: "gradientDirection — 'horizontal' | 'vertical' | 'diagonal'",
      },
      {
        type: "new",
        text: "compareValue + compareLabel — ghost rating displayed behind main stars",
      },
      {
        type: "new",
        text: "celebrateOnMax + confettiColors — confetti burst when user hits max rating",
      },
      {
        type: "new",
        text: "RatingGroup: overallLabel — fully customisable average row label text",
      },
      {
        type: "new",
        text: "RatingGroup: dividerColor — custom divider line colour above average",
      },
      {
        type: "new",
        text: "RatingGroup: averageLabelStyle — CSSProperties for the overall label",
      },
      {
        type: "new",
        text: "RatingGroup: rowGap — configurable gap between category rows",
      },
      {
        type: "new",
        text: "RatingGroup: averagePrecision — 1 or 0.5 precision on average row stars",
      },
      {
        type: "improve",
        text: "CSS: confetti keyframes (srx-confetti-0/1/2) added to styles.css",
      },
      {
        type: "improve",
        text: "StarRating root span gets position: relative for proper confetti layering",
      },
    ],
  },
  {
    version: "3.0.0",
    date: "2025-05-06",
    tag: "Stable",
    tagColor: "#f97316",
    summary:
      "Form integration, tooltip popup, Amazon-style distribution bars, and standalone field validation.",
    changes: [
      {
        type: "new",
        text: "StarRatingInput — form-ready field with label, required, error, helper text",
      },
      {
        type: "new",
        text: "StarRatingInput — hidden <input> for native form submission",
      },
      {
        type: "new",
        text: "StarRatingInput — works with React Hook Form (Controller pattern)",
      },
      { type: "new", text: "StarRatingInput — works with Zod via zodResolver" },
      {
        type: "new",
        text: "StarRatingTooltip — rich popup tooltip on hover with custom renderer",
      },
      {
        type: "new",
        text: "StarRatingTooltip — tooltipPlacement: 'top' | 'bottom'",
      },
      {
        type: "new",
        text: "RatingDistribution — Amazon-style horizontal bar chart",
      },
      {
        type: "new",
        text: "RatingDistribution — clickable rows for star-level filtering",
      },
      {
        type: "new",
        text: "RatingDistribution — compact mode, showCount, showPercent",
      },
      {
        type: "new",
        text: "useRatingField — standalone validation: required, minValue, custom fn",
      },
      {
        type: "new",
        text: "useRatingField — returns showError, errorMessage, field, handlers, reset",
      },
      {
        type: "improve",
        text: "Full TypeScript rewrite — forwardRef properly typed with HTMLSpanElement/HTMLDivElement generics",
      },
      {
        type: "fix",
        text: "All implicit any parameters annotated — zero errors on strict mode",
      },
      {
        type: "fix",
        text: "THEMES record typed as Record<ThemeName,…> — fixes index signature error",
      },
    ],
  },
  {
    version: "2.0.0",
    date: "2025-05-05",
    tag: "Stable",
    tagColor: "#6366f1",
    summary:
      "Emoji/character mode, custom SVG icons, mount count-up animation, and RatingGroup component.",
    changes: [
      {
        type: "new",
        text: "character prop — emoji, text string, or render fn instead of SVG",
      },
      {
        type: "new",
        text: "customIcon prop — custom SVG path string or full render function",
      },
      {
        type: "new",
        text: "mountAnimation + mountDuration — count-up fill animation on first render",
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
        text: "RatingGroup forwards all StarRating props via ...starProps spread",
      },
      {
        type: "fix",
        text: "forwardRef generic type mismatch (RefObject<unknown> vs HTMLSpanElement)",
      },
    ],
  },
  {
    version: "1.0.1",
    date: "2025-05-04",
    tag: "Patch",
    tagColor: "#34d399",
    summary:
      "npm metadata update — homepage, bugs, funding, and author URL linked from the npm package page.",
    changes: [
      { type: "new", text: "author.url — LinkedIn profile linked from npm" },
      {
        type: "new",
        text: "homepage — links to live demo (star-rating-x-demo.vercel.app)",
      },
      { type: "new", text: "bugs.url — GitHub issues page linked from npm" },
      { type: "new", text: "funding — LinkedIn URL in npm Fund button" },
      {
        type: "improve",
        text: "package.json author field upgraded from string to {name, url} object",
      },
    ],
  },
  {
    version: "1.0.0",
    date: "2025-05-03",
    tag: "Initial",
    tagColor: "#60a5fa",
    summary:
      "First public release — a fully-featured, accessible, customisable React star-rating component.",
    changes: [
      {
        type: "new",
        text: "StarRating component — controlled and uncontrolled modes",
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
      { type: "new", text: "RTL layout via direction prop" },
      {
        type: "new",
        text: "Custom colour overrides: filledColor, emptyColor, strokeColor",
      },
      {
        type: "new",
        text: "showValue, tooltips, allowClear, highlightSelected props",
      },
      { type: "new", text: "disabled and readOnly states" },
      { type: "new", text: "useRating hook for external state management" },
      { type: "new", text: "Full TypeScript declarations (.d.ts)" },
      { type: "new", text: "Rollup build — ESM + CJS dual output" },
      {
        type: "new",
        text: "Zero runtime dependencies — only React as peer dep",
      },
    ],
  },
];

const TYPE_CFG: Record<
  ChangeType,
  { label: string; color: string; bg: string }
> = {
  new: { label: "New", color: "#34d399", bg: "#34d39914" },
  fix: { label: "Fix", color: "#f87171", bg: "#f8717114" },
  improve: { label: "Improve", color: "#60a5fa", bg: "#60a5fa14" },
  break: { label: "Breaking", color: "#fbbf24", bg: "#fbbf2414" },
};

export default function ChangelogPage() {
  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        .cl-change-row { display:flex; align-items:flex-start; gap:12px; padding:11px 16px; }
        .cl-change-row:not(:last-child) { border-bottom:1px solid #1e293b; }
        @media(max-width:560px){
          .cl-header-h1 { font-size:28px !important; }
          .cl-version-h2 { font-size:18px !important; }
          .cl-badge-label { min-width:52px !important; font-size:9px !important; }
          .cl-change-text { font-size:12px !important; }
        }
      `}</style>
      <div
        style={{
          minHeight: "100vh",
          background: "#080c14",
          color: "#f1f5f9",
          fontFamily: "'DM Sans','Segoe UI',sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            borderBottom: "1px solid #1e293b",
            padding: "clamp(40px,6vw,56px) 20px clamp(36px,5vw,48px)",
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
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#64748b",
              }}
            >
              Release History
            </p>
            <h1
              className="cl-header-h1"
              style={{
                margin: "0 0 10px",
                fontSize: "clamp(28px,5vw,40px)",
                fontWeight: 900,
                color: "#f1f5f9",
              }}
            >
              Changelog
            </h1>
            <p style={{ margin: 0, color: "#64748b", fontSize: 14 }}>
              All notable changes to{" "}
              <span style={{ color: "#a78bfa", fontWeight: 600 }}>
                star-rating-x
              </span>{" "}
              are documented here.
            </p>
            {/* version pills */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 6,
                marginTop: 20,
                flexWrap: "wrap",
              }}
            >
              {RELEASES.map((r) => (
                <span
                  key={r.version}
                  style={{
                    padding: "3px 10px",
                    borderRadius: 999,
                    background: (r.tagColor ?? "#64748b") + "18",
                    color: r.tagColor ?? "#64748b",
                    fontSize: 11,
                    fontWeight: 700,
                    border: `1px solid ${r.tagColor ?? "#64748b"}28`,
                  }}
                >
                  v{r.version}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div
          style={{
            maxWidth: 780,
            margin: "0 auto",
            padding: "clamp(32px,5vw,48px) 20px clamp(48px,6vw,80px)",
          }}
        >
          {RELEASES.map((release, idx) => (
            <div
              key={release.version}
              style={{
                display: "flex",
                gap: 20,
                marginBottom: idx < RELEASES.length - 1 ? 48 : 0,
                position: "relative",
              }}
            >
              {/* connector line */}
              {idx < RELEASES.length - 1 && (
                <div
                  style={{
                    position: "absolute",
                    left: 18,
                    top: 40,
                    bottom: -48,
                    width: 1,
                    background:
                      "linear-gradient(to bottom,#334155,transparent)",
                  }}
                />
              )}

              {/* dot */}
              <div style={{ flexShrink: 0, paddingTop: 2 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: (release.tagColor ?? "#64748b") + "18",
                    border: `1.5px solid ${release.tagColor ?? "#334155"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
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
                    className="cl-version-h2"
                    style={{
                      margin: 0,
                      fontSize: "clamp(18px,3vw,22px)",
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
                    style={{
                      fontSize: 12,
                      color: "#475569",
                      marginLeft: "auto",
                      flexShrink: 0,
                    }}
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
                    margin: "0 0 14px",
                    color: "#94a3b8",
                    fontSize: 13,
                    lineHeight: 1.65,
                  }}
                >
                  {release.summary}
                </p>

                {/* changes list */}
                <div
                  style={{
                    background: "#0f172a",
                    border: "1px solid #1e293b",
                    borderRadius: 13,
                    overflow: "hidden",
                  }}
                >
                  {release.changes.map((change, i) => {
                    const cfg = TYPE_CFG[change.type];
                    return (
                      <div key={i} className="cl-change-row">
                        <span
                          className="cl-badge-label"
                          style={{
                            flexShrink: 0,
                            marginTop: 1,
                            padding: "2px 8px",
                            borderRadius: 6,
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                            background: cfg.bg,
                            color: cfg.color,
                            border: `1px solid ${cfg.color}28`,
                            minWidth: 60,
                            textAlign: "center",
                          }}
                        >
                          {cfg.label}
                        </span>
                        <span
                          className="cl-change-text"
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

          {/* bottom note */}
          <div
            style={{
              marginTop: 56,
              padding: "20px 24px",
              borderRadius: 14,
              background: "#0f172a",
              border: "1px solid #1e293b",
              textAlign: "center",
            }}
          >
            <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
              Found a bug or have a feature request?{" "}
              <a
                href="https://github.com/Abdelrahman968/star-rating-x/issues"
                target="_blank"
                rel="noreferrer"
                style={{
                  color: "#a78bfa",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Open an issue on GitHub →
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
