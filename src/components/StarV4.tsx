"use client";

import { useState, useEffect, useRef, useCallback, useId } from "react";

const STAR_PATH =
  "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";
const THEMES: Record<
  string,
  { filled: string; empty: string; stroke: string }
> = {
  gold: { filled: "#FBBF24", empty: "#E5E7EB", stroke: "#F59E0B" },
  fire: { filled: "#EF4444", empty: "#FEE2E2", stroke: "#B91C1C" },
  ocean: { filled: "#3B82F6", empty: "#DBEAFE", stroke: "#1D4ED8" },
  rose: { filled: "#EC4899", empty: "#FCE7F3", stroke: "#BE185D" },
  violet: { filled: "#8B5CF6", empty: "#EDE9FE", stroke: "#6D28D9" },
  mint: { filled: "#10B981", empty: "#D1FAE5", stroke: "#059669" },
  sunset: { filled: "#F97316", empty: "#FFEDD5", stroke: "#C2410C" },
};

let _kf = false;
function injectKf() {
  if (_kf || typeof document === "undefined") return;
  _kf = true;
  const s = document.createElement("style");
  s.textContent = `
    @keyframes srx-bounce{0%{transform:scale(1)}30%{transform:scale(1.45)}55%{transform:scale(.9)}75%{transform:scale(1.15)}100%{transform:scale(1)}}
    @keyframes srx-pop{0%{transform:scale(1)}50%{transform:scale(1.6)}100%{transform:scale(1)}}
    @keyframes srx-c0{0%{transform:translate(0,0)scale(1);opacity:1}100%{transform:translate(0,-40px)scale(0);opacity:0}}
    @keyframes srx-c1{0%{transform:translate(0,0)scale(1);opacity:1}100%{transform:translate(14px,-32px)scale(0);opacity:0}}
    @keyframes srx-c2{0%{transform:translate(0,0)scale(1);opacity:1}100%{transform:translate(-12px,-36px)scale(0);opacity:0}}
  `;
  document.head.appendChild(s);
}

interface StarRatingProps {
  value?: number;
  defaultValue?: number;
  count?: number;
  precision?: number;
  size?: number | string;
  gap?: number | string;
  theme?: string;
  filledColor?: string;
  filledGradient?: string[];
  gradientDirection?: "horizontal" | "vertical" | "diagonal";
  compareValue?: number;
  compareLabel?: string;
  celebrateOnMax?: boolean;
  confettiColors?: string[];
  readOnly?: boolean;
  showValue?: boolean;
  animation?: "none" | "bounce" | "pop";
  onChange?: (value: number) => void;
}

function StarRating({
  value: cv,
  defaultValue = 0,
  count = 5,
  precision = 1,
  size = 28,
  gap = 5,
  theme = "gold",
  filledColor,
  filledGradient,
  gradientDirection = "horizontal",
  compareValue,
  compareLabel = "avg",
  celebrateOnMax = false,
  confettiColors = ["#FBBF24", "#F97316", "#EC4899", "#8B5CF6", "#3B82F6"],
  readOnly = false,
  showValue = false,
  animation = "bounce",
  onChange,
}: StarRatingProps) {
  const uid = useId();
  const isCtrl = cv !== undefined;
  const [intVal, setIntVal] = useState(defaultValue);
  const cur = isCtrl ? cv : intVal;
  const [hover, setHover] = useState<number | null>(null);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const prevRef = useRef(cur);
  const [showConf, setShowConf] = useState(false);
  const [confettiParams, setConfettiParams] = useState<
    Array<{
      dist: number;
      w: number;
      h: number;
      rounded: boolean;
      rad: number;
      col: string;
    }>
  >([]);
  const t = THEMES[theme] ?? THEMES.gold;
  const filled = filledColor ?? t.filled,
    empty = t.empty,
    stroke = t.stroke;
  const gradId = `${uid}-gf`;
  const activeFill = filledGradient ? `url(#${gradId})` : filled;
  const [gx1, gy1, gx2, gy2] =
    gradientDirection === "vertical"
      ? ["0", "0", "0", "1"]
      : gradientDirection === "diagonal"
        ? ["0", "0", "1", "1"]
        : ["0", "0", "1", "0"];

  useEffect(() => {
    if (celebrateOnMax && cur === count && prevRef.current !== count) {
      setConfettiParams(
        Array.from({ length: 16 }, (_, i) => {
          const ang = (i / 16) * 360;
          return {
            dist: 26 + Math.random() * 18,
            w: 4 + Math.random() * 4,
            h: 4 + Math.random() * 4,
            rounded: Math.random() > 0.5,
            rad: (ang * Math.PI) / 180,
            col: confettiColors[i % confettiColors.length],
          };
        }),
      );
      setShowConf(true);
      const t = setTimeout(() => setShowConf(false), 1400);
      return () => clearTimeout(t);
    }
    prevRef.current = cur;
  }, [cur, count, celebrateOnMax, confettiColors]);

  const getV = useCallback(
    (e: React.MouseEvent<HTMLSpanElement>, i: number) => {
      if (precision === 1) return i + 1;
      const r = e.currentTarget.getBoundingClientRect();
      return (
        Math.round((i + (e.clientX - r.left < r.width / 2 ? 0.5 : 1)) * 2) / 2
      );
    },
    [precision],
  );
  const disp = hover ?? cur;
  const getFill = (i: number) => {
    const f = disp - i;
    if (f >= 1) return 1;
    if (f > 0 && precision === 0.5) return 0.5;
    return 0;
  };
  const getColor = (i: number) => {
    const fill = getFill(i);
    return fill === 0 ? empty : fill === 1 ? activeFill : `url(#${uid}-hg${i})`;
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap,
        position: "relative",
        userSelect: "none",
      }}
      onMouseLeave={() => !readOnly && setHover(null)}
    >
      <svg width="0" height="0" aria-hidden style={{ position: "absolute" }}>
        <defs>
          {Array.from({ length: count }, (_, i) => (
            <linearGradient key={i} id={`${uid}-hg${i}`} x1="0" x2="1">
              <stop
                offset={`${getFill(i) * 100}%`}
                stopColor={activeFill.startsWith("url") ? filled : activeFill}
              />
              <stop offset={`${getFill(i) * 100}%`} stopColor={empty} />
            </linearGradient>
          ))}
          {filledGradient && filledGradient.length >= 2 && (
            <linearGradient id={gradId} x1={gx1} y1={gy1} x2={gx2} y2={gy2}>
              {filledGradient.map((c: string, i: number) => (
                <stop
                  key={i}
                  offset={`${(i / (filledGradient.length - 1)) * 100}%`}
                  stopColor={c}
                />
              ))}
            </linearGradient>
          )}
        </defs>
      </svg>
      {showConf && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            pointerEvents: "none",
            zIndex: 20,
          }}
        >
          {confettiParams.map((p, i) => (
            <span
              key={i}
              style={{
                position: "absolute",
                width: p.w,
                height: p.h,
                borderRadius: p.rounded ? "50%" : 2,
                background: p.col,
                left: `calc(50% + ${Math.cos(p.rad) * p.dist}px)`,
                top: `calc(50% + ${Math.sin(p.rad) * p.dist}px)`,
                animation: `srx-c${i % 3} 1.2s ease-out forwards`,
              }}
            />
          ))}
        </span>
      )}
      {compareValue !== undefined && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            display: "inline-flex",
            gap,
            pointerEvents: "none",
            opacity: 0.25,
          }}
        >
          {Array.from({ length: count }, (_, i) => {
            const f = compareValue - i;
            const fc = f >= 1 ? filled : f > 0 ? `url(#${uid}-cg${i})` : empty;
            return (
              <span
                key={i}
                style={{
                  width: typeof size === "number" ? size : 28,
                  height: typeof size === "number" ? size : 28,
                  display: "inline-flex",
                }}
              >
                <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden>
                  <defs>
                    <linearGradient id={`${uid}-cg${i}`} x1="0" x2="1">
                      <stop
                        offset={`${Math.min(1, Math.max(0, f)) * 100}%`}
                        stopColor={filled}
                      />
                      <stop
                        offset={`${Math.min(1, Math.max(0, f)) * 100}%`}
                        stopColor={empty}
                      />
                    </linearGradient>
                  </defs>
                  <path
                    d={STAR_PATH}
                    fill={fc}
                    stroke={stroke}
                    strokeWidth={1.5}
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            );
          })}
        </span>
      )}
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          onClick={(e) => {
            if (readOnly) return;
            const v = getV(e, index);
            const n = v === cur ? 0 : v;
            setActiveIdx(index);
            setTimeout(() => setActiveIdx(null), 500);
            if (!isCtrl) setIntVal(n);
            onChange?.(n);
          }}
          onMouseMove={(e) => !readOnly && setHover(getV(e, index))}
          style={{
            cursor: readOnly ? "default" : "pointer",
            width: size,
            height: size,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            animation:
              activeIdx === index && animation !== "none"
                ? `srx-${animation} 0.4s cubic-bezier(0.36,0.07,0.19,0.97)`
                : undefined,
          }}
        >
          <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden>
            <path
              d={STAR_PATH}
              fill={getColor(index)}
              stroke={stroke}
              strokeWidth={1.5}
              strokeLinejoin="round"
            />
          </svg>
        </span>
      ))}
      {showValue && (
        <span
          aria-hidden
          style={{
            marginLeft: 8,
            fontSize: (typeof size === "number" ? size : 28) * 0.5,
            fontWeight: 600,
            color: filled,
          }}
        >
          {disp.toFixed(precision === 0.5 ? 1 : 0)}
        </span>
      )}
      {compareValue !== undefined && (
        <span
          aria-hidden
          style={{
            marginLeft: 6,
            fontSize: (typeof size === "number" ? size : 28) * 0.38,
            color: filled,
            opacity: 0.5,
            fontWeight: 600,
          }}
        >
          {compareLabel} {compareValue.toFixed(1)}
        </span>
      )}
    </span>
  );
}

interface Category {
  key: string;
  label: string;
}

interface RatingGroupProps extends Omit<
  StarRatingProps,
  "value" | "onChange" | "size" | "gap" | "theme" | "defaultValue"
> {
  categories?: Category[];
  values?: Record<string, number>;
  defaultValues?: Record<string, number>;
  onChange?: (
    key: string,
    val: number,
    allValues: Record<string, number>,
  ) => void;
  showAverage?: boolean;
  overallLabel?: string;
  averagePrecision?: number;
  showValues?: boolean;
  labelWidth?: number | string;
  rowGap?: number | string;
  dividerColor?: string;
  averageLabelStyle?: React.CSSProperties;
  size?: number | string;
  gap?: number | string;
  theme?: string;
}

function RatingGroup({
  categories = [],
  values: ctrl,
  defaultValues = {},
  onChange,
  showAverage = false,
  overallLabel = "Overall",
  averagePrecision = 0.5,
  showValues = false,
  labelWidth = 120,
  rowGap = 12,
  dividerColor = "#e5e7eb",
  averageLabelStyle = {},
  size = 24,
  gap = 5,
  theme = "gold",
  ...rest
}: RatingGroupProps) {
  const isCtrl = ctrl !== undefined;
  const [internal, setInternal] = useState<Record<string, number>>(() => {
    const i: Record<string, number> = {};
    categories.forEach(({ key }) => {
      i[key] = defaultValues[key] ?? 0;
    });
    return i;
  });
  const values = isCtrl ? ctrl : internal;
  const handleChange = (key: string, val: number) => {
    const next = { ...values, [key]: val };
    if (!isCtrl) setInternal(next);
    onChange?.(key, val, next);
  };
  const avg = categories.length
    ? categories.reduce((s: number, { key }) => s + (values?.[key] ?? 0), 0) /
      categories.length
    : 0;
  const sz = typeof size === "number" ? size : 24;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: rowGap }}>
      {categories.map(({ key, label }) => (
        <div
          key={key}
          style={{ display: "flex", alignItems: "center", gap: 10 }}
        >
          <span
            style={{
              width: labelWidth,
              flexShrink: 0,
              fontSize: sz * 0.5,
              fontWeight: 500,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </span>
          <StarRating
            value={values[key] ?? 0}
            onChange={(v: number) => handleChange(key, v)}
            size={size}
            gap={gap}
            theme={theme}
            showValue={showValues}
            {...rest}
          />
        </div>
      ))}
      {showAverage && categories.length > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            paddingTop: 8,
            borderTop: `1px solid ${dividerColor}`,
            marginTop: 4,
          }}
        >
          <span
            style={{
              width: labelWidth,
              flexShrink: 0,
              fontSize: sz * 0.5,
              fontWeight: 700,
              ...averageLabelStyle,
            }}
          >
            {overallLabel}
          </span>
          <StarRating
            value={+avg.toFixed(averagePrecision === 0.5 ? 1 : 0)}
            precision={averagePrecision}
            size={size}
            gap={gap}
            theme={theme}
            readOnly
            showValue
          />
        </div>
      )}
    </div>
  );
}

interface CardProps {
  title: string;
  tag: string;
  tagColor?: string;
  children: React.ReactNode;
  code: string;
}

function Card({ title, tag, tagColor = "#ec4899", children, code }: CardProps) {
  const [copied, setCopied] = useState(false);
  return (
    <div
      style={{
        borderRadius: 18,
        border: "1px solid #1e293b",
        background: "#0f172a",
        overflow: "hidden",
        marginBottom: 20,
      }}
    >
      <div
        style={{
          padding: "13px 20px",
          borderBottom: "1px solid #1e293b",
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            padding: "2px 10px",
            borderRadius: 999,
            background: tagColor + "18",
            color: tagColor,
            fontSize: 10,
            fontWeight: 700,
            border: `1px solid ${tagColor}28`,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          {tag}
        </span>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>
          {title}
        </span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <div
          style={{
            flex: "1 1 200px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px 20px",
            minHeight: 80,
          }}
        >
          {children}
        </div>
        <div
          style={{
            flex: "2 1 260px",
            borderLeft: "1px solid #1e293b",
            position: "relative",
            minWidth: 0,
          }}
        >
          <button
            onClick={() => {
              navigator.clipboard?.writeText(code);
              setCopied(true);
              setTimeout(() => setCopied(false), 1800);
            }}
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              padding: "3px 10px",
              borderRadius: 7,
              background: "#1e293b",
              border: "1px solid #334155",
              color: copied ? "#4ade80" : "#94a3b8",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              zIndex: 1,
            }}
          >
            {copied ? "✓" : "Copy"}
          </button>
          <pre
            style={{
              background: "#020617",
              margin: 0,
              padding: "16px",
              fontSize: 11,
              color: "#cbd5e1",
              overflowX: "auto",
              lineHeight: 1.75,
              fontFamily: "'Fira Code',monospace",
              minHeight: "100%",
            }}
          >
            {code}
          </pre>
        </div>
      </div>
    </div>
  );
}

interface SHProps {
  n: string;
  title: string;
}

function SH({ n, title }: SHProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 20,
        marginTop: 44,
      }}
    >
      <span
        style={{
          width: 30,
          height: 30,
          borderRadius: 9,
          background: "linear-gradient(135deg,#ec4899,#be185d)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          fontWeight: 800,
          color: "#fff",
          flexShrink: 0,
        }}
      >
        {n}
      </span>
      <h2
        style={{ fontSize: 18, fontWeight: 800, color: "#f1f5f9", margin: 0 }}
      >
        {title}
      </h2>
      <div
        style={{
          flex: 1,
          height: 1,
          background: "linear-gradient(to right,#334155,transparent)",
        }}
      />
    </div>
  );
}

const GRAD_PRESETS = [
  { label: "🔥 Fire", colors: ["#FBBF24", "#F97316", "#EF4444"] },
  { label: "🌊 Ocean", colors: ["#38BDF8", "#3B82F6", "#6366F1"] },
  { label: "🌿 Mint", colors: ["#34D399", "#10B981", "#059669"] },
  { label: "💜 Violet", colors: ["#C084FC", "#8B5CF6", "#6D28D9"] },
  { label: "⭐ Gold", colors: ["#FDE68A", "#FBBF24", "#D97706"] },
];

export default function StarV4() {
  injectKf();
  const [gradPreset, setGradPreset] = useState(0);
  const [gradDir, setGradDir] = useState<
    "horizontal" | "vertical" | "diagonal"
  >("horizontal");
  const [gradVal, setGradVal] = useState(3);
  const [cmpVal, setCmpVal] = useState(2);
  const [confVal, setConfVal] = useState(3);
  const [groupVals, setGroupVals] = useState({
    quality: 4,
    service: 3,
    value: 5,
  });
  const [customLabel, setCustomLabel] = useState("Overall");
  const [divColor, setDivColor] = useState("#334155");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080c14",
        color: "#f1f5f9",
        fontFamily: "'DM Sans','Segoe UI',sans-serif",
        padding: "0 0 80px",
      }}
    >
      {/* Hero */}
      <div
        style={{
          background: "linear-gradient(135deg,#0f172a,#1a0a1e)",
          padding: "clamp(40px,6vw,56px) 20px clamp(36px,5vw,44px)",
          textAlign: "center",
          borderBottom: "1px solid #1e293b",
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
            height: 240,
            background: "radial-gradient(ellipse,#ec489920,transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              justifyContent: "center",
              marginBottom: 14,
            }}
          >
            {[
              ["v4.0.0", "#ec4899"],
              ["Gradient Fill", "#f472b6"],
              ["Compare Mode", "#60a5fa"],
              ["Confetti 🎉", "#34d399"],
              ["overallLabel", "#a78bfa"],
            ].map(([t, c]) => (
              <span
                key={t}
                style={{
                  padding: "3px 11px",
                  borderRadius: 999,
                  background: (c as string) + "18",
                  color: c as string,
                  fontSize: 11,
                  fontWeight: 700,
                  border: `1px solid ${c}28`,
                }}
              >
                {t}
              </span>
            ))}
          </div>
          <h1
            style={{
              fontSize: "clamp(32px,6vw,48px)",
              fontWeight: 900,
              margin: "0 0 8px",
              background: "linear-gradient(135deg,#ec4899,#8b5cf6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            v4 — Visual Upgrade
          </h1>
          <p
            style={{
              color: "#94a3b8",
              fontSize: "clamp(13px,2vw,15px)",
              marginBottom: 28,
            }}
          >
            Gradient fill · Compare mode · Confetti · overallLabel ·
            dividerColor
          </p>
          <div
            style={{
              display: "inline-flex",
              gap: 24,
              flexWrap: "wrap",
              justifyContent: "center",
              background: "#ffffff08",
              border: "1px solid #ffffff12",
              borderRadius: 20,
              padding: "clamp(16px,4vw,22px) clamp(20px,6vw,40px)",
            }}
          >
            <StarRating
              defaultValue={4}
              count={5}
              size={38}
              filledGradient={["#FBBF24", "#F97316", "#EF4444"]}
              showValue
              animation="pop"
            />
            <StarRating
              defaultValue={3}
              count={5}
              size={38}
              compareValue={4.2}
              theme="ocean"
              showValue
            />
            <StarRating
              defaultValue={5}
              count={5}
              size={38}
              celebrateOnMax
              theme="violet"
              showValue
              animation="bounce"
            />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px" }}>
        {/* 01 Gradient */}
        <SH n="01" title="filledGradient" />

        <Card
          tag="v4"
          title="Preset gradient themes"
          code={`<StarRating
  filledGradient={["#FBBF24","#F97316","#EF4444"]}
  gradientDirection="horizontal"
  value={rating}
  onChange={setRating}
/>`}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 6,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {GRAD_PRESETS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setGradPreset(i)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 8,
                    border: `1.5px solid ${i === gradPreset ? "#a78bfa" : "#334155"}`,
                    background: i === gradPreset ? "#a78bfa18" : "transparent",
                    color: i === gradPreset ? "#a78bfa" : "#64748b",
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <StarRating
              value={gradVal}
              onChange={setGradVal}
              count={5}
              size={36}
              filledGradient={GRAD_PRESETS[gradPreset].colors}
              showValue
              animation="bounce"
            />
          </div>
        </Card>

        <Card
          tag="v4"
          title="gradientDirection"
          code={`// "horizontal" | "vertical" | "diagonal"
<StarRating
  filledGradient={["#38BDF8","#6366F1"]}
  gradientDirection="diagonal"
/>`}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              alignItems: "flex-start",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", gap: 6 }}>
              {(["horizontal", "vertical", "diagonal"] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setGradDir(d)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 8,
                    border: `1.5px solid ${d === gradDir ? "#60a5fa" : "#334155"}`,
                    background: d === gradDir ? "#60a5fa18" : "transparent",
                    color: d === gradDir ? "#60a5fa" : "#64748b",
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
            <StarRating
              value={gradVal}
              onChange={setGradVal}
              count={5}
              size={32}
              filledGradient={["#38BDF8", "#3B82F6", "#6366F1"]}
              gradientDirection={gradDir}
              showValue
            />
          </div>
        </Card>

        {/* 02 Compare */}
        <SH n="02" title="compareValue — Ghost Rating" />

        <Card
          tag="v4"
          title="Your rating vs community average"
          code={`<StarRating
  value={myRating}
  onChange={setMyRating}
  compareValue={4.2}
  compareLabel="community avg"
  theme="ocean"
  showValue
/>`}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
            }}
          >
            <StarRating
              value={cmpVal}
              onChange={setCmpVal}
              count={5}
              size={34}
              compareValue={4.2}
              compareLabel="avg"
              theme="ocean"
              showValue
            />
            <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>
              Ghost stars show 4.2 avg behind your rating
            </p>
          </div>
        </Card>

        {/* 03 Confetti */}
        <SH n="03" title="celebrateOnMax 🎉" />

        <Card
          tag="v4"
          title="Confetti burst on 5 stars"
          code={`<StarRating
  celebrateOnMax
  confettiColors={["#FBBF24","#F97316","#EC4899","#8B5CF6"]}
  value={rating}
  onChange={setRating}
  animation="pop"
/>`}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
            }}
          >
            <StarRating
              value={confVal}
              onChange={setConfVal}
              count={5}
              size={36}
              celebrateOnMax
              theme="gold"
              showValue
              animation="pop"
            />
            <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>
              Click the 5th star! 🎉
            </p>
          </div>
        </Card>

        {/* 04 overallLabel */}
        <SH n="04" title="RatingGroup — overallLabel & dividerColor" />

        <Card
          tag="v4"
          title="Customise the average row"
          code={`<RatingGroup
  categories={categories}
  overallLabel="إجمالي"       // any language
  dividerColor="#7c3aed"
  averageLabelStyle={{ color:"#a78bfa", fontStyle:"italic" }}
  showAverage
  showValues
/>`}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {[
                ["Overall", "#f1f5f9"],
                ["إجمالي", "#FBBF24"],
                ["Moyenne", "#60a5fa"],
                ["总分", "#EC4899"],
                ["Gesamt", "#34d399"],
              ].map(([l, c]) => (
                <button
                  key={l}
                  onClick={() => setCustomLabel(l)}
                  style={{
                    padding: "3px 10px",
                    borderRadius: 8,
                    border: `1.5px solid ${customLabel === l ? c : "#334155"}`,
                    background: customLabel === l ? c + "18" : "transparent",
                    color: customLabel === l ? c : "#64748b",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {[
                ["#334155", "Slate"],
                ["#7c3aed", "Violet"],
                ["#f97316", "Orange"],
                ["#10b981", "Green"],
              ].map(([c, l]) => (
                <button
                  key={c}
                  onClick={() => setDivColor(c)}
                  style={{
                    padding: "3px 10px",
                    borderRadius: 8,
                    border: `1.5px solid ${divColor === c ? c : "#334155"}`,
                    background: divColor === c ? c + "18" : "transparent",
                    color: divColor === c ? c : "#64748b",
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: c,
                      marginRight: 4,
                    }}
                  />
                  {l}
                </button>
              ))}
            </div>
            <RatingGroup
              categories={[
                { key: "quality", label: "Quality" },
                { key: "service", label: "Service" },
                { key: "value", label: "Value" },
              ]}
              values={groupVals}
              onChange={(_k: string, _v: number, all: Record<string, number>) =>
                setGroupVals(all as unknown as typeof groupVals)
              }
              showAverage
              showValues
              overallLabel={customLabel}
              dividerColor={divColor}
              averageLabelStyle={{ color: "#a78bfa" }}
              theme="gold"
              size={22}
            />
          </div>
        </Card>

        {/* footer */}
        <div
          style={{
            borderTop: "1px solid #1e293b",
            paddingTop: 28,
            marginTop: 8,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <p style={{ fontWeight: 800, color: "#f1f5f9", margin: 0 }}>
              star-rating-x v4
            </p>
            <p style={{ fontSize: 12, color: "#475569", margin: "2px 0 0" }}>
              MIT · Abdelrahman Ayman
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {[
              ["v5 ✨", "/v5", "#a78bfa"],
              ["npm", "https://npmjs.com/package/star-rating-x", "#f87171"],
              [
                "GitHub",
                "https://github.com/Abdelrahman968/star-rating-x",
                "#94a3b8",
              ],
            ].map(([l, h, c]) => (
              <a
                key={l}
                href={h}
                style={{
                  padding: "7px 14px",
                  borderRadius: 9,
                  background: (c as string) + "18",
                  border: `1px solid ${c}30`,
                  color: c as string,
                  fontSize: 12,
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
