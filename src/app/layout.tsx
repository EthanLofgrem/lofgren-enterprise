import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { PrelaunchBanner, SiteFooter, SiteHeader } from "@/components/site";
import "./globals.css";

const display = Fraunces({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Lofgren Enterprise: Bring what you do. Build what comes next.", template: "%s · Lofgren Enterprise" },
  description:
    "Lofgren Enterprise connects people with skills, talents, property, equipment, and capital, and helps them form businesses they own together through a signed agreement and their own LLC.",
  // Pre-launch: keep every page out of search until the owner opens the site.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf8f3" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1513" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-panel focus:px-3 focus:py-2">
          Skip to content
        </a>
        <PrelaunchBanner />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
