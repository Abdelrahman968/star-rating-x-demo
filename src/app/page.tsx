"use client";

import Link from "next/link";
import { useState, useId } from "react";

// ─── inline mini star for hero demo ──────────────────────────────────────────
const STAR_PATH =
  "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";

function MiniStar({
  filled,
  half,
  size = 32,
  color = "#FBBF24",
  stroke = "#F59E0B",
}: {
  filled: boolean;
  half?: boolean;
  size?: number;
  color?: string;
  stroke?: string;
}) {
  const uid = useId();
  return (
    <svg viewBox="0 0 24 24" width={size} height={size}>
      {half && (
        <defs>
          <linearGradient id={`h-${uid}`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="50%" stopColor={color} />
            <stop offset="50%" stopColor="#E5E7EB" />
          </linearGradient>
        </defs>
      )}
      <path
        d={STAR_PATH}
        fill={half ? `url(#h-${uid})` : filled ? color : "#E5E7EB"}
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
          <MiniStar filled={i <= display} size={36} />
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

// ─── Feature card ──────────────────────────────────────────────────────────────
function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: string;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div
      style={{
        padding: "24px",
        borderRadius: 16,
        border: "1px solid #1e293b",
        background: "#0f172a",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        transition: "border-color 0.2s",
      }}
    >
      <span
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: color + "18",
          border: `1px solid ${color}28`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
        }}
      >
        {icon}
      </span>
      <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "#f1f5f9" }}>
        {title}
      </p>
      <p style={{ margin: 0, fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>
        {description}
      </p>
    </div>
  );
}

// ─── Version card ──────────────────────────────────────────────────────────────
function VersionCard({
  version,
  badge,
  badgeColor,
  description,
  features,
  href,
  accent,
}: {
  version: string;
  badge: string;
  badgeColor: string;
  description: string;
  features: string[];
  href: string;
  accent: string;
}) {
  return (
    <div
      style={{
        padding: 28,
        borderRadius: 20,
        border: `1px solid ${accent}30`,
        background: `linear-gradient(135deg, ${accent}08 0%, #0f172a 60%)`,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        flex: "1 1 300px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span
          style={{
            fontSize: 22,
            fontWeight: 900,
            color: accent,
          }}
        >
          {version}
        </span>
        <span
          style={{
            padding: "3px 10px",
            borderRadius: 999,
            fontSize: 11,
            fontWeight: 700,
            background: badgeColor + "18",
            color: badgeColor,
            border: `1px solid ${badgeColor}28`,
          }}
        >
          {badge}
        </span>
      </div>
      <p style={{ margin: 0, color: "#94a3b8", fontSize: 14, lineHeight: 1.6 }}>
        {description}
      </p>
      <ul
        style={{
          margin: 0,
          paddingLeft: 18,
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        {features.map((f) => (
          <li
            key={f}
            style={{ color: "#64748b", fontSize: 13, lineHeight: 1.5 }}
          >
            <span style={{ color: accent, marginRight: 6 }}>✓</span>
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
          gap: 6,
          padding: "10px 20px",
          borderRadius: 10,
          background: accent + "15",
          border: `1px solid ${accent}28`,
          color: accent,
          fontSize: 13,
          fontWeight: 700,
          textDecoration: "none",
          transition: "background 0.15s",
        }}
      >
        View Docs →
      </Link>
    </div>
  );
}

// ─── Code snippet ──────────────────────────────────────────────────────────────
function InstallBlock() {
  const [copied, setCopied] = useState(false);
  const cmd = "npm install star-rating-x";
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        background: "#0d1117",
        border: "1px solid #1e293b",
        borderRadius: 12,
        padding: "12px 20px",
        fontFamily: "'Fira Code', monospace",
        fontSize: 14,
        color: "#a3e635",
      }}
    >
      <span style={{ color: "#64748b", userSelect: "none" }}>$</span>
      <span>{cmd}</span>
      <button
        onClick={() => {
          navigator.clipboard.writeText(cmd);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        }}
        style={{
          marginLeft: 8,
          padding: "3px 10px",
          borderRadius: 6,
          background: "#1e293b",
          border: "1px solid #334155",
          color: copied ? "#4ade80" : "#64748b",
          fontSize: 11,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        {copied ? "✓" : "Copy"}
      </button>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: "🎨",
    title: "9 Themes",
    color: "#FBBF24",
    description:
      "gold, fire, ocean, neon, rose, mono, violet, sunset, mint — or fully custom colours.",
  },
  {
    icon: "⭐",
    title: "8 Shapes",
    color: "#EC4899",
    description:
      "star, heart, circle, diamond, thumb, flag, lightning, flower — plus custom SVG paths.",
  },
  {
    icon: "✨",
    title: "4 Animations",
    color: "#8B5CF6",
    description:
      "bounce, pulse, wiggle, pop — or none. Click animation that delights users.",
  },
  {
    icon: "½",
    title: "Half-star",
    color: "#3B82F6",
    description:
      "Hover left for 0.5, right for 1.0. precision prop for whole or half-star values.",
  },
  {
    icon: "😊",
    title: "Emoji / Text",
    color: "#F97316",
    description:
      "Replace SVG icons with any emoji, text, or full custom render function.",
  },
  {
    icon: "📊",
    title: "Group Rating",
    color: "#10B981",
    description:
      "Rate multiple categories at once with an auto-calculated overall average.",
  },
  {
    icon: "🔤",
    title: "TypeScript",
    color: "#60a5fa",
    description:
      "Full .d.ts declarations. Every prop, type, and hook fully typed out of the box.",
  },
  {
    icon: "♿",
    title: "Accessible",
    color: "#a78bfa",
    description:
      "role=slider, ARIA attributes, keyboard nav (← → Home End), focus ring.",
  },
  {
    icon: "🌍",
    title: "RTL Support",
    color: "#f472b6",
    description:
      "direction='rtl' flips the layout. Perfect for Arabic, Hebrew, and Farsi UIs.",
  },
];

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", background: "#080c14" }}>
      {/* ── HERO ── */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "80px 24px 72px",
          textAlign: "center",
          borderBottom: "1px solid #1e293b",
        }}
      >
        {/* glow */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <div
            style={{
              position: "absolute",
              top: -80,
              left: "50%",
              transform: "translateX(-50%)",
              width: 700,
              height: 400,
              background: "radial-gradient(ellipse,#f97316, transparent 70%)",
              opacity: 0.07,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 40,
              left: "20%",
              width: 300,
              height: 200,
              background: "radial-gradient(ellipse,#8b5cf6,transparent 70%)",
              opacity: 0.08,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 40,
              right: "20%",
              width: 300,
              height: 200,
              background: "radial-gradient(ellipse,#3b82f6,transparent 70%)",
              opacity: 0.08,
            }}
          />
        </div>

        <div style={{ position: "relative", maxWidth: 760, margin: "0 auto" }}>
          {/* version badge */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 8,
              marginBottom: 24,
              flexWrap: "wrap",
            }}
          >
            {[
              ["Latest: v2.0.0", "#a78bfa"],
              ["TypeScript", "#60a5fa"],
              ["Zero deps", "#34d399"],
              ["MIT License", "#f472b6"],
            ].map(([t, c]) => (
              <span
                key={t}
                style={{
                  padding: "4px 14px",
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

          {/* title */}
          <h1
            style={{
              fontSize: "clamp(40px, 8vw, 72px)",
              fontWeight: 900,
              margin: "0 0 16px",
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
              fontSize: 18,
              color: "#94a3b8",
              maxWidth: 520,
              margin: "0 auto 36px",
              lineHeight: 1.7,
            }}
          >
            A fully-featured React rating component. Themes, shapes, animations,
            half-star, emoji, group rating, RTL — all in one package.
          </p>

          {/* live demo */}
          <div
            style={{
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              background: "#ffffff06",
              border: "1px solid #ffffff12",
              borderRadius: 20,
              padding: "24px 40px",
              marginBottom: 40,
            }}
          >
            <HeroRating />
            <p style={{ margin: 0, fontSize: 12, color: "#475569" }}>
              Live demo — click or hover the stars
            </p>
          </div>

          {/* install */}
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
              href="/v2"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "12px 24px",
                borderRadius: 12,
                background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                color: "#fff",
                fontSize: 14,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              View Docs →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section
        style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 24px" }}
      >
        <div style={{ textAlign: "center", marginBottom: 48 }}>
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
            Everything you need
          </p>
          <h2
            style={{
              margin: 0,
              fontSize: 32,
              fontWeight: 800,
              color: "#f1f5f9",
            }}
          >
            All features, zero compromise
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </section>

      {/* ── VERSIONS ── */}
      <section
        style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 72px" }}
      >
        <div style={{ textAlign: "center", marginBottom: 48 }}>
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
            Choose your version
          </p>
          <h2
            style={{
              margin: 0,
              fontSize: 32,
              fontWeight: 800,
              color: "#f1f5f9",
            }}
          >
            v1 vs v2
          </h2>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
          <VersionCard
            version="v1.0.0"
            badge="Stable"
            badgeColor="#34d399"
            accent="#3b82f6"
            description="The original release. Solid, lightweight, and battle-tested with all the core features you need."
            features={[
              "9 themes + custom colours",
              "8 icon shapes",
              "4 click animations",
              "Half-star precision",
              "Keyboard & ARIA accessible",
              "RTL support",
              "useRating hook",
            ]}
            href="/v1"
          />
          <VersionCard
            version="v2.0.0"
            badge="Latest"
            badgeColor="#a78bfa"
            accent="#8b5cf6"
            description="Major update with 4 powerful new features expanding customisation and UX possibilities."
            features={[
              "Everything in v1",
              "Emoji & text character mode",
              "Custom SVG icon / render fn",
              "Mount count-up animation",
              "RatingGroup multi-category",
            ]}
            href="/v2"
          />
        </div>
      </section>

      {/* ── QUICK START ── */}
      <section
        style={{
          borderTop: "1px solid #1e293b",
          borderBottom: "1px solid #1e293b",
          background: "#0d1117",
          padding: "64px 24px",
        }}
      >
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <h2
            style={{
              margin: "0 0 8px",
              fontSize: 28,
              fontWeight: 800,
              color: "#f1f5f9",
            }}
          >
            Get started in 30 seconds
          </h2>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 32 }}>
            Install, import, drop in your JSX.
          </p>
          <pre
            style={{
              background: "#020617",
              border: "1px solid #1e293b",
              borderRadius: 16,
              padding: "24px 28px",
              textAlign: "left",
              fontSize: 13,
              lineHeight: 1.8,
              color: "#e2e8f0",
              overflowX: "auto",
              fontFamily: "'Fira Code',monospace",
            }}
          >
            {`// 1. Install
npm install star-rating-x

// 2. Import
import { StarRating } from "star-rating-x";
import "star-rating-x/styles.css";

// 3. Use
function ProductPage() {
  const [rating, setRating] = useState(0);

  return (
    <StarRating
      value={rating}
      onChange={setRating}
      theme="gold"
      size={32}
    />
  );
}`}
          </pre>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "40px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              fontWeight: 800,
              fontSize: 15,
              color: "#f1f5f9",
            }}
          >
            ⭐ star-rating-x
          </p>
          <p style={{ margin: "4px 0 0", fontSize: 12, color: "#475569" }}>
            MIT License · Built by{" "}
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
        <div style={{ display: "flex", gap: 8 }}>
          {[
            ["/changelog", "Changelog", "#fbbf24"],
            ["https://www.npmjs.com/package/star-rating-x", "npm", "#f87171"],
            [
              "https://github.com/Abdelrahman968/star-rating-x",
              "GitHub",
              "#94a3b8",
            ],
          ].map(([href, label, color]) => {
            const isExternal = href.startsWith("http");
            return isExternal ? (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: "7px 16px",
                  borderRadius: 8,
                  background: color + "15",
                  border: `1px solid ${color}28`,
                  color,
                  fontSize: 12,
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                {label}
              </a>
            ) : (
              <Link
                key={label}
                href={href}
                style={{
                  padding: "7px 16px",
                  borderRadius: 8,
                  background: color + "15",
                  border: `1px solid ${color}28`,
                  color,
                  fontSize: 12,
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </footer>
    </div>
  );
}
