"use client";

import { useState } from "react";
import { StarRating, useRating } from "star-rating-x";
import "star-rating-x/styles.css";

// ─── tiny helpers ──────────────────────────────────────────────────────────────

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div className="relative rounded-xl overflow-hidden border border-white/10 bg-[#0d1117]">
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
          <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <span className="w-3 h-3 rounded-full bg-[#28CA41]" />
        </div>
        <button
          onClick={copy}
          className="text-xs font-medium text-slate-400 hover:text-white transition-colors px-2 py-1 rounded-md hover:bg-white/10"
        >
          {copied ? "✓ Copied!" : "Copy"}
        </button>
      </div>
      <pre className="p-4 text-sm font-mono text-slate-300 overflow-x-auto leading-relaxed whitespace-pre">
        {code}
      </pre>
    </div>
  );
}

function SectionTitle({
  tag,
  children,
}: {
  tag: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <span className="inline-block text-xs font-bold tracking-[0.18em] uppercase text-amber-400 mb-2">
        {tag}
      </span>
      <h2 className="text-2xl font-bold text-white">{children}</h2>
    </div>
  );
}

function ExampleCard({
  title,
  description,
  preview,
  code,
}: {
  title: string;
  description: string;
  preview: React.ReactNode;
  code: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
      <div className="p-6 border-b border-white/10">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">
          {title}
        </p>
        <p className="text-sm text-slate-400">{description}</p>
      </div>
      <div className="flex flex-col md:flex-row">
        {/* Preview */}
        <div className="flex-1 flex items-center justify-center p-8 bg-white/[0.02] min-h-[100px]">
          {preview}
        </div>
        {/* Code */}
        <div className="flex-1 border-t md:border-t-0 md:border-l border-white/10">
          <CodeBlock code={code} />
        </div>
      </div>
    </div>
  );
}

// ─── Pill badge ───────────────────────────────────────────────────────────────
function Pill({
  children,
  color = "amber",
}: {
  children: React.ReactNode;
  color?: string;
}) {
  const colors: Record<string, string> = {
    amber: "bg-amber-400/10 text-amber-400 border-amber-400/20",
    blue: "bg-blue-400/10  text-blue-400  border-blue-400/20",
    green: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
    pink: "bg-pink-400/10  text-pink-400  border-pink-400/20",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${colors[color] ?? colors.amber}`}
    >
      {children}
    </span>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Star() {
  const [controlled, setControlled] = useState(3);
  const { value: hookValue, handlers, reset } = useRating({ initialValue: 2 });

  return (
    <div
      className="min-h-screen bg-[#080c14] text-white"
      style={{ fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif" }}
    >
      {/* ── HERO ── */}
      <div className="relative overflow-hidden border-b border-white/10">
        {/* background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/10 blur-[120px] rounded-full" />
          <div className="absolute top-10 left-1/4 w-[300px] h-[200px] bg-orange-500/8 blur-[80px] rounded-full" />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
          {/* badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <Pill color="amber">npm install star-rating-x</Pill>
            <Pill color="green">v1.0.0</Pill>
            <Pill color="blue">TypeScript</Pill>
            <Pill color="pink">Zero deps</Pill>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4 leading-none">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-yellow-300">
              star-rating-x
            </span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-xl mx-auto mb-10">
            A fully-featured, accessible, customisable React rating component.
            Themes · Shapes · Animations · Half-star · RTL.
          </p>

          {/* live hero rating */}
          <div className="inline-flex flex-col items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-10 py-8 backdrop-blur-sm">
            <StarRating
              value={controlled}
              onChange={setControlled}
              count={5}
              size={52}
              animation="bounce"
              showValue
              theme="gold"
            />
            <p className="text-xs text-slate-500">
              Click a star · keyboard ← → also works
            </p>
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-5xl mx-auto px-6 py-16 space-y-24">
        {/* ── 1. Quick Start ── */}
        <section>
          <SectionTitle tag="01 · Getting Started">Quick Start</SectionTitle>
          <div className="space-y-4">
            <CodeBlock code={`npm install star-rating-x`} />
            <CodeBlock
              code={`import { StarRating } from "star-rating-x";
import "star-rating-x/styles.css";

function App() {
  const [rating, setRating] = useState(0);
  return <StarRating value={rating} onChange={setRating} />;
}`}
            />
          </div>
        </section>

        {/* ── 2. Themes ── */}
        <section>
          <SectionTitle tag="02 · Theming">9 Built-in Themes</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(
              [
                "gold",
                "fire",
                "ocean",
                "neon",
                "rose",
                "mono",
                "violet",
                "sunset",
                "mint",
              ] as const
            ).map((th) => (
              <div
                key={th}
                className="flex items-center justify-between px-5 py-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
              >
                <span className="text-sm font-semibold text-slate-300 capitalize">
                  {th}
                </span>
                <StarRating
                  defaultValue={4}
                  count={5}
                  size={20}
                  theme={th}
                  readOnly
                />
              </div>
            ))}
          </div>
          <div className="mt-6">
            <CodeBlock
              code={`<StarRating theme="fire" />
<StarRating theme="neon" />
<StarRating theme="ocean" />

// or override colours directly:
<StarRating filledColor="#FF6B6B" emptyColor="#FFE0E0" strokeColor="#CC0000" />`}
            />
          </div>
        </section>

        {/* ── 3. Shapes ── */}
        <section>
          <SectionTitle tag="03 · Shapes">8 Icon Shapes</SectionTitle>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {(
              [
                "star",
                "heart",
                "circle",
                "diamond",
                "thumb",
                "flag",
                "lightning",
                "flower",
              ] as const
            ).map((sh) => (
              <div
                key={sh}
                className="flex flex-col items-center gap-3 py-5 px-3 rounded-xl border border-white/10 bg-white/[0.03]"
              >
                <StarRating
                  defaultValue={3}
                  count={4}
                  size={22}
                  shape={sh}
                  theme="rose"
                  readOnly
                />
                <span className="text-xs font-medium text-slate-500 capitalize">
                  {sh}
                </span>
              </div>
            ))}
          </div>
          <CodeBlock
            code={`<StarRating shape="heart"     theme="rose"  />
<StarRating shape="thumb"     theme="ocean" />
<StarRating shape="lightning" theme="neon"  />
<StarRating shape="diamond"   theme="violet" />`}
          />
        </section>

        {/* ── 4. Animations ── */}
        <section>
          <SectionTitle tag="04 · Animations">Click Animations</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {(["bounce", "pulse", "wiggle", "pop"] as const).map((anim) => (
              <div
                key={anim}
                className="flex items-center justify-between px-5 py-4 rounded-xl border border-white/10 bg-white/[0.03]"
              >
                <span className="text-sm font-semibold text-slate-400 capitalize">
                  {anim}
                </span>
                <StarRating
                  defaultValue={3}
                  count={5}
                  size={24}
                  animation={anim}
                  theme="sunset"
                />
              </div>
            ))}
          </div>
          <CodeBlock
            code={`<StarRating animation="bounce" />  {/* default */}
<StarRating animation="wiggle" />
<StarRating animation="pop"    />
<StarRating animation="pulse"  />
<StarRating animation="none"   />  {/* disable */}`}
          />
        </section>

        {/* ── 5. Half-star ── */}
        <section>
          <SectionTitle tag="05 · Precision">Half-Star Support</SectionTitle>
          <ExampleCard
            title="precision={0.5}"
            description="Hover anywhere on a star to get half or full — hover left half for 0.5, right half for 1."
            preview={
              <div className="flex flex-col items-center gap-3">
                {([1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5] as number[]).map((v) => (
                  <div key={v} className="flex items-center gap-4">
                    <span className="w-8 text-right text-xs font-mono text-slate-500">
                      {v}
                    </span>
                    <StarRating
                      value={v}
                      count={5}
                      size={20}
                      precision={0.5}
                      readOnly
                      theme="gold"
                    />
                  </div>
                ))}
              </div>
            }
            code={`<StarRating
  precision={0.5}
  defaultValue={3.5}
  theme="gold"
/>`}
          />
        </section>

        {/* ── 6. Sizes ── */}
        <section>
          <SectionTitle tag="06 · Sizing">Any Size</SectionTitle>
          <ExampleCard
            title="size prop"
            description="Pass any number (px) or CSS string."
            preview={
              <div className="flex flex-col items-center gap-4">
                {[16, 24, 32, 44, 56].map((s) => (
                  <div key={s} className="flex items-center gap-4">
                    <span className="w-10 text-right text-xs font-mono text-slate-500">
                      {s}px
                    </span>
                    <StarRating
                      defaultValue={4}
                      count={5}
                      size={s}
                      readOnly
                      theme="violet"
                    />
                  </div>
                ))}
              </div>
            }
            code={`<StarRating size={16} />
<StarRating size={32} />  {/* default */}
<StarRating size={56} />`}
          />
        </section>

        {/* ── 7. Read-only ── */}
        <section>
          <SectionTitle tag="07 · Display">Read-only & Show Value</SectionTitle>
          <ExampleCard
            title="readOnly + showValue"
            description="Perfect for displaying user-submitted ratings on product pages."
            preview={
              <div className="flex flex-col items-center gap-4">
                <StarRating
                  value={4.5}
                  precision={0.5}
                  readOnly
                  showValue
                  theme="gold"
                  size={28}
                />
                <StarRating
                  value={3}
                  readOnly
                  showValue
                  theme="fire"
                  size={28}
                />
                <StarRating
                  value={5}
                  readOnly
                  showValue
                  theme="mint"
                  size={28}
                />
              </div>
            }
            code={`<StarRating
  value={4.5}
  precision={0.5}
  readOnly
  showValue
  theme="gold"
/>`}
          />
        </section>

        {/* ── 8. Controlled ── */}
        <section>
          <SectionTitle tag="08 · State">Controlled Component</SectionTitle>
          <ExampleCard
            title="value + onChange"
            description="Full control over the value from outside the component."
            preview={
              <div className="flex flex-col items-center gap-4">
                <StarRating
                  value={controlled}
                  onChange={setControlled}
                  theme="ocean"
                  size={32}
                  animation="pop"
                />
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <button
                      key={v}
                      onClick={() => setControlled(v)}
                      className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
                        controlled === v
                          ? "bg-blue-500 text-white"
                          : "bg-white/10 text-slate-400 hover:bg-white/20"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
                <span className="text-xs text-slate-500">
                  Selected: {controlled}
                </span>
              </div>
            }
            code={`const [rating, setRating] = useState(3);

<StarRating
  value={rating}
  onChange={setRating}
  theme="ocean"
  animation="pop"
/>`}
          />
        </section>

        {/* ── 9. useRating hook ── */}
        <section>
          <SectionTitle tag="09 · Hook">useRating Hook</SectionTitle>
          <ExampleCard
            title="External state management"
            description="Manage the rating value outside the component — useful for forms."
            preview={
              <div className="flex flex-col items-center gap-4">
                <StarRating
                  value={hookValue}
                  {...handlers}
                  theme="rose"
                  size={32}
                  animation="wiggle"
                />
                <div className="flex gap-2">
                  <button
                    onClick={reset}
                    className="px-4 py-1.5 rounded-lg bg-white/10 text-slate-300 text-xs font-semibold hover:bg-white/20 transition-colors"
                  >
                    Reset
                  </button>
                  <span className="px-4 py-1.5 rounded-lg bg-pink-500/10 text-pink-400 text-xs font-semibold border border-pink-500/20">
                    value: {hookValue}
                  </span>
                </div>
              </div>
            }
            code={`import { StarRating, useRating } from "star-rating-x";

function ProductRating() {
  const { value, handlers, reset } = useRating({
    initialValue: 3,
  });

  return (
    <>
      <StarRating value={value} {...handlers} />
      <button onClick={reset}>Reset</button>
    </>
  );
}`}
          />
        </section>

        {/* ── 10. Tooltips ── */}
        <section>
          <SectionTitle tag="10 · UX">Custom Tooltips</SectionTitle>
          <ExampleCard
            title="tooltips prop"
            description="Provide a label for each star — shown on hover and used for accessibility."
            preview={
              <StarRating
                defaultValue={0}
                count={5}
                size={36}
                theme="sunset"
                tooltips={[
                  "Terrible 😡",
                  "Bad 😕",
                  "Ok 😐",
                  "Good 😊",
                  "Amazing! 🤩",
                ]}
                animation="bounce"
              />
            }
            code={`<StarRating
  tooltips={[
    "Terrible 😡",
    "Bad 😕",
    "Ok 😐",
    "Good 😊",
    "Amazing! 🤩",
  ]}
/>`}
          />
        </section>

        {/* ── 11. RTL ── */}
        <section>
          <SectionTitle tag="11 · i18n">RTL Support</SectionTitle>
          <ExampleCard
            title='direction="rtl"'
            description="Full right-to-left layout — perfect for Arabic, Hebrew, and other RTL languages."
            preview={
              <div
                className="flex flex-col items-center gap-4 w-full"
                dir="rtl"
              >
                <p className="text-sm text-slate-400">تقييم المنتج</p>
                <StarRating
                  defaultValue={4}
                  count={5}
                  size={32}
                  direction="rtl"
                  theme="gold"
                />
              </div>
            }
            code={`// Arabic / Hebrew RTL layout
<StarRating
  direction="rtl"
  defaultValue={4}
  theme="gold"
/>`}
          />
        </section>

        {/* ── 12. Disabled ── */}
        <section>
          <SectionTitle tag="12 · States">Disabled State</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="flex flex-col items-center gap-3 p-6 rounded-xl border border-white/10 bg-white/[0.03]">
              <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
                Normal
              </span>
              <StarRating defaultValue={3} count={5} size={28} theme="violet" />
            </div>
            <div className="flex flex-col items-center gap-3 p-6 rounded-xl border border-white/10 bg-white/[0.03]">
              <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
                Disabled
              </span>
              <StarRating
                defaultValue={3}
                count={5}
                size={28}
                theme="violet"
                disabled
              />
            </div>
          </div>
          <CodeBlock code={`<StarRating disabled defaultValue={3} />`} />
        </section>

        {/* ── 13. TypeScript ── */}
        <section>
          <SectionTitle tag="13 · TypeScript">Full Type Safety</SectionTitle>
          <CodeBlock
            code={`import type {
  StarRatingProps,
  StarShape,      // "star"|"heart"|"circle"|"diamond"|"thumb"|"flag"|"lightning"|"flower"
  ThemeName,      // "gold"|"fire"|"ocean"|"neon"|"rose"|"mono"|"violet"|"sunset"|"mint"
  AnimationType,  // "bounce"|"pulse"|"wiggle"|"pop"|"none"
  UseRatingResult,
} from "star-rating-x";

// All props are typed:
const props: StarRatingProps = {
  value: 4,
  count: 5,
  precision: 0.5,
  shape: "heart",
  theme: "rose",
  animation: "wiggle",
  onChange: (v: number) => console.log(v),
};`}
          />
        </section>

        {/* ── FOOTER ── */}
        <footer className="border-t border-white/10 pt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-white">star-rating-x</p>
            <p className="text-xs text-slate-500 mt-0.5">
              MIT License · Built by Abdelrahman Ayman
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href="https://www.npmjs.com/package/star-rating-x"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-colors"
            >
              npm
            </a>
            <a
              href="https://github.com/Abdelrahman968/star-rating-x"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs font-bold hover:bg-white/10 transition-colors"
            >
              GitHub
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
