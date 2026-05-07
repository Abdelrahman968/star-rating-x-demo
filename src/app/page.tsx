"use client";

import Link from "next/link";
import { useState } from "react";

const STAR_PATH =
  "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";

function HeroRating() {
  const [value, setValue] = useState(4);
  const [hover, setHover] = useState<number | null>(null);
  const display = hover ?? value;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          onClick={() => setValue(i)}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(null)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 2,
            transform: hover === i ? "scale(1.2)" : "scale(1)",
            transition: "transform 0.15s",
          }}
        >
          <svg viewBox="0 0 24 24" width={36} height={36}>
            <path
              d={STAR_PATH}
              fill={i <= display ? "#FBBF24" : "#1e293b"}
              stroke="#F59E0B"
              strokeWidth={1.5}
              strokeLinejoin="round"
            />
          </svg>
        </button>
      ))}
      <span
        style={{
          marginLeft: 8,
          fontSize: 18,
          fontWeight: 700,
          color: "#FBBF24",
        }}
      >
        {display}.0
      </span>
    </div>
  );
}

function InstallBlock() {
  const [copied, setCopied] = useState(false);
  const cmd = "npm install star-rating-x";
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        background: "#0d1117",
        border: "1px solid #1e293b",
        borderRadius: 12,
        padding: "11px 18px",
        fontFamily: "'Fira Code',monospace",
        fontSize: 13,
        color: "#a3e635",
        maxWidth: "100%",
      }}
    >
      <span style={{ color: "#64748b", flexShrink: 0 }}>$</span>
      <span
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {cmd}
      </span>
      <button
        onClick={() => {
          navigator.clipboard.writeText(cmd);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        }}
        style={{
          marginLeft: 6,
          padding: "2px 9px",
          borderRadius: 6,
          background: "#1e293b",
          border: "1px solid #334155",
          color: copied ? "#4ade80" : "#64748b",
          fontSize: 11,
          fontWeight: 600,
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        {copied ? "✓" : "Copy"}
      </button>
    </div>
  );
}

const FEATURES = [
  {
    icon: "🎨",
    title: "9 Themes",
    color: "#FBBF24",
    desc: "gold, fire, ocean, neon, rose, mono, violet, sunset, mint — or custom colours.",
  },
  {
    icon: "⭐",
    title: "8 Shapes",
    color: "#EC4899",
    desc: "star, heart, circle, diamond, thumb, flag, lightning, flower — plus custom SVG.",
  },
  {
    icon: "✨",
    title: "4 Animations",
    color: "#8B5CF6",
    desc: "bounce, pulse, wiggle, pop — click animation that delights users.",
  },
  {
    icon: "½",
    title: "Half-star",
    color: "#3B82F6",
    desc: "Hover left for 0.5, right for 1.0. precision prop.",
  },
  {
    icon: "😊",
    title: "Emoji / Text",
    color: "#F97316",
    desc: "Replace icons with any emoji, text, or custom render fn.",
  },
  {
    icon: "📊",
    title: "Group Rating",
    color: "#10B981",
    desc: "Rate multiple categories with auto overall average.",
  },
  {
    icon: "📈",
    title: "Analytics",
    color: "#60a5fa",
    desc: "NPS, trend, percentPositive, distribution — useRatingAnalytics.",
  },
  {
    icon: "💾",
    title: "Persistence",
    color: "#a78bfa",
    desc: "useRatingPersistence saves to localStorage with TTL.",
  },
  {
    icon: "🃏",
    title: "Review Wall",
    color: "#f472b6",
    desc: "RatingWall masonry grid with load-more and helpful voting.",
  },
  {
    icon: "🔔",
    title: "Smart Prompt",
    color: "#fbbf24",
    desc: "RatingPrompt fires on time, scroll depth, or manually.",
  },
  {
    icon: "🔤",
    title: "TypeScript",
    color: "#38bdf8",
    desc: "Full .d.ts — every prop, type, and hook typed.",
  },
  {
    icon: "♿",
    title: "Accessible",
    color: "#34d399",
    desc: "role=slider, ARIA, keyboard ← → Home End, focus ring.",
  },
];

const VERSIONS = [
  {
    v: "v1.0",
    badge: "Stable",
    bc: "#34d399",
    accent: "#3b82f6",
    href: "/v1",
    desc: "Core rating — themes, shapes, animations, RTL, useRating hook.",
    feats: [
      "9 themes + custom",
      "8 shapes",
      "4 animations",
      "Half-star",
      "Keyboard & ARIA",
      "RTL",
      "useRating",
    ],
  },
  {
    v: "v2.0",
    badge: "Stable",
    bc: "#60a5fa",
    accent: "#6366f1",
    href: "/v2",
    desc: "Emoji mode, custom SVG icons, mount animation, RatingGroup.",
    feats: [
      "Emoji characters",
      "Custom SVG icon",
      "Mount animation",
      "RatingGroup",
    ],
  },
  {
    v: "v3.0",
    badge: "Stable",
    bc: "#f97316",
    accent: "#f97316",
    href: "/v3",
    desc: "Form integration, tooltip popup, distribution bars, field validation.",
    feats: [
      "StarRatingInput",
      "RHF + Zod",
      "StarRatingTooltip",
      "RatingDistribution",
      "useRatingField",
    ],
  },
  {
    v: "v4.0",
    badge: "Stable",
    bc: "#f472b6",
    accent: "#ec4899",
    href: "/v4",
    desc: "Gradient fill, compare mode, confetti, overallLabel.",
    feats: [
      "filledGradient",
      "compareValue",
      "celebrateOnMax",
      "overallLabel",
      "dividerColor",
    ],
  },
  {
    v: "v5.0",
    badge: "Latest ✨",
    bc: "#a78bfa",
    accent: "#8b5cf6",
    href: "/v5",
    latest: true,
    desc: "10 components, 5 hooks — the most complete rating library for React.",
    feats: [
      "RatingBadge",
      "RatingSummary",
      "RatingWall",
      "RatingPrompt",
      "useRatingAnalytics",
      "useRatingPersistence",
      "glowEffect · skeleton · undo",
    ],
  },
];

export default function HomePage() {
  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        .feat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px,1fr)); gap:12px; }
        .ver-grid  { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px,1fr)); gap:16px; }
        .stat-row  { display: flex; flex-wrap: wrap; gap:10px; }
        @media(max-width:500px){
          .hero-title { font-size:36px !important; }
          .code-pre   { font-size:11px !important; padding: 14px !important; }
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
        {/* HERO */}
        <section
          style={{
            position: "relative",
            overflow: "hidden",
            padding: "clamp(48px,8vw,88px) 20px 64px",
            textAlign: "center",
            borderBottom: "1px solid #1e293b",
          }}
        >
          <div
            style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
          >
            <div
              style={{
                position: "absolute",
                top: -80,
                left: "50%",
                transform: "translateX(-50%)",
                width: 700,
                height: 400,
                background: "radial-gradient(ellipse,#f97316,transparent 70%)",
                opacity: 0.07,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 40,
                left: "15%",
                width: 260,
                height: 180,
                background: "radial-gradient(ellipse,#8b5cf6,transparent 70%)",
                opacity: 0.08,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 40,
                right: "15%",
                width: 260,
                height: 180,
                background: "radial-gradient(ellipse,#3b82f6,transparent 70%)",
                opacity: 0.08,
              }}
            />
          </div>
          <div
            style={{ position: "relative", maxWidth: 760, margin: "0 auto" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 8,
                marginBottom: 22,
                flexWrap: "wrap",
              }}
            >
              {[
                ["v5.0 Latest", "#a78bfa"],
                ["10 Components", "#60a5fa"],
                ["5 Hooks", "#34d399"],
                ["TypeScript", "#f472b6"],
                ["Zero deps", "#fbbf24"],
              ].map(([t, c]) => (
                <span
                  key={t}
                  style={{
                    padding: "3px 12px",
                    borderRadius: 999,
                    background: (c as string) + "18",
                    color: c as string,
                    fontSize: 12,
                    fontWeight: 700,
                    border: `1px solid ${c}28`,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
            <h1
              className="hero-title"
              style={{
                fontSize: "clamp(38px,8vw,72px)",
                fontWeight: 900,
                margin: "0 0 14px",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
              }}
            >
              <span
                style={{
                  background:
                    "linear-gradient(135deg,#fbbf24 0%,#f97316 50%,#ec4899 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                star-rating-x
              </span>
            </h1>
            <p
              style={{
                fontSize: "clamp(14px,2.5vw,18px)",
                color: "#94a3b8",
                maxWidth: 520,
                margin: "0 auto 32px",
                lineHeight: 1.7,
              }}
            >
              The most complete React rating library — themes, shapes,
              animations, emoji, analytics, persistence, and more.
            </p>
            <div
              style={{
                display: "inline-flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                background: "#ffffff06",
                border: "1px solid #ffffff12",
                borderRadius: 20,
                padding: "clamp(16px,4vw,26px) clamp(20px,6vw,44px)",
                marginBottom: 36,
              }}
            >
              <HeroRating />
              <p style={{ margin: 0, fontSize: 12, color: "#475569" }}>
                Live demo — click or hover
              </p>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <InstallBlock />
              <Link
                href="/v5"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "12px 22px",
                  borderRadius: 12,
                  background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                v5 Docs →
              </Link>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section
          style={{ maxWidth: 1100, margin: "0 auto", padding: "44px 20px 0" }}
        >
          <div className="stat-row">
            {[
              ["10", "Components", "#fbbf24"],
              ["5", "Hooks", "#a78bfa"],
              ["9", "Themes", "#60a5fa"],
              ["8", "Shapes", "#ec4899"],
              ["0", "Dependencies", "#34d399"],
            ].map(([v, l, c]) => (
              <div
                key={l}
                style={{
                  textAlign: "center",
                  padding: "18px 14px",
                  borderRadius: 12,
                  background: "#0f172a",
                  border: "1px solid #1e293b",
                  flex: "1 1 110px",
                }}
              >
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 900,
                    color: c as string,
                    lineHeight: 1,
                  }}
                >
                  {v}
                </div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 5 }}>
                  {l}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section
          style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 20px" }}
        >
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <p
              style={{
                margin: "0 0 6px",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#64748b",
              }}
            >
              Everything you need
            </p>
            <h2
              style={{
                margin: 0,
                fontSize: "clamp(20px,4vw,30px)",
                fontWeight: 800,
                color: "#f1f5f9",
              }}
            >
              All features, zero compromise
            </h2>
          </div>
          <div className="feat-grid">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                style={{
                  padding: 18,
                  borderRadius: 13,
                  border: "1px solid #1e293b",
                  background: "#0f172a",
                  display: "flex",
                  flexDirection: "column",
                  gap: 9,
                }}
              >
                <span
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 9,
                    background: f.color + "18",
                    border: `1px solid ${f.color}28`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 17,
                  }}
                >
                  {f.icon}
                </span>
                <p
                  style={{
                    margin: 0,
                    fontWeight: 700,
                    fontSize: 13,
                    color: "#f1f5f9",
                  }}
                >
                  {f.title}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    color: "#64748b",
                    lineHeight: 1.6,
                  }}
                >
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* VERSIONS */}
        <section
          style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px 68px" }}
        >
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <p
              style={{
                margin: "0 0 6px",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#64748b",
              }}
            >
              Pick your version
            </p>
            <h2
              style={{
                margin: 0,
                fontSize: "clamp(20px,4vw,30px)",
                fontWeight: 800,
                color: "#f1f5f9",
              }}
            >
              v1 through v5
            </h2>
          </div>
          <div className="ver-grid">
            {VERSIONS.map(
              ({ v, badge, bc, accent, href, desc, feats, latest }) => (
                <div
                  key={v}
                  style={{
                    padding: 22,
                    borderRadius: 16,
                    border: latest
                      ? `1px solid ${accent}50`
                      : "1px solid #1e293b",
                    background: latest
                      ? `linear-gradient(135deg,${accent}10 0%,#0f172a 60%)`
                      : "#0f172a",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    position: "relative",
                  }}
                >
                  {latest && (
                    <span
                      style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        padding: "2px 7px",
                        borderRadius: 999,
                        background: accent + "20",
                        color: accent,
                        fontSize: 9,
                        fontWeight: 800,
                        border: `1px solid ${accent}40`,
                        letterSpacing: "0.06em",
                      }}
                    >
                      LATEST
                    </span>
                  )}
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span
                      style={{ fontSize: 18, fontWeight: 900, color: accent }}
                    >
                      {v}
                    </span>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: 999,
                        fontSize: 10,
                        fontWeight: 700,
                        background: bc + "18",
                        color: bc,
                        border: `1px solid ${bc}28`,
                      }}
                    >
                      {badge}
                    </span>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      color: "#94a3b8",
                      fontSize: 12,
                      lineHeight: 1.6,
                    }}
                  >
                    {desc}
                  </p>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: 14,
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                    }}
                  >
                    {feats.map((f) => (
                      <li
                        key={f}
                        style={{
                          color: "#64748b",
                          fontSize: 11,
                          lineHeight: 1.5,
                        }}
                      >
                        <span style={{ color: accent, marginRight: 4 }}>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={href}
                    style={{
                      marginTop: "auto",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "8px 16px",
                      borderRadius: 9,
                      background: accent + "15",
                      border: `1px solid ${accent}28`,
                      color: accent,
                      fontSize: 12,
                      fontWeight: 700,
                      textDecoration: "none",
                    }}
                  >
                    View Docs →
                  </Link>
                </div>
              ),
            )}
          </div>
        </section>

        {/* QUICK START */}
        <section
          style={{
            borderTop: "1px solid #1e293b",
            borderBottom: "1px solid #1e293b",
            background: "#0d1117",
            padding: "clamp(36px,6vw,60px) 20px",
          }}
        >
          <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
            <h2
              style={{
                margin: "0 0 8px",
                fontSize: "clamp(18px,4vw,26px)",
                fontWeight: 800,
                color: "#f1f5f9",
              }}
            >
              Get started in 30 seconds
            </h2>
            <p style={{ color: "#64748b", fontSize: 13, marginBottom: 24 }}>
              Install, import, drop in your JSX.
            </p>
            <pre
              className="code-pre"
              style={{
                background: "#020617",
                border: "1px solid #1e293b",
                borderRadius: 13,
                padding: "clamp(14px,4vw,22px) clamp(14px,4vw,26px)",
                textAlign: "left",
                fontSize: 12,
                lineHeight: 1.85,
                color: "#e2e8f0",
                overflowX: "auto",
                fontFamily: "'Fira Code',monospace",
                margin: 0,
              }}
            >{`// 1. Install
npm install star-rating-x

// 2. Import CSS once
import "star-rating-x/styles.css";

// 3. Use
import { StarRating } from "star-rating-x";

function ProductPage() {
  const [rating, setRating] = useState(0);
  return (
    <StarRating value={rating} onChange={setRating} theme="gold" />
  );
}`}</pre>
          </div>
        </section>

        {/* FOOTER */}
        <footer
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "clamp(24px,4vw,36px) 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 14,
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                fontWeight: 800,
                fontSize: 14,
                color: "#f1f5f9",
              }}
            >
              ⭐ star-rating-x
            </p>
            <p style={{ margin: "3px 0 0", fontSize: 12, color: "#475569" }}>
              MIT ·
              <a
                href="https://linkedin.com/in/abdelrahman968"
                target="_blank"
                rel="noreferrer"
                style={{ color: "#a78bfa", textDecoration: "none" }}
              >
                Abdelrahman Ayman
              </a>
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              ["/changelog", "Changelog", "#fbbf24"],
              ["https://www.npmjs.com/package/star-rating-x", "npm", "#f87171"],
              [
                "https://github.com/Abdelrahman968/star-rating-x",
                "GitHub",
                "#94a3b8",
              ],
            ].map(([href, label, color]) => {
              const ext = (href as string).startsWith("http");
              const s: React.CSSProperties = {
                padding: "6px 14px",
                borderRadius: 8,
                background: (color as string) + "15",
                border: `1px solid ${color}28`,
                color,
                fontSize: 12,
                fontWeight: 700,
                textDecoration: "none",
              };
              return ext ? (
                <a
                  key={label}
                  href={href as string}
                  target="_blank"
                  rel="noreferrer"
                  style={s}
                >
                  {label}
                </a>
              ) : (
                <Link key={label} href={href as string} style={s}>
                  {label}
                </Link>
              );
            })}
          </div>
        </footer>
      </div>
    </>
  );
}
