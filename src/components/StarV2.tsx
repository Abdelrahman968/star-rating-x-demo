"use client";
import {
  useState,
  useEffect,
  useCallback,
  useId,
  forwardRef,
  ReactNode,
  CSSProperties,
  MouseEvent,
  KeyboardEvent,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type StarShape = "star" | "heart" | "circle" | "diamond" | "lightning";
type ThemeName =
  | "gold"
  | "fire"
  | "ocean"
  | "neon"
  | "rose"
  | "violet"
  | "sunset"
  | "mint";
type AnimationType = "bounce" | "pulse" | "wiggle" | "pop" | "none";

interface IconRenderContext {
  fill: number;
  fillColor: string;
  index: number;
  size: number;
  filled: string;
  empty: string;
}

interface CharacterRenderContext {
  fill: number;
  index: number;
  filled: string;
  empty: string;
}

interface RatingCategory {
  key: string;
  label: string;
}

// ─── Shapes / Themes ──────────────────────────────────────────────────────────

const SHAPE_PATHS: Record<StarShape, string> = {
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  heart:
    "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
  circle: "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z",
  diamond: "M12 2 L22 12 L12 22 L2 12 Z",
  lightning: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
};

const THEMES: Record<
  ThemeName,
  { filled: string; empty: string; stroke: string }
> = {
  gold: { filled: "#FBBF24", empty: "#E5E7EB", stroke: "#F59E0B" },
  fire: { filled: "#EF4444", empty: "#FEE2E2", stroke: "#B91C1C" },
  ocean: { filled: "#3B82F6", empty: "#DBEAFE", stroke: "#1D4ED8" },
  neon: { filled: "#A3E635", empty: "#1a1a1a", stroke: "#65A30D" },
  rose: { filled: "#EC4899", empty: "#FCE7F3", stroke: "#BE185D" },
  violet: { filled: "#8B5CF6", empty: "#EDE9FE", stroke: "#6D28D9" },
  sunset: { filled: "#F97316", empty: "#FFEDD5", stroke: "#C2410C" },
  mint: { filled: "#10B981", empty: "#D1FAE5", stroke: "#059669" },
};

// ─── StarRating Props ─────────────────────────────────────────────────────────

interface StarRatingProps {
  value?: number;
  defaultValue?: number;
  count?: number;
  precision?: 1 | 0.5;
  size?: number | string;
  gap?: number;
  shape?: StarShape;
  theme?: ThemeName;
  filledColor?: string;
  emptyColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  character?: string | ((ctx: CharacterRenderContext) => ReactNode);
  customIcon?: string | ((ctx: IconRenderContext) => ReactNode);
  mountAnimation?: boolean;
  mountDuration?: number;
  readOnly?: boolean;
  disabled?: boolean;
  allowClear?: boolean;
  showValue?: boolean;
  tooltips?: string[];
  animation?: AnimationType;
  direction?: "ltr" | "rtl";
  highlightSelected?: boolean;
  onChange?: (value: number) => void;
  onHoverChange?: (value: number | null) => void;
  label?: string;
  className?: string;
  style?: CSSProperties;
}

// ─── StarRating Component ─────────────────────────────────────────────────────

const StarRating = forwardRef<HTMLSpanElement, StarRatingProps>(
  function StarRating(
    {
      value: controlledValue,
      defaultValue = 0,
      count = 5,
      precision = 1,
      size = 32,
      gap = 6,
      shape = "star",
      theme = "gold",
      filledColor,
      emptyColor,
      strokeColor,
      strokeWidth = 1.5,
      character,
      customIcon,
      mountAnimation = false,
      mountDuration = 800,
      readOnly = false,
      disabled = false,
      allowClear = true,
      showValue = false,
      tooltips,
      animation = "bounce",
      direction = "ltr",
      highlightSelected = false,
      onChange,
      onHoverChange,
      label = "Rating",
      className = "",
      style = {},
    },
    ref,
  ) {
    const uid = useId();
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = useState<number>(defaultValue);
    const currentValue = isControlled
      ? (controlledValue as number)
      : internalValue;
    const [hoverValue, setHoverValue] = useState<number | null>(null);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    // mount animation
    const [animatedValue, setAnimatedValue] = useState<number | null>(
      mountAnimation ? 0 : null,
    );
    useEffect(() => {
      if (!mountAnimation) return;
      const target = currentValue;
      const steps = 30;
      const iv = mountDuration / steps;
      let step = 0;
      const id = setInterval(() => {
        step++;
        setAnimatedValue(+(target * (step / steps)).toFixed(2));
        if (step >= steps) {
          setAnimatedValue(target);
          clearInterval(id);
        }
      }, iv);
      return () => clearInterval(id);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const t = THEMES[theme] ?? THEMES.gold;
    const filled = filledColor ?? t.filled;
    const empty = emptyColor ?? t.empty;
    const stroke = strokeColor ?? t.stroke;
    const sizeNum =
      typeof size === "number" ? size : parseInt(size as string, 10);

    const snapValue = useCallback(
      (raw: number): number =>
        precision === 0.5 ? Math.round(raw * 2) / 2 : Math.round(raw),
      [precision],
    );

    const getVal = useCallback(
      (e: MouseEvent<HTMLSpanElement>, index: number): number => {
        if (precision === 1) return index + 1;
        const rect = e.currentTarget.getBoundingClientRect();
        return snapValue(
          index + (e.clientX - rect.left < rect.width / 2 ? 0.5 : 1),
        );
      },
      [precision, snapValue],
    );

    const onMove = useCallback(
      (e: MouseEvent<HTMLSpanElement>, i: number) => {
        if (readOnly || disabled) return;
        const v = getVal(e, i);
        setHoverValue(v);
        onHoverChange?.(v);
      },
      [readOnly, disabled, getVal, onHoverChange],
    );

    const onLeave = useCallback(() => {
      if (readOnly || disabled) return;
      setHoverValue(null);
      onHoverChange?.(null);
    }, [readOnly, disabled, onHoverChange]);

    const onClick = useCallback(
      (e: MouseEvent<HTMLSpanElement>, i: number) => {
        if (readOnly || disabled) return;
        const val = getVal(e, i);
        const next = allowClear && val === currentValue ? 0 : val;
        setActiveIndex(i);
        setTimeout(() => setActiveIndex(null), 500);
        if (!isControlled) setInternalValue(next);
        onChange?.(next);
      },
      [
        readOnly,
        disabled,
        getVal,
        allowClear,
        currentValue,
        isControlled,
        onChange,
      ],
    );

    const onKey = useCallback(
      (e: KeyboardEvent<HTMLSpanElement>) => {
        if (readOnly || disabled) return;
        let next = currentValue;
        if (e.key === "ArrowRight" || e.key === "ArrowUp")
          next = Math.min(count, currentValue + precision);
        else if (e.key === "ArrowLeft" || e.key === "ArrowDown")
          next = Math.max(0, currentValue - precision);
        else if (e.key === "Home") next = 0;
        else if (e.key === "End") next = count;
        else return;
        e.preventDefault();
        if (!isControlled) setInternalValue(next);
        onChange?.(next);
      },
      [
        readOnly,
        disabled,
        precision,
        currentValue,
        count,
        isControlled,
        onChange,
      ],
    );

    const displayValue =
      hoverValue ?? (animatedValue !== null ? animatedValue : currentValue);

    const getFill = (i: number): number => {
      const f = displayValue - i;
      if (f >= 1) return 1;
      if (f > 0 && precision === 0.5) return 0.5;
      return 0;
    };

    const renderIcon = (index: number): ReactNode => {
      const fill = getFill(index);
      const fillColor =
        fill === 0 ? empty : fill === 1 ? filled : `url(#${uid}-g${index})`;

      // 1. character (emoji / text / fn)
      if (character !== undefined) {
        const ch: ReactNode =
          typeof character === "function"
            ? character({ fill, index, filled, empty })
            : character;
        return (
          <span
            style={{
              fontSize: sizeNum,
              lineHeight: 1,
              width: sizeNum,
              height: sizeNum,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              filter: fill === 0 ? "grayscale(1) opacity(0.3)" : "none",
              transition: "filter 0.2s",
            }}
          >
            {ch}
          </span>
        );
      }

      // 2. customIcon (path string or fn)
      if (customIcon !== undefined) {
        if (typeof customIcon === "function") {
          return customIcon({
            fill,
            fillColor,
            index,
            size: sizeNum,
            filled,
            empty,
          });
        }
        return (
          <svg
            viewBox="0 0 24 24"
            width={sizeNum}
            height={sizeNum}
            aria-hidden
            focusable="false"
          >
            <path
              d={customIcon}
              fill={fillColor}
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
            />
          </svg>
        );
      }

      // 3. default built-in shape
      return (
        <svg
          viewBox="0 0 24 24"
          width={sizeNum}
          height={sizeNum}
          aria-hidden
          focusable="false"
        >
          <path
            d={SHAPE_PATHS[shape] ?? SHAPE_PATHS.star}
            fill={fillColor}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
        </svg>
      );
    };

    return (
      <span
        ref={ref}
        className={`srx-root ${className}`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          userSelect: "none",
          outline: "none",
          gap: `${gap}px`,
          flexDirection: direction === "rtl" ? "row-reverse" : "row",
          opacity: disabled ? 0.45 : 1,
          pointerEvents: disabled ? "none" : undefined,
          ...style,
        }}
        role="slider"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={count}
        aria-valuenow={currentValue}
        aria-valuetext={`${currentValue} out of ${count}`}
        aria-disabled={disabled}
        aria-readonly={readOnly}
        tabIndex={readOnly || disabled ? -1 : 0}
        onKeyDown={onKey}
        onMouseLeave={onLeave}
      >
        {/* gradient defs for half-star fills */}
        <svg width="0" height="0" aria-hidden style={{ position: "absolute" }}>
          <defs>
            {Array.from({ length: count }, (_, i) => (
              <linearGradient
                key={i}
                id={`${uid}-g${i}`}
                x1="0"
                x2="1"
                y1="0"
                y2="0"
              >
                <stop offset={`${getFill(i) * 100}%`} stopColor={filled} />
                <stop offset={`${getFill(i) * 100}%`} stopColor={empty} />
              </linearGradient>
            ))}
          </defs>
        </svg>

        {Array.from({ length: count }, (_, index) => {
          const isSelected =
            highlightSelected && index + 1 === Math.ceil(currentValue);
          const tip =
            tooltips?.[index] ?? `${index + 1} star${index !== 0 ? "s" : ""}`;
          return (
            <span
              key={index}
              title={tip}
              aria-label={tip}
              onClick={(e) => onClick(e, index)}
              onMouseMove={(e) => onMove(e, index)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: sizeNum,
                height: sizeNum,
                cursor: readOnly || disabled ? "default" : "pointer",
                position: "relative",
                transition: "transform 0.15s ease",
                animation:
                  activeIndex === index && animation !== "none"
                    ? `srx-${animation} 0.4s cubic-bezier(0.36,0.07,0.19,0.97)`
                    : undefined,
              }}
            >
              {isSelected && (
                <span
                  style={{
                    position: "absolute",
                    inset: -3,
                    borderRadius: "50%",
                    border: `2px solid ${filled}`,
                    opacity: 0.6,
                    pointerEvents: "none",
                  }}
                />
              )}
              {renderIcon(index)}
            </span>
          );
        })}

        {showValue && (
          <span
            aria-hidden
            style={{
              marginLeft: 8,
              fontVariantNumeric: "tabular-nums",
              fontSize: sizeNum * 0.5,
              lineHeight: 1,
              color: filled,
              fontWeight: 600,
              minWidth: "2.5ch",
            }}
          >
            {displayValue.toFixed(precision === 0.5 ? 1 : 0)}
          </span>
        )}
      </span>
    );
  },
);

// ─── RatingGroup Props ────────────────────────────────────────────────────────

interface RatingGroupProps extends Omit<
  StarRatingProps,
  "value" | "defaultValue" | "onChange" | "showValue"
> {
  categories: RatingCategory[];
  values?: Record<string, number>;
  defaultValues?: Record<string, number>;
  onChange?: (
    key: string,
    value: number,
    allValues: Record<string, number>,
  ) => void;
  showAverage?: boolean;
  showValues?: boolean;
  labelWidth?: number;
}

// ─── RatingGroup Component ────────────────────────────────────────────────────

const RatingGroup = forwardRef<HTMLDivElement, RatingGroupProps>(
  function RatingGroup(
    {
      categories = [],
      values: ctrl,
      defaultValues = {},
      onChange,
      showAverage = false,
      showValues = false,
      labelWidth = 130,
      size = 26,
      gap = 5,
      theme = "gold",
      ...starProps
    },
    ref,
  ) {
    const isControlled = ctrl !== undefined;
    const [internal, setInternal] = useState<Record<string, number>>(() => {
      const init: Record<string, number> = {};
      categories.forEach(({ key }) => {
        init[key] = defaultValues[key] ?? 0;
      });
      return init;
    });

    const values = isControlled ? (ctrl as Record<string, number>) : internal;

    const handleChange = (key: string, val: number) => {
      const next = { ...values, [key]: val };
      if (!isControlled) setInternal(next);
      onChange?.(key, val, next);
    };

    const avg = categories.length
      ? categories.reduce((s, { key }) => s + (values[key] ?? 0), 0) /
        categories.length
      : 0;

    const t = THEMES[theme as ThemeName] ?? THEMES.gold;
    void t; // suppress unused warning

    return (
      <div
        ref={ref}
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
      >
        {categories.map(({ key, label }) => (
          <div
            key={key}
            style={{ display: "flex", alignItems: "center", gap: 12 }}
          >
            <span
              style={{
                width: labelWidth,
                flexShrink: 0,
                fontSize: (typeof size === "number" ? size : 26) * 0.5,
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
              {...starProps}
            />
          </div>
        ))}

        {showAverage && categories.length > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              paddingTop: 8,
              borderTop: "1px solid #e5e7eb",
              marginTop: 4,
            }}
          >
            <span
              style={{
                width: labelWidth,
                flexShrink: 0,
                fontSize: (typeof size === "number" ? size : 26) * 0.5,
                fontWeight: 700,
              }}
            >
              Overall
            </span>
            <StarRating
              value={+avg.toFixed(1)}
              precision={0.5}
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
  },
);

// ─── inject keyframes once ────────────────────────────────────────────────────

let _keyframesInjected = false;
function injectKeyframes(): void {
  if (_keyframesInjected || typeof document === "undefined") return;
  _keyframesInjected = true;
  const s = document.createElement("style");
  s.textContent = `
    @keyframes srx-bounce  { 0%{transform:scale(1)} 30%{transform:scale(1.45)} 55%{transform:scale(.9)} 75%{transform:scale(1.15)} 100%{transform:scale(1)} }
    @keyframes srx-pulse   { 0%{transform:scale(1);opacity:1} 40%{transform:scale(1.3);opacity:.7} 100%{transform:scale(1);opacity:1} }
    @keyframes srx-wiggle  { 0%{transform:rotate(0)scale(1)} 20%{transform:rotate(-18deg)scale(1.2)} 40%{transform:rotate(14deg)scale(1.1)} 60%{transform:rotate(-10deg)} 80%{transform:rotate(6deg)} 100%{transform:rotate(0)scale(1)} }
    @keyframes srx-pop     { 0%{transform:scale(1)} 50%{transform:scale(1.6)} 100%{transform:scale(1)} }
  `;
  document.head.appendChild(s);
}

// ─── Demo helpers ─────────────────────────────────────────────────────────────

interface CardProps {
  title: string;
  tag: string;
  children: ReactNode;
  code: string;
}

function Card({ title, tag, children, code }: CardProps) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div
      style={{
        borderRadius: 20,
        border: "1px solid #1e293b",
        background: "#0f172a",
        overflow: "hidden",
        marginBottom: 20,
      }}
    >
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid #1e293b",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#64748b",
          }}
        >
          {tag}
        </span>
        <span style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9" }}>
          {title}
        </span>
      </div>
      <div
        style={{
          padding: "28px 24px",
          display: "flex",
          flexWrap: "wrap",
          gap: 32,
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            flex: "1 1 200px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 80,
          }}
        >
          {children}
        </div>
        <div style={{ flex: "2 1 300px", position: "relative" }}>
          <div style={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}>
            <button
              onClick={copy}
              style={{
                padding: "3px 12px",
                borderRadius: 8,
                background: "#1e293b",
                border: "1px solid #334155",
                color: copied ? "#4ade80" : "#94a3b8",
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {copied ? "✓ Copied" : "Copy"}
            </button>
          </div>
          <pre
            style={{
              background: "#020617",
              borderRadius: 12,
              padding: "16px",
              fontSize: 12,
              color: "#cbd5e1",
              overflowX: "auto",
              lineHeight: 1.7,
              margin: 0,
              fontFamily: "'Fira Code',monospace",
              border: "1px solid #1e293b",
            }}
          >
            {code}
          </pre>
        </div>
      </div>
    </div>
  );
}

interface SectionHeaderProps {
  number: string;
  title: string;
}

function SectionHeader({ number, title }: SectionHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        marginBottom: 20,
        marginTop: 40,
      }}
    >
      <span
        style={{
          width: 32,
          height: 32,
          borderRadius: 10,
          background: "linear-gradient(135deg,#6d28d9,#a855f7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 13,
          fontWeight: 800,
          color: "#fff",
          flexShrink: 0,
        }}
      >
        {number}
      </span>
      <h2
        style={{ fontSize: 20, fontWeight: 800, color: "#f1f5f9", margin: 0 }}
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

// ─── Main Page ────────────────────────────────────────────────────────────────

const EMOJIS = ["😡", "😕", "😐", "😊", "🤩"] as const;
const LABELS = ["Terrible", "Bad", "Okay", "Good", "Amazing"] as const;

export default function StarRatingShowcase() {
  injectKeyframes();

  const [emojiVal, setEmojiVal] = useState<number>(0);
  const [labelVal, setLabelVal] = useState<number>(0);
  const [customVal, setCustomVal] = useState<number>(3);
  const [customFnVal, setCustomFnVal] = useState<number>(4);
  const [mountKey, setMountKey] = useState<number>(0);
  const [groupVals, setGroupVals] = useState<Record<string, number>>({
    quality: 4,
    service: 3,
    value: 5,
    atmosphere: 4,
  });

  const handleGroupChange = (
    _key: string,
    _val: number,
    all: Record<string, number>,
  ) => setGroupVals(all);

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
      {/* HERO */}
      <div
        style={{
          background: "linear-gradient(135deg,#0f172a 0%,#1e1b4b 100%)",
          padding: "56px 24px 48px",
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
            width: 600,
            height: 300,
            background: "radial-gradient(ellipse,#7c3aed22,transparent 70%)",
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
              marginBottom: 16,
            }}
          >
            {(
              [
                ["npm install star-rating-x", "#a78bfa"],
                ["v2.0.0", "#34d399"],
                ["TypeScript", "#60a5fa"],
                ["Zero deps", "#f472b6"],
              ] as [string, string][]
            ).map(([text, color]) => (
              <span
                key={text}
                style={{
                  padding: "4px 14px",
                  borderRadius: 999,
                  background: color + "18",
                  color,
                  fontSize: 12,
                  fontWeight: 700,
                  border: `1px solid ${color}30`,
                }}
              >
                {text}
              </span>
            ))}
          </div>
          <h1
            style={{
              fontSize: 52,
              fontWeight: 900,
              margin: "0 0 8px",
              background: "linear-gradient(135deg,#fbbf24,#f97316)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            ⭐ star-rating-x
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 16, marginBottom: 32 }}>
            v2.0 · Custom Icons · Emoji Mode · Mount Animation · Group Rating
          </p>
          <div
            style={{
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
              background: "#ffffff08",
              border: "1px solid #ffffff14",
              borderRadius: 24,
              padding: "28px 48px",
            }}
          >
            <StarRating
              key={mountKey}
              defaultValue={4}
              count={5}
              size={48}
              theme="gold"
              animation="bounce"
              showValue
              mountAnimation
              mountDuration={900}
            />
            <p style={{ color: "#64748b", fontSize: 12, margin: 0 }}>
              Click · Hover · Keyboard ← →
            </p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px" }}>
        {/* 01 · CHARACTER / EMOJI */}
        <SectionHeader number="01" title="Character Mode — Emoji & Text" />

        <Card
          tag="New in v2"
          title="Emoji Rating"
          code={`<StarRating\n  character="😊"\n  count={5}\n  size={40}\n  value={rating}\n  onChange={setRating}\n/>`}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <StarRating
              character="😊"
              count={5}
              size={40}
              value={emojiVal}
              onChange={setEmojiVal}
            />
            <span style={{ fontSize: 12, color: "#64748b" }}>
              {emojiVal > 0
                ? `${EMOJIS[emojiVal - 1]} ${LABELS[emojiVal - 1]}`
                : "Not rated yet"}
            </span>
          </div>
        </Card>

        <Card
          tag="New in v2"
          title="Different Emoji per Star (render fn)"
          code={`const emojis = ["😡","😕","😐","😊","🤩"];\n\n<StarRating\n  character={({ index, fill }) =>\n    fill > 0 ? emojis[index] : "⬜"\n  }\n  count={5}\n  size={40}\n/>`}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <StarRating
              character={({ index, fill }: CharacterRenderContext) =>
                fill > 0 ? EMOJIS[index] : "⬜"
              }
              count={5}
              size={40}
              value={labelVal}
              onChange={setLabelVal}
            />
            <span style={{ fontSize: 13, color: "#fbbf24", fontWeight: 600 }}>
              {labelVal > 0
                ? `${LABELS[labelVal - 1]} ${EMOJIS[labelVal - 1]}`
                : "Hover over an emoji!"}
            </span>
          </div>
        </Card>

        <Card
          tag="New in v2"
          title="Text Characters"
          code={`<StarRating character="✦" theme="violet" defaultValue={4} readOnly />\n<StarRating character="A" theme="ocean"  defaultValue={3} readOnly />\n<StarRating character="♪" theme="rose"   defaultValue={5} readOnly />`}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <StarRating
              character="✦"
              defaultValue={4}
              count={5}
              size={34}
              theme="violet"
              readOnly
            />
            <StarRating
              character="A"
              defaultValue={3}
              count={5}
              size={34}
              theme="ocean"
              readOnly
            />
            <StarRating
              character="♪"
              defaultValue={5}
              count={5}
              size={34}
              theme="rose"
              readOnly
            />
          </div>
        </Card>

        {/* 02 · CUSTOM SVG */}
        <SectionHeader number="02" title="Custom SVG Icon" />

        <Card
          tag="New in v2"
          title="Custom SVG Path String"
          code={`const pinPath = "M12 2C8 2 4 6 4 10c0 5 8 12 8 12s8-7 8-12c0-4-4-8-8-8zm0 10a2 2 0 1 1 0-4 2 2 0 0 1 0 4z";\n\n<StarRating\n  customIcon={pinPath}\n  theme="fire"\n  value={rating}\n  onChange={setRating}\n/>`}
        >
          <StarRating
            customIcon="M12 2C8 2 4 6 4 10c0 5 8 12 8 12s8-7 8-12c0-4-4-8-8-8zm0 10a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"
            theme="fire"
            count={5}
            size={34}
            value={customVal}
            onChange={setCustomVal}
          />
        </Card>

        <Card
          tag="New in v2"
          title="Custom Render Function (full control)"
          code={`<StarRating\n  customIcon={({ fill, fillColor, size }) => (\n    <svg viewBox="0 0 24 24" width={size} height={size}>\n      <circle cx="12" cy="12" r="10" fill={fillColor} />\n      <text x="12" y="16" textAnchor="middle"\n        fontSize="10" fill="#fff">\n        {fill > 0 ? "★" : "☆"}\n      </text>\n    </svg>\n  )}\n  theme="ocean"\n/>`}
        >
          <StarRating
            customIcon={({ fill, fillColor, size: s }: IconRenderContext) => (
              <svg viewBox="0 0 24 24" width={s} height={s}>
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  fill={fillColor}
                  stroke="#1D4ED8"
                  strokeWidth={1.5}
                />
                <text
                  x="12"
                  y="16"
                  textAnchor="middle"
                  fontSize="10"
                  fill="#fff"
                  fontWeight="bold"
                >
                  {fill > 0 ? "★" : "☆"}
                </text>
              </svg>
            )}
            count={5}
            size={38}
            theme="ocean"
            value={customFnVal}
            onChange={setCustomFnVal}
          />
        </Card>

        {/* 03 · MOUNT ANIMATION */}
        <SectionHeader number="03" title="Mount Animation (Count-up)" />

        <Card
          tag="New in v2"
          title="Stars fill up on first render"
          code={`<StarRating\n  value={4}\n  mountAnimation\n  mountDuration={800}\n  readOnly\n  showValue\n  theme="sunset"\n/>`}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            <StarRating
              key={mountKey}
              value={4}
              mountAnimation
              mountDuration={900}
              readOnly
              showValue
              theme="sunset"
              size={36}
            />
            <button
              onClick={() => setMountKey((k) => k + 1)}
              style={{
                padding: "8px 20px",
                borderRadius: 10,
                background: "linear-gradient(135deg,#f97316,#ef4444)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 13,
                border: "none",
                cursor: "pointer",
              }}
            >
              ▶ Replay Animation
            </button>
          </div>
        </Card>

        <Card
          tag="New in v2"
          title="Different durations"
          code={`<StarRating value={5} mountAnimation mountDuration={400}  theme="mint"   readOnly />\n<StarRating value={4} mountAnimation mountDuration={1000} theme="ocean"  readOnly />\n<StarRating value={3} mountAnimation mountDuration={1600} theme="rose"   readOnly />`}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {(
              [
                ["mint", 5, 400],
                ["ocean", 4, 1000],
                ["rose", 3, 1600],
              ] as [ThemeName, number, number][]
            ).map(([th, v, dur]) => (
              <div
                key={`${th}-${mountKey}`}
                style={{ display: "flex", alignItems: "center", gap: 10 }}
              >
                <span
                  style={{
                    width: 50,
                    fontSize: 11,
                    color: "#64748b",
                    fontFamily: "monospace",
                  }}
                >
                  {dur}ms
                </span>
                <StarRating
                  key={`${th}-${mountKey}`}
                  value={v}
                  mountAnimation
                  mountDuration={dur}
                  readOnly
                  theme={th}
                  size={22}
                />
              </div>
            ))}
          </div>
        </Card>

        {/* 04 · GROUP RATING */}
        <SectionHeader number="04" title="Group Rating — Multiple Categories" />

        <Card
          tag="New in v2"
          title="Restaurant Review"
          code={`import { RatingGroup } from "star-rating-x";\n\n<RatingGroup\n  categories={[\n    { key: "quality",    label: "Food Quality" },\n    { key: "service",    label: "Service" },\n    { key: "value",      label: "Value" },\n    { key: "atmosphere", label: "Atmosphere" },\n  ]}\n  values={ratings}\n  onChange={(key, val, all) => setRatings(all)}\n  showAverage\n  showValues\n  theme="gold"\n/>`}
        >
          <div style={{ width: "100%" }}>
            <RatingGroup
              categories={[
                { key: "quality", label: "Food Quality" },
                { key: "service", label: "Service" },
                { key: "value", label: "Value" },
                { key: "atmosphere", label: "Atmosphere" },
              ]}
              values={groupVals}
              onChange={handleGroupChange}
              showAverage
              showValues
              theme="gold"
              size={24}
            />
          </div>
        </Card>

        <Card
          tag="New in v2"
          title="Product Review — Read Only"
          code={`<RatingGroup\n  categories={[\n    { key: "display",  label: "Display" },\n    { key: "battery",  label: "Battery" },\n    { key: "camera",   label: "Camera" },\n    { key: "software", label: "Software" },\n  ]}\n  defaultValues={{ display:5, battery:4, camera:5, software:3 }}\n  showAverage\n  readOnly\n  theme="ocean"\n/>`}
        >
          <RatingGroup
            categories={[
              { key: "display", label: "Display" },
              { key: "battery", label: "Battery" },
              { key: "camera", label: "Camera" },
              { key: "software", label: "Software" },
            ]}
            defaultValues={{ display: 5, battery: 4, camera: 5, software: 3 }}
            showAverage
            readOnly
            theme="ocean"
            size={22}
          />
        </Card>

        {/* footer */}
        <div
          style={{
            borderTop: "1px solid #1e293b",
            paddingTop: 32,
            marginTop: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <p style={{ fontWeight: 800, color: "#f1f5f9", margin: 0 }}>
              star-rating-x v2.0
            </p>
            <p style={{ fontSize: 12, color: "#475569", margin: "2px 0 0" }}>
              MIT · Abdelrahman Ayman
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {(
              [
                ["npm", "#f87171", "https://npmjs.com/package/star-rating-x"],
                [
                  "GitHub",
                  "#94a3b8",
                  "https://github.com/Abdelrahman968/star-rating-x",
                ],
              ] as [string, string, string][]
            ).map(([lbl, color, href]) => (
              <a
                key={lbl}
                href={href}
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: "8px 18px",
                  borderRadius: 10,
                  background: color + "18",
                  border: `1px solid ${color}30`,
                  color,
                  fontSize: 12,
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                {lbl}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export { StarRating, RatingGroup };
export type {
  StarRatingProps,
  RatingGroupProps,
  RatingCategory,
  StarShape,
  ThemeName,
  AnimationType,
  IconRenderContext,
  CharacterRenderContext,
};
