"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/",          label: "Home"      },
  { href: "/v1",        label: "v1 Docs"   },
  { href: "/v2",        label: "v2 Docs"   },
  { href: "/changelog", label: "Changelog" },
];

const EXTERNAL = [
  { href: "https://www.npmjs.com/package/star-rating-x", label: "npm",    color: "#f87171" },
  { href: "https://github.com/Abdelrahman968/star-rating-x", label: "GitHub", color: "#94a3b8" },
  { href: "https://star-rating-x-demo.vercel.app",       label: "Demo",   color: "#a78bfa" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        borderBottom: "1px solid #1e293b",
        background: "rgba(8,12,20,0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 20px",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
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

        {/* Nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {NAV_LINKS.map(({ href, label }) => {
            const active =
              href === "/"
                ? pathname === "/"
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                style={{
                  padding: "6px 14px",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: active ? 700 : 500,
                  textDecoration: "none",
                  background: active ? "#ffffff12" : "transparent",
                  color: active ? "#f1f5f9" : "#64748b",
                  border: active ? "1px solid #ffffff18" : "1px solid transparent",
                  transition: "all 0.15s",
                }}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* External links */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          {EXTERNAL.map(({ href, label, color }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              style={{
                padding: "5px 12px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                textDecoration: "none",
                background: color + "15",
                color,
                border: `1px solid ${color}28`,
                transition: "all 0.15s",
              }}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
