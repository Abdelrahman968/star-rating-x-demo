"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ── interfaces ────────────────────────────────────────────────────────────────
export interface Review {
  id?: string | number;
  author?: string;
  rating: number;
  title?: string;
  text?: string;
  date?: string;
  verified?: boolean;
  helpful?: number;
}

export interface StarRatingProps {
  value?: number;
  defaultValue?: number;
  count?: number;
  precision?: number;
  size?: number | string;
  gap?: number;
  theme?: string;
  filledColor?: string;
  readOnly?: boolean;
  disabled?: boolean;
  showValue?: boolean;
  animation?: string;
  glowEffect?: boolean;
  glowIntensity?: number;
  loading?: boolean;
  allowUndo?: boolean;
  undoTimeout?: number;
  onUndo?: (value: number) => void;
  onRatingComplete?: (value: number) => void;
  debounceMs?: number;
  celebrateOnMax?: boolean;
  confettiColors?: string[];
  onChange?: (value: number) => void;
  label?: string;
}

export interface RatingBadgeProps {
  value?: number | string;
  count?: number;
  theme?: string;
  filledColor?: string;
  size?: "xs" | "sm" | "md" | "lg";
  showCount?: boolean;
  compact?: boolean;
  pill?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export interface RatingDistributionProps {
  data?: Record<number, number>;
  total?: number;
  count?: number;
  theme?: string;
  showCount?: boolean;
  showPercent?: boolean;
  onFilter?: (star: number | null) => void;
  activeFilter?: number | null;
  compact?: boolean;
}

export interface RatingSummaryProps {
  average?: number;
  total?: number;
  distribution?: Record<number, number>;
  reviews?: Review[];
  maxReviews?: number;
  onWriteReview?: () => void;
  theme?: string;
  showReviews?: boolean;
}

export interface RatingWallProps {
  reviews?: Review[];
  columns?: number;
  maxItems?: number;
  showMore?: boolean;
  pageSize?: number;
  theme?: string;
  onHelpful?: (review: Review) => void;
}

export interface RatingPromptProps {
  visible?: boolean;
  message?: string;
  subMessage?: string;
  onRate?: (rating: number) => void;
  onDismiss?: () => void;
  onLater?: () => void;
  showLater?: boolean;
  theme?: string;
  count?: number;
  size?: number;
  placement?: "bottom-right" | "bottom-left" | "bottom-center" | "center";
}

// ── inlined primitives ────────────────────────────────────────────────────────
const SP =
  "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";
const TH: Record<string, { filled: string; empty: string; stroke: string }> = {
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
    @keyframes srx-shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
    @keyframes srx-prompt-in{0%{opacity:0;transform:translateY(12px)scale(0.96)}100%{opacity:1;transform:translateY(0)scale(1)}}
    @keyframes srx-undo-in{0%{opacity:0;transform:translateX(-50%)translateY(6px)}100%{opacity:1;transform:translateX(-50%)translateY(0)}}
    @keyframes srx-c0{0%{transform:translate(0,0)scale(1);opacity:1}100%{transform:translate(0,-40px)scale(0);opacity:0}}
    @keyframes srx-c1{0%{opacity:1}100%{transform:translate(14px,-32px)scale(0);opacity:0}}
    @keyframes srx-c2{0%{opacity:1}100%{transform:translate(-12px,-36px)scale(0);opacity:0}}
  `;
  document.head.appendChild(s);
}

// ── StarRating ─────────────────────────────────────────────────────────────────
function StarRating({
  value: cv,
  defaultValue = 0,
  count = 5,
  precision = 1,
  size = 26,
  gap = 4,
  theme = "gold",
  filledColor,
  readOnly = false,
  disabled = false,
  showValue = false,
  animation = "bounce",
  glowEffect = false,
  glowIntensity = 0.5,
  loading = false,
  allowUndo = false,
  undoTimeout = 4000,
  onUndo,
  onRatingComplete,
  debounceMs = 0,
  celebrateOnMax = false,
  confettiColors = ["#FBBF24", "#F97316", "#EC4899", "#8B5CF6", "#3B82F6"],
  onChange,
  label = "Rating",
}: StarRatingProps) {
  const isCtrl = cv !== undefined;
  const [intVal, setIntVal] = useState(defaultValue);
  const cur = isCtrl ? cv : intVal;
  const [hover, setHover] = useState<number | null>(null);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const prevRef = useRef(cur);
  const undoRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const completeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [undoPrev, setUndoPrev] = useState<number | null>(null);
  const [undoVisible, setUndoVisible] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [confettiData, setConfettiData] = useState<
    {
      id: number;
      col: string;
      width: number;
      height: number;
      borderRadius: string | number;
      left: string;
      top: string;
      animation: string;
    }[]
  >([]);
  const t = TH[theme ?? "gold"] ?? TH.gold;
  const filled = filledColor ?? t.filled;
  const sn = typeof size === "number" ? size : 26;

  useEffect(() => {
    if (celebrateOnMax && cur === count && prevRef.current !== count) {
      setConfettiData(
        Array.from({ length: 16 }, (_, i) => {
          const ang = (i / 16) * 360,
            col = (confettiColors ?? [])[i % (confettiColors?.length || 1)],
            dist = 26 + Math.random() * 18,
            rad = (ang * Math.PI) / 180;
          return {
            id: i,
            col,
            width: 4 + Math.random() * 4,
            height: 4 + Math.random() * 4,
            borderRadius: Math.random() > 0.5 ? "50%" : 2,
            left: `calc(50% + ${Math.cos(rad) * dist}px)`,
            top: `calc(50% + ${Math.sin(rad) * dist}px)`,
            animation: `srx-c${i % 3} 1.2s ease-out forwards`,
          };
        }),
      );
      setShowConf(true);
      const tid = setTimeout(() => setShowConf(false), 1400);
      return () => clearTimeout(tid);
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

  if (loading) {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap }}>
        {Array.from({ length: count }, (_, i) => (
          <span
            key={i}
            style={{
              width: sn,
              height: sn,
              borderRadius: "50%",
              background:
                "linear-gradient(90deg,#1e293b 25%,#334155 50%,#1e293b 75%)",
              backgroundSize: "200% 100%",
              animation: "srx-shimmer 1.4s infinite",
              display: "inline-block",
            }}
          />
        ))}
      </span>
    );
  }

  const disp = hover ?? cur;
  const getFill = (i: number) => {
    const f = disp - i;
    return f >= 1 ? 1 : f > 0 && precision === 0.5 ? 0.5 : 0;
  };
  const getColor = (i: number) => {
    const fill = getFill(i);
    return fill === 0 ? t.empty : fill === 1 ? filled : t.empty;
  };
  const glowCSS = glowEffect
    ? { filter: `drop-shadow(0 0 ${sn * 0.3 * glowIntensity}px ${filled})` }
    : {};

  const handleClick = (e: React.MouseEvent<HTMLSpanElement>, i: number) => {
    if (readOnly || disabled) return;
    const v = getV(e, i);
    const n = v === cur ? 0 : v;
    if (allowUndo) {
      setUndoPrev(cur);
      setUndoVisible(true);
      if (undoRef.current) clearTimeout(undoRef.current);
      undoRef.current = setTimeout(() => {
        setUndoVisible(false);
        setUndoPrev(null);
      }, undoTimeout);
    }
    setActiveIdx(i);
    setTimeout(() => setActiveIdx(null), 500);
    if (!isCtrl) setIntVal(n);
    onChange?.(n);
    if (onRatingComplete) {
      if (completeRef.current) clearTimeout(completeRef.current);
      if (debounceMs > 0)
        completeRef.current = setTimeout(() => onRatingComplete(n), debounceMs);
      else onRatingComplete(n);
    }
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap,
        userSelect: "none",
        opacity: disabled ? 0.45 : 1,
        pointerEvents: disabled ? "none" : undefined,
        position: "relative",
      }}
      role="slider"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={count}
      aria-valuenow={cur}
      tabIndex={readOnly || disabled ? -1 : 0}
      onMouseLeave={() => !readOnly && !disabled && setHover(null)}
    >
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
          {confettiData.map((p) => (
            <span
              key={p.id}
              style={{
                position: "absolute",
                width: p.width,
                height: p.height,
                borderRadius: p.borderRadius,
                background: p.col,
                left: p.left,
                top: p.top,
                animation: p.animation,
              }}
            />
          ))}
        </span>
      )}
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          onClick={(e) => handleClick(e, index)}
          onMouseMove={(e) =>
            !readOnly && !disabled && setHover(getV(e, index))
          }
          style={{
            cursor: readOnly || disabled ? "default" : "pointer",
            width: sn,
            height: sn,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            animation:
              activeIdx === index && animation !== "none"
                ? `srx-${animation} 0.4s cubic-bezier(0.36,0.07,0.19,0.97)`
                : undefined,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width={sn}
            height={sn}
            aria-hidden
            style={glowCSS}
          >
            <path
              d={SP}
              fill={getColor(index)}
              stroke={t.stroke}
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
            fontSize: sn * 0.5,
            fontWeight: 600,
            color: filled,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {disp.toFixed(precision === 0.5 ? 1 : 0)}
        </span>
      )}
      {allowUndo && undoVisible && undoPrev !== null && (
        <span
          aria-live="polite"
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "#1e293b",
            border: `1px solid ${filled}40`,
            borderRadius: 10,
            padding: "6px 12px",
            fontSize: 11,
            fontWeight: 600,
            color: "#f1f5f9",
            whiteSpace: "nowrap",
            zIndex: 50,
            boxShadow: "0 4px 20px #00000040",
            animation: "srx-undo-in 0.2s ease",
          }}
        >
          <span style={{ color: "#94a3b8" }}>Was {undoPrev}★</span>
          <button
            onClick={() => {
              if (undoRef.current) clearTimeout(undoRef.current);
              if (!isCtrl) setIntVal(undoPrev!);
              onChange?.(undoPrev);
              onUndo?.(undoPrev);
              setUndoVisible(false);
              setUndoPrev(null);
            }}
            style={{
              background: filled + "20",
              border: `1px solid ${filled}40`,
              borderRadius: 6,
              color: filled,
              fontWeight: 700,
              fontSize: 10,
              padding: "2px 8px",
              cursor: "pointer",
            }}
          >
            Undo
          </button>
        </span>
      )}
    </span>
  );
}

// ── RatingBadge ────────────────────────────────────────────────────────────────
function RatingBadge({
  value = 0,
  count,
  theme = "gold",
  filledColor,
  size = "md",
  showCount = true,
  compact = false,
  pill = true,
  onClick,
  style = {},
}: RatingBadgeProps) {
  const t = TH[theme] ?? TH.gold;
  const color = filledColor ?? t.filled;
  const S: Record<string, { fs: number; ss: number; px: number; py: number }> =
    {
      xs: { fs: 10, ss: 10, px: 6, py: 2 },
      sm: { fs: 12, ss: 12, px: 8, py: 3 },
      md: { fs: 13, ss: 14, px: 10, py: 4 },
      lg: { fs: 15, ss: 16, px: 14, py: 6 },
    };
  const s = S[size ?? "md"] ?? S.md;
  const fmt = (n: number) =>
    n >= 1e6
      ? `${(n / 1e6).toFixed(1)}M`
      : n >= 1e3
        ? `${(n / 1e3).toFixed(1)}k`
        : n.toLocaleString();
  return (
    <span
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        paddingTop: s.py,
        paddingBottom: s.py,
        paddingLeft: s.px,
        paddingRight: s.px,
        borderRadius: pill ? 999 : 6,
        background: color + "18",
        border: `1px solid ${color}30`,
        cursor: onClick ? "pointer" : "default",
        fontWeight: 700,
        fontSize: s.fs,
        lineHeight: 1,
        userSelect: "none",
        ...style,
      }}
    >
      <svg viewBox="0 0 24 24" width={s.ss} height={s.ss} aria-hidden>
        <path d={SP} fill={color} stroke="none" />
      </svg>
      <span style={{ color }}>
        {typeof value === "number" ? value.toFixed(1) : value}
      </span>
      {!compact && showCount && count !== undefined && (
        <span style={{ color, opacity: 0.6, fontSize: s.fs * 0.88 }}>
          ({fmt(count)})
        </span>
      )}
    </span>
  );
}

// ── RatingDistribution ─────────────────────────────────────────────────────────
function RatingDistribution({
  data = {},
  total: tot,
  count = 5,
  theme = "gold",
  showCount = true,
  showPercent = false,
  onFilter,
  activeFilter = null,
  compact = false,
}: RatingDistributionProps) {
  const t = TH[theme ?? "gold"] ?? TH.gold;
  const total =
    tot ?? (Object.values(data) as number[]).reduce((s, v) => s + v, 0);
  const avg =
    total === 0
      ? 0
      : Array.from({ length: count }, (_, i) => i + 1).reduce(
          (s, i) => s + i * (data[i] || 0),
          0,
        ) / total;
  const rows = Array.from({ length: count }, (_, i) => count - i).map(
    (star) => ({
      star,
      cnt: data[star] || 0,
      pct: total > 0 ? ((data[star] || 0) / total) * 100 : 0,
    }),
  );
  const sz = compact ? 12 : 14;
  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: compact ? 5 : 7 }}
    >
      {!compact && total > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 8,
            marginBottom: 4,
          }}
        >
          <span
            style={{
              fontSize: 32,
              fontWeight: 900,
              lineHeight: 1,
              color: t.filled,
            }}
          >
            {avg.toFixed(1)}
          </span>
          <div>
            <StarRating
              value={avg}
              precision={0.5}
              readOnly
              size={13}
              theme={theme}
              gap={2}
            />
            <p style={{ margin: "2px 0 0", fontSize: 11, color: "#94a3b8" }}>
              {(total as number).toLocaleString()} ratings
            </p>
          </div>
        </div>
      )}
      {rows.map(({ star, cnt, pct }) => {
        const isActive = activeFilter === star,
          isDimmed = activeFilter !== null && !isActive;
        return (
          <div
            key={star}
            onClick={() => onFilter?.(isActive ? null : star)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: compact ? 5 : 7,
              cursor: onFilter ? "pointer" : "default",
              opacity: isDimmed ? 0.35 : 1,
              transition: "opacity 0.2s",
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                minWidth: 26,
                fontSize: 12,
                fontWeight: 600,
                color: isActive ? t.filled : "#94a3b8",
              }}
            >
              {star}
              <svg viewBox="0 0 24 24" width={sz} height={sz}>
                <path
                  d={SP}
                  fill={isActive ? t.filled : "#94a3b8"}
                  stroke="none"
                />
              </svg>
            </span>
            <div
              style={{
                flex: 1,
                height: compact ? 5 : 7,
                borderRadius: 999,
                background: t.empty,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${pct}%`,
                  background: isActive
                    ? t.filled
                    : `linear-gradient(to right,${t.filled},${t.filled}cc)`,
                  borderRadius: 999,
                  transition: "width 0.7s cubic-bezier(0.4,0,0.2,1)",
                }}
              />
            </div>
            <span
              style={{
                minWidth: 32,
                fontSize: 12,
                color: "#64748b",
                textAlign: "right",
              }}
            >
              {showPercent
                ? `${pct.toFixed(0)}%`
                : showCount
                  ? cnt.toLocaleString()
                  : null}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── RatingSummary ──────────────────────────────────────────────────────────────
function RatingSummary({
  average = 0,
  total = 0,
  distribution = {},
  reviews = [],
  maxReviews = 2,
  onWriteReview,
  theme = "gold",
  showReviews = false,
}: RatingSummaryProps) {
  const t = TH[theme ?? "gold"] ?? TH.gold;
  const [filter, setFilter] = useState<number | null>(null);
  const fmt = (n: number) =>
    n >= 1e3 ? `${(n / 1e3).toFixed(1)}k` : n.toLocaleString();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        <div style={{ textAlign: "center", flexShrink: 0 }}>
          <div
            style={{
              fontSize: 48,
              fontWeight: 900,
              lineHeight: 1,
              color: t.filled,
            }}
          >
            {average.toFixed(1)}
          </div>
          <div style={{ marginTop: 6 }}>
            <StarRating
              value={average}
              precision={0.5}
              readOnly
              size={17}
              theme={theme}
              gap={2}
            />
          </div>
          {total > 0 && (
            <div style={{ marginTop: 4, fontSize: 11, color: "#94a3b8" }}>
              {fmt(total)} reviews
            </div>
          )}
        </div>
        {Object.keys(distribution).length > 0 && (
          <div style={{ flex: 1, minWidth: 140 }}>
            <RatingDistribution
              data={distribution}
              total={total}
              theme={theme}
              showCount
              onFilter={setFilter}
              activeFilter={filter}
            />
          </div>
        )}
      </div>
      {onWriteReview && (
        <button
          onClick={onWriteReview}
          style={{
            alignSelf: "flex-start",
            padding: "8px 18px",
            borderRadius: 9,
            background: t.filled + "18",
            border: `1.5px solid ${t.filled}40`,
            color: t.filled,
            fontWeight: 700,
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          Write a review
        </button>
      )}
      {showReviews &&
        (reviews ?? []).slice(0, maxReviews).map((r: Review, i: number) => (
          <div
            key={i}
            style={{
              padding: "12px 14px",
              borderRadius: 12,
              background: "#0f172a",
              border: "1px solid #1e293b",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: t.filled + "28",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 800,
                  color: t.filled,
                  flexShrink: 0,
                }}
              >
                {(r.author ?? "?")[0].toUpperCase()}
              </span>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{ fontSize: 12, fontWeight: 700, color: "#f1f5f9" }}
                  >
                    {r.author ?? "Anonymous"}
                  </span>
                  {r.verified && (
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        color: "#34d399",
                        background: "#34d39918",
                        borderRadius: 999,
                        padding: "1px 6px",
                      }}
                    >
                      ✓
                    </span>
                  )}
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: 11,
                      color: "#475569",
                    }}
                  >
                    {r.date}
                  </span>
                </div>
                <StarRating
                  value={r.rating}
                  precision={0.5}
                  readOnly
                  size={11}
                  theme={theme}
                  gap={1}
                />
              </div>
            </div>
            {r.title && (
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#e2e8f0",
                }}
              >
                {r.title}
              </p>
            )}
            {r.text && (
              <p
                style={{
                  margin: 0,
                  fontSize: 11,
                  color: "#94a3b8",
                  lineHeight: 1.6,
                }}
              >
                {r.text}
              </p>
            )}
          </div>
        ))}
    </div>
  );
}

// ── RatingWall ─────────────────────────────────────────────────────────────────
function RatingWall({
  reviews = [],
  columns = 2,
  maxItems = 4,
  showMore = true,
  pageSize = 2,
  theme = "gold",
  onHelpful,
}: RatingWallProps) {
  const [visible, setVisible] = useState(maxItems ?? 4);
  const [helpIds, setHelpIds] = useState(new Set<string | number>());
  const RC: Record<number, string> = {
    1: "#ef4444",
    2: "#f97316",
    3: "#eab308",
    4: "#22c55e",
    5: "#10b981",
  };
  const shown = (reviews ?? []).slice(0, visible);
  if (shown.length === 0)
    return (
      <p style={{ color: "#64748b", textAlign: "center" }}>No reviews yet.</p>
    );
  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns},1fr)`,
          gap: 12,
        }}
      >
        {shown.map((r: Review, i: number) => {
          const rc = RC[Math.round(r.rating)] ?? "#FBBF24";
          const helped = r.id !== undefined && helpIds.has(r.id);
          return (
            <div
              key={r.id ?? i}
              style={{
                padding: 12,
                borderRadius: 12,
                border: "1px solid #1e293b",
                background: "#0f172a",
                display: "flex",
                flexDirection: "column",
                gap: 7,
              }}
            >
              <div
                style={{ display: "flex", alignItems: "flex-start", gap: 8 }}
              >
                <span
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: rc + "22",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 800,
                    color: rc,
                    flexShrink: 0,
                  }}
                >
                  {(r.author ?? "?")[0].toUpperCase()}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#f1f5f9",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {r.author}
                    </span>
                    {r.verified && (
                      <span
                        style={{
                          fontSize: 9,
                          color: "#34d399",
                          background: "#34d39918",
                          borderRadius: 999,
                          padding: "1px 5px",
                        }}
                      >
                        ✓
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      marginTop: 2,
                    }}
                  >
                    <StarRating
                      value={r.rating}
                      precision={0.5}
                      readOnly
                      size={11}
                      theme={theme}
                      gap={1}
                    />
                    <span style={{ fontSize: 10, color: "#475569" }}>
                      {r.date}
                    </span>
                  </div>
                </div>
                <span
                  style={{
                    flexShrink: 0,
                    width: 26,
                    height: 26,
                    borderRadius: 6,
                    background: rc + "18",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 800,
                    color: rc,
                  }}
                >
                  {r.rating}
                </span>
              </div>
              {r.title && (
                <p
                  style={{
                    margin: 0,
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#e2e8f0",
                  }}
                >
                  {r.title}
                </p>
              )}
              {r.text && (
                <p
                  style={{
                    margin: 0,
                    fontSize: 11,
                    color: "#94a3b8",
                    lineHeight: 1.6,
                    flex: 1,
                  }}
                >
                  {r.text}
                </p>
              )}
              {onHelpful && (
                <button
                  onClick={() => {
                    if (!helped) {
                      if (r.id !== undefined)
                        setHelpIds((s) => new Set([...s, r.id!]));
                      onHelpful(r);
                    }
                  }}
                  disabled={helped}
                  style={{
                    alignSelf: "flex-start",
                    padding: "3px 10px",
                    borderRadius: 7,
                    background: helped ? "#34d39918" : "transparent",
                    border: `1px solid ${helped ? "#34d39930" : "#1e293b"}`,
                    color: helped ? "#34d399" : "#64748b",
                    fontSize: 10,
                    fontWeight: 600,
                    cursor: helped ? "default" : "pointer",
                  }}
                >
                  {helped
                    ? "✓ Helpful"
                    : `👍 Helpful${r.helpful ? ` (${r.helpful})` : ""}`}
                </button>
              )}
            </div>
          );
        })}
      </div>
      {showMore && visible < reviews.length && (
        <div style={{ textAlign: "center", marginTop: 14 }}>
          <button
            onClick={() => setVisible((v: number) => v + (pageSize ?? 2))}
            style={{
              padding: "8px 20px",
              borderRadius: 9,
              background: TH[theme].filled + "18",
              border: `1.5px solid ${TH[theme].filled}30`,
              color: TH[theme].filled,
              fontWeight: 700,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            Load more ({reviews.length - visible} remaining)
          </button>
        </div>
      )}
    </div>
  );
}

// ── useRatingAnalytics ─────────────────────────────────────────────────────────
function useRatingAnalytics(
  ratings: number[] = [],
  { max = 5, positiveMin = 4, negativeMax = 2 } = {},
) {
  return useMemo(() => {
    if (!ratings.length)
      return {
        count: 0,
        average: 0,
        median: 0,
        mode: 0,
        stdDev: 0,
        nps: 0,
        trend: "stable",
        recentTrend: "stable",
        percentPositive: 0,
        percentNegative: 0,
        distribution: {},
      };
    const count = ratings.length;
    const dist: Record<number, number> = {};
    for (let i = 1; i <= max; i++) dist[i] = 0;
    for (const r of ratings) {
      const k = Math.round(r);
      if (k >= 1 && k <= max) dist[k]++;
    }
    const sum = ratings.reduce((a, b) => a + b, 0);
    const average = +(sum / count).toFixed(2);
    const sorted = [...ratings].sort((a, b) => a - b);
    const mid = Math.floor(count / 2);
    const median =
      count % 2 !== 0
        ? sorted[mid]
        : +((sorted[mid - 1] + sorted[mid]) / 2).toFixed(2);
    let mode = 0,
      maxF = 0;
    for (const [k, v] of Object.entries(dist)) {
      if ((v as number) > maxF) {
        maxF = v as number;
        mode = +k;
      }
    }
    const variance =
      ratings.reduce((acc, r) => acc + Math.pow(r - average, 2), 0) / count;
    const stdDev = +Math.sqrt(variance).toFixed(2);
    const positives = ratings.filter((r) => r >= positiveMin).length;
    const negatives = ratings.filter((r) => r <= negativeMax).length;
    const percentPositive = +((positives / count) * 100).toFixed(1);
    const percentNegative = +((negatives / count) * 100).toFixed(1);
    const promoters = ratings.filter((r) => r >= max).length;
    const detractors = ratings.filter((r) => r <= 2).length;
    const nps = Math.round(((promoters - detractors) / count) * 100);
    const half = Math.floor(count / 2);
    const avgFirst = half
      ? ratings.slice(0, half).reduce((a, b) => a + b, 0) / half
      : average;
    const avgSec = ratings.slice(half).length
      ? ratings.slice(half).reduce((a, b) => a + b, 0) /
        ratings.slice(half).length
      : average;
    const diff = avgSec - avgFirst;
    const trend: string =
      diff > 0.2 ? "improving" : diff < -0.2 ? "declining" : "stable";
    const slice = Math.max(1, Math.floor(count * 0.2));
    const recent = ratings.slice(-slice);
    const prevR = ratings.slice(-slice * 2, -slice);
    const avgR = recent.reduce((a, b) => a + b, 0) / recent.length;
    const avgP = prevR.length
      ? prevR.reduce((a, b) => a + b, 0) / prevR.length
      : avgR;
    const rDiff = avgR - avgP;
    const recentTrend: string =
      rDiff > 0.15 ? "improving" : rDiff < -0.15 ? "declining" : "stable";
    return {
      count,
      average,
      median,
      mode,
      stdDev,
      nps,
      trend,
      recentTrend,
      percentPositive,
      percentNegative,
      distribution: dist,
    };
  }, [ratings, max, positiveMin, negativeMax]);
}

// ── RatingPrompt ───────────────────────────────────────────────────────────────
function RatingPrompt({
  visible = false,
  message = "Enjoying the experience?",
  subMessage = "Your feedback helps us improve.",
  onRate,
  onDismiss,
  onLater,
  showLater = true,
  theme = "gold",
  count = 5,
  size = 34,
  placement = "bottom-right",
}: RatingPromptProps) {
  const t = TH[theme ?? "gold"] ?? TH.gold;
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const P: Record<string, React.CSSProperties> = {
    "bottom-right": { bottom: 24, right: 24 },
    "bottom-left": { bottom: 24, left: 24 },
    "bottom-center": { bottom: 24, left: "50%", transform: "translateX(-50%)" },
    center: { top: "50%", left: "50%", transform: "translate(-50%,-50%)" },
  };
  if (!visible) return null;
  return (
    <div
      role="dialog"
      style={{
        position: "fixed",
        zIndex: 9999,
        ...P[placement],
        minWidth: 260,
        maxWidth: 320,
        background: "#0f172a",
        border: `1px solid ${t.filled}30`,
        borderRadius: 18,
        padding: "18px 20px",
        boxShadow: `0 20px 60px #00000060`,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        animation: "srx-prompt-in 0.3s cubic-bezier(0.34,1.56,0.64,1)",
      }}
    >
      <button
        onClick={onDismiss}
        style={{
          position: "absolute",
          top: 10,
          right: 12,
          background: "none",
          border: "none",
          color: "#475569",
          fontSize: 17,
          cursor: "pointer",
          padding: "2px 6px",
          lineHeight: 1,
        }}
      >
        ×
      </button>
      {submitted ? (
        <div style={{ textAlign: "center", padding: "8px 0" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
          <p
            style={{
              margin: 0,
              fontWeight: 700,
              color: "#f1f5f9",
              fontSize: 14,
            }}
          >
            Thank you!
          </p>
          <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 12 }}>
            Your rating was submitted.
          </p>
        </div>
      ) : (
        <>
          <div style={{ paddingRight: 22 }}>
            <p
              style={{
                margin: 0,
                fontWeight: 800,
                fontSize: 14,
                color: "#f1f5f9",
              }}
            >
              {message}
            </p>
            {subMessage && (
              <p style={{ margin: "4px 0 0", fontSize: 12, color: "#64748b" }}>
                {subMessage}
              </p>
            )}
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <StarRating
              value={rating}
              onChange={setRating}
              count={count}
              size={size}
              theme={theme}
              animation="bounce"
            />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => {
                if (!rating) return;
                setSubmitted(true);
                onRate?.(rating);
                setTimeout(() => onDismiss?.(), 1800);
              }}
              disabled={!rating}
              style={{
                flex: 1,
                padding: "9px 0",
                borderRadius: 9,
                background: rating
                  ? `linear-gradient(135deg,${t.filled},${t.filled}cc)`
                  : "#1e293b",
                border: "none",
                color: rating ? "#fff" : "#475569",
                fontWeight: 700,
                fontSize: 13,
                cursor: rating ? "pointer" : "not-allowed",
                transition: "all 0.2s",
              }}
            >
              Submit
            </button>
            {showLater && (
              <button
                onClick={onLater ?? onDismiss}
                style={{
                  padding: "9px 12px",
                  borderRadius: 9,
                  background: "transparent",
                  border: "1px solid #1e293b",
                  color: "#64748b",
                  fontWeight: 600,
                  fontSize: 11,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Maybe later
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ── Demo helpers ───────────────────────────────────────────────────────────────
function Card({
  title,
  tag,
  tagColor = "#8b5cf6",
  children,
  code,
}: {
  title: string;
  tag: string;
  tagColor?: string;
  children: React.ReactNode;
  code: string;
}) {
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
            textTransform: "uppercase" as const,
            letterSpacing: "0.08em",
          }}
        >
          {tag}
        </span>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>
          {title}
        </span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap" as const }}>
        <div
          style={{
            flex: "1 1 200px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "22px 18px",
            minHeight: 80,
          }}
        >
          {children}
        </div>
        <div
          style={{
            flex: "2 1 260px",
            borderLeft: "1px solid #1e293b",
            position: "relative" as const,
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

function SH({ n, title }: { n: string; title: string }) {
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
          background: "linear-gradient(135deg,#6d28d9,#a855f7)",
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

// ── Sample data ────────────────────────────────────────────────────────────────
const DIST_DATA = { 5: 842, 4: 321, 3: 98, 2: 34, 1: 22 };
const SAMPLE_REVIEWS = [
  {
    id: 1,
    author: "Ahmed M.",
    rating: 5,
    title: "Absolutely love it!",
    text: "Best product this year. Quality exceeded expectations.",
    date: "May 2025",
    verified: true,
    helpful: 24,
  },
  {
    id: 2,
    author: "Sara K.",
    rating: 4,
    title: "Great value",
    text: "Really happy. Minor packaging issue but product itself is excellent.",
    date: "Apr 2025",
    verified: true,
    helpful: 12,
  },
  {
    id: 3,
    author: "Omar R.",
    rating: 5,
    title: "Highly recommend",
    text: "Fast shipping, exactly as described. Will order again.",
    date: "Apr 2025",
    verified: false,
    helpful: 8,
  },
  {
    id: 4,
    author: "Lena T.",
    rating: 3,
    title: "Good but not perfect",
    text: "Decent product. Expected a bit more from the premium tier.",
    date: "Mar 2025",
    verified: true,
    helpful: 5,
  },
  {
    id: 5,
    author: "Mina P.",
    rating: 5,
    title: "Perfect!",
    text: "10/10 — arrived early and works flawlessly.",
    date: "Mar 2025",
    verified: true,
    helpful: 19,
  },
  {
    id: 6,
    author: "Taha Z.",
    rating: 4,
    title: "Solid purchase",
    text: "Would buy again. Build quality feels premium.",
    date: "Feb 2025",
    verified: false,
    helpful: 3,
  },
];
const SAMPLE_RATINGS = [
  5, 5, 4, 5, 3, 4, 5, 4, 5, 2, 5, 4, 5, 3, 5, 4, 4, 5, 5, 5, 3, 4, 2, 5, 4, 5,
  5, 4, 3, 5,
];
const TREND_ICON: Record<string, string> = {
  improving: "📈",
  stable: "➡️",
  declining: "📉",
};
const TREND_COLOR: Record<string, string> = {
  improving: "#34d399",
  stable: "#94a3b8",
  declining: "#ef4444",
};

// ── Main ───────────────────────────────────────────────────────────────────────
export default function StarV5() {
  injectKf();

  const [loadingOn, setLoadingOn] = useState(false);
  const [undoVal, setUndoVal] = useState(3);
  const [promptOn, setPromptOn] = useState(false);
  const [completeLog, setCompleteLog] = useState<string[]>([]);

  const analytics = useRatingAnalytics(SAMPLE_RATINGS);

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        @media(max-width:500px){
          .v5-hero-h1 { font-size:30px !important; }
          .v5-stat-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>
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
            background: "linear-gradient(135deg,#0f172a,#1e1b4b)",
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
              background: "radial-gradient(ellipse,#7c3aed20,transparent 70%)",
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
                ["v5.0.0", "#fbbf24"],
                ["RatingBadge", "#34d399"],
                ["RatingSummary", "#f472b6"],
                ["RatingWall", "#60a5fa"],
                ["RatingPrompt", "#a78bfa"],
                ["Analytics", "#f97316"],
                ["Glow ✨", "#fbbf24"],
                ["Skeleton", "#94a3b8"],
                ["Undo", "#34d399"],
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
              className="v5-hero-h1"
              style={{
                fontSize: "clamp(30px,6vw,48px)",
                fontWeight: 900,
                margin: "0 0 8px",
                background: "linear-gradient(135deg,#fbbf24,#f97316,#a855f7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              v5 — The Complete Update
            </h1>
            <p
              style={{
                color: "#94a3b8",
                fontSize: "clamp(13px,2vw,15px)",
                marginBottom: 24,
              }}
            >
              10 components · 5 hooks · zero dependencies
            </p>
            <div
              style={{
                display: "inline-flex",
                gap: 20,
                flexWrap: "wrap",
                justifyContent: "center",
                background: "#ffffff08",
                border: "1px solid #ffffff12",
                borderRadius: 20,
                padding: "clamp(14px,4vw,22px) clamp(18px,5vw,36px)",
              }}
            >
              <StarRating
                defaultValue={4}
                count={5}
                size={36}
                theme="gold"
                glowEffect
                showValue
                animation="bounce"
              />
              <RatingBadge value={4.8} count={1247} theme="ocean" size="md" />
              <StarRating
                defaultValue={3}
                count={5}
                size={36}
                loading={loadingOn}
                theme="violet"
                showValue
              />
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px" }}>
          {/* 01 RatingBadge */}
          <SH n="01" title="RatingBadge" />
          <Card
            tag="New in v5"
            tagColor="#34d399"
            title="4 sizes — xs sm md lg"
            code={`import { RatingBadge } from "star-rating-x";

<RatingBadge value={4.8} count={1247} theme="gold" size="lg"/>
<RatingBadge value={4.3} count={521}  theme="ocean" size="md"/>
<RatingBadge value={3.9}              theme="fire"  size="sm" compact/>
<RatingBadge value={4.1} count={88}   theme="violet" size="xs"/>`}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                alignItems: "flex-start",
              }}
            >
              {(
                [
                  ["gold", "lg", 4.8, 1247, false],
                  ["ocean", "md", 4.3, 521, false],
                  ["fire", "sm", 3.9, undefined, true],
                  ["violet", "xs", 4.1, 88, false],
                ] as [
                  string,
                  "xs" | "sm" | "md" | "lg",
                  number,
                  number | undefined,
                  boolean,
                ][]
              ).map(([th, sz, v, cnt, cmp]) => (
                <RatingBadge
                  key={th}
                  value={v}
                  count={cnt}
                  theme={th}
                  size={sz}
                  compact={cmp}
                />
              ))}
            </div>
          </Card>

          {/* 02 RatingSummary */}
          <SH n="02" title="RatingSummary" />
          <Card
            tag="New in v5"
            tagColor="#f472b6"
            title="Amazon-style full review summary"
            code={`import { RatingSummary } from "star-rating-x";

<RatingSummary
  average={4.3}
  total={1317}
  distribution={{ 5:842, 4:321, 3:98, 2:34, 1:22 }}
  reviews={recentReviews}
  showReviews
  onWriteReview={() => openModal()}
  theme="gold"
/>`}
          >
            <div style={{ width: "100%" }}>
              <RatingSummary
                average={4.3}
                total={1317}
                distribution={DIST_DATA}
                reviews={SAMPLE_REVIEWS}
                showReviews
                maxReviews={2}
                onWriteReview={() => alert("Write review!")}
                theme="gold"
              />
            </div>
          </Card>

          {/* 03 RatingWall */}
          <SH n="03" title="RatingWall" />
          <Card
            tag="New in v5"
            tagColor="#60a5fa"
            title="Masonry grid with load-more"
            code={`import { RatingWall } from "star-rating-x";

<RatingWall
  reviews={reviews}
  columns={2}
  maxItems={4}
  showMore
  theme="gold"
  onHelpful={(r) => markHelpful(r.id)}
/>`}
          >
            <div style={{ width: "100%" }}>
              <RatingWall
                reviews={SAMPLE_REVIEWS}
                columns={2}
                maxItems={4}
                showMore
                pageSize={2}
                theme="gold"
                onHelpful={(r: Review) => console.log("Helpful:", r.id)}
              />
            </div>
          </Card>

          {/* 04 Analytics */}
          <SH n="04" title="useRatingAnalytics" />
          <Card
            tag="New in v5"
            tagColor="#f97316"
            title="NPS · trend · distribution · stdDev"
            code={`import { useRatingAnalytics } from "star-rating-x";

const stats = useRatingAnalytics(ratingsArray);
// stats.average         → 4.27
// stats.nps             → 73
// stats.trend           → "improving"
// stats.percentPositive → 77%`}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
                width: "100%",
              }}
              className="v5-stat-grid"
            >
              {(
                [
                  ["Average", `${analytics.average}/5`, "#fbbf24"],
                  ["Median", `${analytics.median}`, "#60a5fa"],
                  ["Mode", `${analytics.mode}⭐`, "#a78bfa"],
                  ["NPS", `${analytics.nps}`, "#34d399"],
                  [
                    "Trend",
                    `${TREND_ICON[analytics.trend as string]} ${analytics.trend}`,
                    TREND_COLOR[analytics.trend as string],
                  ],
                  ["Positive", `${analytics.percentPositive}%`, "#10b981"],
                ] as [string, string, string][]
              ).map(([label, val, color]) => (
                <div
                  key={label}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 10,
                    background: "#1e293b",
                    border: "1px solid #334155",
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {label}
                  </span>
                  <span style={{ fontSize: 15, fontWeight: 800, color }}>
                    {val}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* 05 Glow */}
          <SH n="05" title="glowEffect ✨" />
          <Card
            tag="New in v5"
            tagColor="#fbbf24"
            title="Drop-shadow glow around filled stars"
            code={`<StarRating
  glowEffect
  glowIntensity={0.6}
  value={rating}
  onChange={setRating}
  theme="gold"
  size={34}
/>`}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                alignItems: "flex-start",
              }}
            >
              {(
                [
                  ["gold", 0.4],
                  ["ocean", 0.6],
                  ["rose", 0.8],
                  ["violet", 0.5],
                ] as [string, number][]
              ).map(([th, gi]) => (
                <StarRating
                  key={th}
                  defaultValue={4}
                  count={5}
                  size={26}
                  theme={th}
                  glowEffect
                  glowIntensity={gi}
                  readOnly
                />
              ))}
            </div>
          </Card>

          {/* 06 Skeleton */}
          <SH n="06" title="Skeleton Loading" />
          <Card
            tag="New in v5"
            tagColor="#94a3b8"
            title="Shimmer placeholder while data loads"
            code={`<StarRating loading count={5} size={30} />

// Toggle based on data state:
<StarRating loading={isLoading} value={rating} />`}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                alignItems: "flex-start",
              }}
            >
              <StarRating loading count={5} size={26} />
              <StarRating loading count={5} size={20} />
              <button
                onClick={() => {
                  setLoadingOn(true);
                  setTimeout(() => setLoadingOn(false), 2000);
                }}
                style={{
                  padding: "6px 14px",
                  borderRadius: 8,
                  background: "#1e293b",
                  border: "1px solid #334155",
                  color: "#94a3b8",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Simulate 2s loading
              </button>
              <StarRating
                loading={loadingOn}
                defaultValue={4}
                count={5}
                size={26}
                theme="violet"
                showValue
              />
            </div>
          </Card>

          {/* 07 Undo */}
          <SH n="07" title="allowUndo" />
          <Card
            tag="New in v5"
            tagColor="#34d399"
            title="Undo toast after each rating change"
            code={`<StarRating
  value={rating}
  onChange={setRating}
  allowUndo
  undoTimeout={4000}
  onUndo={(prev) => console.log("Reverted to", prev)}
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
                value={undoVal}
                onChange={setUndoVal}
                count={5}
                size={32}
                theme="gold"
                allowUndo
                undoTimeout={4000}
                showValue
              />
              <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>
                Change your rating — undo toast appears
              </p>
            </div>
          </Card>

          {/* 08 onRatingComplete */}
          <SH n="08" title="onRatingComplete + debounce" />
          <Card
            tag="New in v5"
            tagColor="#ec4899"
            title="Fires after user stops changing"
            code={`<StarRating
  onRatingComplete={(v) => submitToAPI(v)}
  debounceMs={600}
  theme="rose"
/>`}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                width: "100%",
              }}
            >
              <StarRating
                defaultValue={0}
                count={5}
                size={28}
                theme="rose"
                debounceMs={600}
                onRatingComplete={(v: number) =>
                  setCompleteLog((l) => [
                    `✓ Submitted: ${v}★ at ${new Date().toLocaleTimeString()}`,
                    ...l.slice(0, 3),
                  ])
                }
                showValue
              />
              {completeLog.length === 0 && (
                <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>
                  Select a rating — fires 600ms after you stop
                </p>
              )}
              {completeLog.map((l, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 11,
                    color: "#34d399",
                    fontFamily: "monospace",
                  }}
                >
                  {l}
                </span>
              ))}
            </div>
          </Card>

          {/* 09 RatingPrompt */}
          <SH n="09" title="RatingPrompt" />
          <Card
            tag="New in v5"
            tagColor="#a78bfa"
            title="Smart popup — time · scroll · manual"
            code={`import { RatingPrompt } from "star-rating-x";

// Trigger after 5 seconds
<RatingPrompt
  trigger="time"
  delay={5000}
  message="Enjoying the app?"
  onRate={(v) => submitRating(v)}
  onDismiss={() => setShow(false)}
  placement="bottom-right"
  theme="gold"
/>`}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
              }}
            >
              <button
                onClick={() => setPromptOn((v) => !v)}
                style={{
                  padding: "10px 20px",
                  borderRadius: 10,
                  background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                  border: "none",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                {promptOn ? "Hide Prompt" : "Show Prompt 💬"}
              </button>
              <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>
                Supports: time · scroll · manual
              </p>
            </div>
          </Card>

          <RatingPrompt
            visible={promptOn}
            message="Enjoying star-rating-x?"
            subMessage="Give us a star on GitHub!"
            theme="gold"
            placement="bottom-right"
            onRate={(v: number) => {
              alert(`Thanks for ${v} stars! 🎉`);
              setPromptOn(false);
            }}
            onDismiss={() => setPromptOn(false)}
            onLater={() => setPromptOn(false)}
          />

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
                star-rating-x v5
              </p>
              <p style={{ fontSize: 12, color: "#475569", margin: "2px 0 0" }}>
                10 components · 5 hooks · MIT · Abdelrahman Ayman
              </p>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[
                ["Changelog", "/changelog", "#fbbf24"],
                ["npm", "https://npmjs.com/package/star-rating-x", "#f87171"],
                ["Demo", "https://star-rating-x-demo.vercel.app", "#a78bfa"],
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
    </>
  );
}
