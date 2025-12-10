import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/components/sessionWrapper";

// HaiIntel brand fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HaiIntel - Human-Centered AI Experience",
  description:
    "HaiIntel builds human-centered AI experiences merging design, performance, and intelligence.",
  keywords: [
    "HaiIntel",
    "AI design",
    "AI chat",
    "human-centered AI",
    "Next.js",
    "UI/UX",
  ],
  authors: [{ name: "HaiIntel Team" }],
  openGraph: {
    title: "HaiIntel - Human-Centered AI Experience",
    description:
      "Explore HaiIntel's intelligent, human-centered AI interfaces and solutions.",
    url: "https://www.haiintel.com",
    siteName: "HaiIntel",
    images: [
      {
        url: "https://www.haiintel.com/logo.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HaiIntel - Human-Centered AI Experience",
    description:
      "Discover intelligent AI interfaces designed for humans by HaiIntel.",
    site: "@HaiIntel",
    creator: "@HaiIntel",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0b0c0d] text-white`}
      >
        <SessionWrapper>
          {children}
        </SessionWrapper>
      </body>
    </html>
  );
}
