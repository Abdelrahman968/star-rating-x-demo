"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/v1", label: "v1" },
  { href: "/v2", label: "v2" },
  { href: "/v3", label: "v3" },
  { href: "/v4", label: "v4" },
  { href: "/v5", label: "v5 ✨", hot: true },
  { href: "/changelog", label: "Changelog" },
];

const EXTERNAL = [
  {
    href: "https://www.npmjs.com/package/star-rating-x",
    label: "npm",
    color: "#f87171",
  },
  {
    href: "https://github.com/Abdelrahman968/star-rating-x",
    label: "GitHub",
    color: "#94a3b8",
  },
  {
    href: "https://star-rating-x-demo.vercel.app",
    label: "Demo",
    color: "#a78bfa",
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* ── responsive style rules ── */}
      <style>{`
        .srx-nav-desktop { display: flex; }
        .srx-nav-ext     { display: flex; }
        .srx-hamburger   { display: none; }
        .srx-mobile-menu { display: none;  }

        @media (max-width: 860px) {
          .srx-nav-desktop { display: none !important; }
          .srx-nav-ext     { display: none !important; }
          .srx-hamburger   { display: flex !important; }
        }
        @media (max-width: 860px) {
          .srx-mobile-menu.open { display: flex !important; }
        }

        .srx-nav-link:hover   { background: #ffffff12 !important; color: #f1f5f9 !important; }
        .srx-ext-link:hover   { filter: brightness(1.15); }
        .srx-mob-link:hover   { background: #ffffff0a !important; }
      `}</style>

      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          borderBottom: "1px solid #1e293b",
          background: "rgba(8,12,20,0.92)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
        }}
      >
        {/* ── main bar ── */}
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 20px",
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 22 }}>⭐</span>
            <span
              style={{
                fontWeight: 800,
                fontSize: 16,
                background: "linear-gradient(135deg,#fbbf24,#f97316)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-0.02em",
              }}
            >
              star-rating-x
            </span>
          </Link>

          {/* Desktop nav links */}
          <div
            className="srx-nav-desktop"
            style={{
              alignItems: "center",
              gap: 2,
              flex: 1,
              justifyContent: "center",
            }}
          >
            {NAV_LINKS.map(({ href, label, hot }) => (
              <Link
                key={href}
                href={href}
                className="srx-nav-link"
                style={{
                  padding: "5px 11px",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: isActive(href) ? 700 : 500,
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  background: isActive(href) ? "#ffffff14" : "transparent",
                  color: isActive(href)
                    ? "#f1f5f9"
                    : hot
                      ? "#fbbf24"
                      : "#64748b",
                  border: isActive(href)
                    ? "1px solid #ffffff1a"
                    : "1px solid transparent",
                  transition: "all 0.15s",
                }}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Desktop external links */}
          <div
            className="srx-nav-ext"
            style={{ alignItems: "center", gap: 6, flexShrink: 0 }}
          >
            {EXTERNAL.map(({ href, label, color }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="srx-ext-link"
                style={{
                  padding: "5px 12px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 700,
                  textDecoration: "none",
                  background: color + "15",
                  color,
                  border: `1px solid ${color}28`,
                  transition: "filter 0.15s",
                }}
              >
                {label}
              </a>
            ))}
          </div>

          {/* Hamburger */}
          <button
            className="srx-hamburger"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            style={{
              display: "none",
              flexDirection: "column",
              justifyContent: "center",
              gap: 5,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 8,
              borderRadius: 8,
              flexShrink: 0,
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: "block",
                  width: 22,
                  height: 2,
                  borderRadius: 2,
                  background: open ? "#f1f5f9" : "#94a3b8",
                  transition: "transform 0.22s ease, opacity 0.22s",
                  transform: open
                    ? i === 0
                      ? "rotate(45deg) translate(5px, 5px)"
                      : i === 2
                        ? "rotate(-45deg) translate(5px,-5px)"
                        : "none"
                    : "none",
                  opacity: open && i === 1 ? 0 : 1,
                }}
              />
            ))}
          </button>
        </div>

        {/* ── Mobile dropdown ── */}
        <div
          className={`srx-mobile-menu${open ? " open" : ""}`}
          style={{
            flexDirection: "column",
            borderTop: "1px solid #1e293b",
            background: "rgba(6,10,18,0.98)",
            padding: "8px 16px 20px",
            gap: 2,
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          {NAV_LINKS.map(({ href, label, hot }) => (
            <Link
              key={href}
              href={href}
              className="srx-mob-link"
              onClick={() => setOpen(false)}
              style={{
                padding: "11px 14px",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: isActive(href) ? 700 : 500,
                textDecoration: "none",
                display: "block",
                background: isActive(href) ? "#ffffff0e" : "transparent",
                color: isActive(href) ? "#f1f5f9" : hot ? "#fbbf24" : "#94a3b8",
                border: isActive(href)
                  ? "1px solid #ffffff12"
                  : "1px solid transparent",
                transition: "all 0.15s",
              }}
            >
              {label}
            </Link>
          ))}
          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 10,
              paddingTop: 12,
              borderTop: "1px solid #1e293b",
            }}
          >
            {EXTERNAL.map(({ href, label, color }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                style={{
                  flex: 1,
                  textAlign: "center",
                  padding: "8px 0",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 700,
                  textDecoration: "none",
                  background: color + "15",
                  color,
                  border: `1px solid ${color}28`,
                }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
