"use client";

import { useState } from "react";

// ── Inlined mini-library (self-contained, no npm needed in demo) ────────────

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
};

interface StarRatingProps {
  value?: number;
  defaultValue?: number;
  count?: number;
  precision?: number;
  size?: number;
  gap?: number;
  theme?: string;
  readOnly?: boolean;
  showValue?: boolean;
  onChange?: (value: number) => void;
  onHoverChange?: (value: number | null) => void;
}

function StarRating({
  value = 0,
  defaultValue = 0,
  count = 5,
  precision = 1,
  size = 28,
  gap = 5,
  theme = "gold",
  readOnly = false,
  showValue = false,
  onChange,
  onHoverChange,
}: StarRatingProps) {
  const actualValue = value || defaultValue;
  const [hover, setHover] = useState<number | null>(null);
  const t = THEMES[theme] ?? THEMES.gold;
  const disp = hover ?? actualValue;
  const getFill = (i: number) => {
    const f = disp - i;
    return f >= 1 ? 1 : f > 0 && precision === 0.5 ? 0.5 : 0;
  };
  const getV = (e: React.MouseEvent<HTMLSpanElement>, i: number) => {
    if (precision === 1) return i + 1;
    const r = e.currentTarget.getBoundingClientRect();
    return (
      Math.round((i + (e.clientX - r.left < r.width / 2 ? 0.5 : 1)) * 2) / 2
    );
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
      onMouseLeave={() => {
        if (!readOnly) {
          setHover(null);
          onHoverChange?.(null);
        }
      }}
    >
      {Array.from({ length: count }, (_, i) => {
        const fill = getFill(i);
        const fc =
          fill === 0 ? t.empty : fill === 1 ? t.filled : t.filled + "88";
        return (
          <span
            key={i}
            onClick={(e) =>
              !readOnly &&
              onChange?.(getV(e, i))
            }
            onMouseMove={(e) => {
              if (!readOnly) {
                const v = getV(e, i);
                setHover(v);
                onHoverChange?.(v);
              }
            }}
            style={{
              cursor: readOnly ? "default" : "pointer",
              width: size,
              height: size,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden>
              <path
                d={STAR_PATH}
                fill={fc}
                stroke={t.stroke}
                strokeWidth={1.5}
                strokeLinejoin="round"
              />
            </svg>
          </span>
        );
      })}
      {showValue && (
        <span
          style={{
            marginLeft: 8,
            fontSize: size * 0.5,
            fontWeight: 600,
            color: t.filled,
          }}
        >
          {disp}
        </span>
      )}
    </span>
  );
}

interface RatingDistributionProps {
  data?: Record<number, number>;
  count?: number;
  theme?: string;
  showCount?: boolean;
  onFilter?: (value: number | null) => void;
  activeFilter?: number | null;
}

function RatingDistribution({
  data = {},
  count = 5,
  theme = "gold",
  showCount = true,
  onFilter,
  activeFilter,
}: RatingDistributionProps) {
  const t = THEMES[theme] ?? THEMES.gold;
  const total = Object.values(data).reduce(
    (s: number, v: number) => s + v,
    0,
  );
  const avg =
    total === 0
      ? 0
      : Array.from({ length: count }, (_, i) => i + 1).reduce(
          (s, i) => s + i * (data[i] || 0),
          0,
        ) / total;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      {!onFilter && total > 0 && (
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
              color: t.filled,
              lineHeight: 1,
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
              {(total as number).toLocaleString()} reviews
            </p>
          </div>
        </div>
      )}
      {Array.from({ length: count }, (_, i) => count - i).map((star) => {
        const cnt = data[star] || 0,
          pct = total > 0 ? (cnt / total) * 100 : 0;
        const isActive = activeFilter === star,
          isDimmed = activeFilter !== null && !isActive;
        return (
          <div
            key={star}
            onClick={() => onFilter?.(isActive ? null : star)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
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
              <svg viewBox="0 0 24 24" width={12} height={12}>
                <path
                  d={STAR_PATH}
                  fill={isActive ? t.filled : "#94a3b8"}
                  stroke="none"
                />
              </svg>
            </span>
            <div
              style={{
                flex: 1,
                height: 7,
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
              {showCount ? cnt.toLocaleString() : `${pct.toFixed(0)}%`}
            </span>
          </div>
        );
      })}
    </div>
  );
}

interface UseRatingFieldProps {
  required?: boolean;
  minValue?: number;
  requiredMessage?: string;
  minMessage?: string;
  onChange?: (value: number) => void;
}

function useRatingField({
  required = false,
  minValue = 0,
  requiredMessage = "A rating is required.",
  minMessage,
  onChange: ext,
}: UseRatingFieldProps = {}) {
  const [value, setValue] = useState(0);
  const [touched, setTouched] = useState(false);
  const run = (v: number) => {
    if (required && v === 0) return requiredMessage;
    if (minValue > 0 && v < minValue)
      return (
        minMessage ??
        `At least ${minValue} star${minValue !== 1 ? "s" : ""} required.`
      );
    return null;
  };
  const error = run(value),
    isValid = !error,
    isDirty = value !== 0;
  const handleChange = (v: number) => {
    setValue(v);
    setTouched(true);
    ext?.(v);
  };
  const handleBlur = () => setTouched(true);
  const reset = () => {
    setValue(0);
    setTouched(false);
  };
  return {
    value,
    error,
    touched,
    isDirty,
    isValid,
    showError: touched && !!error,
    errorMessage: touched ? error : null,
    field: { value, onChange: handleChange, onBlur: handleBlur },
    reset,
  };
}

// ── Demo helpers ───────────────────────────────────────────────────────────────
interface CardProps {
  title: string;
  tag: string;
  tagColor?: string;
  children: React.ReactNode;
  code: string;
}

function Card({ title, tag, tagColor = "#f97316", children, code }: CardProps) {
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
          background: "linear-gradient(135deg,#f97316,#ef4444)",
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

const DIST_DATA = { 5: 312, 4: 128, 3: 45, 2: 18, 1: 9 };

export default function StarV3() {
  const [distFilter, setDistFilter] = useState<number | null>(null);
  const [tipVal, setTipVal] = useState(3);
  const [tipHover, setTipHover] = useState<number | null>(null);
  const TIPS = ["Terrible 😡", "Bad 😕", "Okay 😐", "Good 😊", "Amazing! 🤩"];
  const rating1 = useRatingField({ required: true });
  const rating2 = useRatingField({
    required: true,
    minValue: 3,
    minMessage: "Must be at least 3 stars.",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    rating1.field.onBlur();
    rating2.field.onBlur();
    if (rating1.isValid && rating2.isValid) setSubmitted(true);
  };

  return (
    <>
      <style>{`
        * { box-sizing:border-box; }
        @media(max-width:500px){ .v3-code pre { font-size:10px !important; } }
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
            background: "linear-gradient(135deg,#0f172a,#1c1010)",
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
              background: "radial-gradient(ellipse,#f9731620,transparent 70%)",
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
                ["v3.0.0", "#f97316"],
                ["StarRatingInput", "#34d399"],
                ["RHF + Zod", "#60a5fa"],
                ["RatingDistribution", "#fbbf24"],
                ["useRatingField", "#a78bfa"],
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
                background: "linear-gradient(135deg,#f97316,#ef4444)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              v3 — Form Integration
            </h1>
            <p
              style={{
                color: "#94a3b8",
                fontSize: "clamp(13px,2vw,15px)",
                marginBottom: 28,
              }}
            >
              StarRatingInput · StarRatingTooltip · RatingDistribution ·
              useRatingField
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
                padding: "clamp(16px,4vw,22px) clamp(20px,6vw,40px)",
              }}
            >
              <StarRating
                defaultValue={4}
                count={5}
                size={36}
                theme="fire"
                showValue
              />
              <StarRating
                defaultValue={3}
                count={5}
                size={36}
                theme="ocean"
                showValue
                precision={0.5}
              />
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px" }}>
          {/* 01 StarRatingInput */}
          <SH n="01" title="StarRatingInput — Form Field" />

          <Card
            tag="v3"
            title="Label + helper text"
            code={`import { StarRatingInput } from "star-rating-x";

<StarRatingInput
  label="Rate your experience"
  helperText="Your feedback helps us improve"
  required
  theme="gold"
/>`}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                width: "100%",
              }}
            >
              <label
                style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}
              >
                Rate your experience <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <StarRating count={5} size={26} theme="gold" />
              <span style={{ fontSize: 12, color: "#64748b" }}>
                Your feedback helps us improve
              </span>
            </div>
          </Card>

          <Card
            tag="v3"
            title="Error state validation"
            code={`<StarRatingInput
  label="Product quality"
  required
  errorMessage="Please leave a rating."
  theme="fire"
/>`}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                width: "100%",
              }}
            >
              <label
                style={{ fontSize: 13, fontWeight: 600, color: "#ef4444" }}
              >
                Product quality <span>*</span>
              </label>
              <div
                style={{
                  outline: "2px solid #ef444440",
                  borderRadius: 8,
                  padding: "4px 6px",
                  display: "inline-flex",
                }}
              >
                <StarRating count={5} size={26} theme="fire" />
              </div>
              <span
                style={{
                  fontSize: 12,
                  color: "#ef4444",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <svg viewBox="0 0 24 24" width={13} height={13}>
                  <circle cx="12" cy="12" r="10" fill="#ef4444" />
                  <path
                    d="M12 8v4M12 16h.01"
                    stroke="#fff"
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                </svg>
                Please leave a rating.
              </span>
            </div>
          </Card>

          {/* 02 useRatingField */}
          <SH n="02" title="useRatingField — Standalone Validation" />

          <Card
            tag="v3"
            title="Two validated fields in a form"
            code={`const r1 = useRatingField({ required: true });
const r2 = useRatingField({ required: true, minValue: 3 });

<form onSubmit={handleSubmit}>
  <StarRatingInput
    {...r1.field}
    label="Overall"
    required
    errorMessage={r1.errorMessage}
  />
  <StarRatingInput
    {...r2.field}
    label="Would recommend?"
    required
    helperText="Min 3 stars"
    errorMessage={r2.errorMessage}
  />
  <button type="submit">Submit</button>
</form>`}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              {submitted ? (
                <div
                  style={{
                    padding: "14px 18px",
                    borderRadius: 12,
                    background: "#10b98118",
                    border: "1px solid #10b98128",
                    color: "#10b981",
                    fontWeight: 700,
                    textAlign: "center",
                  }}
                >
                  ✅ Submitted! {rating1.value}★ & {rating2.value}★
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  {[
                    { r: rating1, label: "Overall experience", theme: "gold" },
                    { r: rating2, label: "Would recommend?", theme: "ocean" },
                  ].map(({ r, label, theme }) => (
                    <div
                      key={label}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 5,
                      }}
                    >
                      <label
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: r.showError ? "#ef4444" : "#f1f5f9",
                        }}
                      >
                        {label} *
                      </label>
                      <StarRating
                        value={r.value}
                        onChange={r.field.onChange}
                        count={5}
                        size={24}
                        theme={theme}
                      />
                      {r.showError && (
                        <span style={{ fontSize: 11, color: "#ef4444" }}>
                          ⚠ {r.errorMessage}
                        </span>
                      )}
                      {!r.showError && r.value > 0 && (
                        <span style={{ fontSize: 11, color: "#34d399" }}>
                          ✓ {r.value} stars
                        </span>
                      )}
                    </div>
                  ))}
                  <button
                    type="submit"
                    style={{
                      padding: "9px 20px",
                      borderRadius: 10,
                      background: "linear-gradient(135deg,#f97316,#ef4444)",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: 13,
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Submit Review
                  </button>
                </form>
              )}
              {submitted && (
                <button
                  onClick={() => {
                    setSubmitted(false);
                    rating1.reset();
                    rating2.reset();
                  }}
                  style={{
                    padding: "7px 16px",
                    borderRadius: 8,
                    background: "#1e293b",
                    border: "1px solid #334155",
                    color: "#94a3b8",
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Reset
                </button>
              )}
            </div>
          </Card>

          {/* 03 RHF */}
          <SH n="03" title="React Hook Form Integration" />

          <Card
            tag="RHF"
            tagColor="#60a5fa"
            title="Controller + Zod pattern"
            code={`import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { StarRatingInput } from "star-rating-x";

const schema = z.object({
  rating: z.number().min(1,"Select at least 1 star"),
});

const { control } = useForm({
  resolver: zodResolver(schema),
  defaultValues: { rating: 0 },
});

<Controller
  name="rating"
  control={control}
  render={({ field, fieldState }) => (
    <StarRatingInput
      {...field}
      label="Product rating"
      required
      errorMessage={fieldState.error?.message}
    />
  )}
/>`}
          >
            <div
              style={{
                width: "100%",
                padding: "12px 14px",
                background: "#020617",
                borderRadius: 10,
                border: "1px solid #1e293b",
              }}
            >
              <pre
                style={{
                  margin: 0,
                  fontSize: 11,
                  color: "#94a3b8",
                  lineHeight: 1.8,
                  fontFamily: "'Fira Code',monospace",
                }}
              >{`// Zod schema
z.object({
  rating: z.number()
    .min(1,"Select 1+ star"),
  quality: z.number()
    .min(3,"Quality ≥ 3 stars"),
})`}</pre>
            </div>
          </Card>

          {/* 04 Tooltip */}
          <SH n="04" title="StarRatingTooltip — Popup on Hover" />

          <Card
            tag="v3"
            title="Rich tooltip with custom renderer"
            code={`import { StarRatingTooltip } from "star-rating-x";

const labels = ["Terrible 😡","Bad 😕","Okay 😐","Good 😊","Amazing! 🤩"];

<StarRatingTooltip
  tooltips={labels}
  tooltipRenderer={({ value, label }) => (
    <span><strong>{value}★</strong> — {label}</span>
  )}
  theme="gold"
  size={34}
/>`}
          >
            <div style={{ position: "relative", paddingTop: 40 }}>
              {tipHover !== null && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "calc(100% - 32px)",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#1e293b",
                    color: "#f1f5f9",
                    borderRadius: 8,
                    padding: "6px 12px",
                    fontSize: 12,
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    zIndex: 10,
                    boxShadow: "0 4px 16px #00000040",
                    border: `1px solid #FBBF2440`,
                  }}
                >
                  <strong>{tipHover}★</strong> — {TIPS[tipHover - 1]}
                  <span
                    style={{
                      position: "absolute",
                      bottom: -5,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 0,
                      height: 0,
                      borderLeft: "5px solid transparent",
                      borderRight: "5px solid transparent",
                      borderTop: "5px solid #1e293b",
                    }}
                  />
                </div>
              )}
              <StarRating
                value={tipVal}
                onChange={setTipVal}
                onHoverChange={setTipHover}
                count={5}
                size={34}
                theme="gold"
              />
            </div>
          </Card>

          {/* 05 Distribution */}
          <SH n="05" title="RatingDistribution — Bar Chart" />

          <Card
            tag="v3"
            title="Clickable filter rows"
            code={`import { RatingDistribution } from "star-rating-x";

const data = { 5:312, 4:128, 3:45, 2:18, 1:9 };

<RatingDistribution
  data={data}
  theme="gold"
  showCount
  onFilter={(star) => setFilter(star)}
  activeFilter={filter}
/>`}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <RatingDistribution
                data={DIST_DATA}
                theme="gold"
                showCount
                onFilter={setDistFilter}
                activeFilter={distFilter}
              />
              <p
                style={{
                  fontSize: 12,
                  color: "#64748b",
                  margin: 0,
                  textAlign: "center",
                }}
              >
                {distFilter
                  ? `Showing ${distFilter}★ reviews · click again to clear`
                  : "Click a row to filter"}
              </p>
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
                star-rating-x v3
              </p>
              <p style={{ fontSize: 12, color: "#475569", margin: "2px 0 0" }}>
                MIT · Abdelrahman Ayman
              </p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {[
                ["v4 →", "/v4", "#f472b6"],
                ["npm", "https://npmjs.com/package/star-rating-x", "#f87171"],
                [
                  "GitHub",
                  "https://github.com/Abdelrahman968/star-rating-x",
                  "#94a3b8",
                ],
              ].map(([l, h, c]) => (
                <a
                  key={l}
                  href={h as string}
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
