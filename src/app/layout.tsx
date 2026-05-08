import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Star Rating X - NPM Library",
  description:
    "Comprehensive release history and changelog for Star Rating X, the feature-rich, accessible, and themeable React rating component.",
  keywords: [
    "react",
    "rating",
    "star rating",
    "react component",
    "accessible",
    "customizable",
    "themes",
    "typescript",
    "NPM",
    "open source",
  ],
  authors: [{ name: "Abdelrahman Ayman" }],
  creator: "Abdelrahman Ayman",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          background: "#080c14",
          color: "#f1f5f9",
          fontFamily: "'DM Sans','Segoe UI',sans-serif",
        }}
      >
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
