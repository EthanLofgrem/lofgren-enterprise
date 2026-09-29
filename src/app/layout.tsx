import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { PrelaunchBanner, SiteFooter, SiteHeader } from "@/components/site";
import { indexingEnabled, SITE_DESCRIPTION, SITE_HEADLINE, SITE_NAME, siteUrl } from "@/lib/site";
import "./globals.css";

const display = Fraunces({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });

const indexable = indexingEnabled();

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  applicationName: SITE_NAME,
  title: { default: `${SITE_NAME}: ${SITE_HEADLINE}`, template: `%s · ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  // Pre-launch: every page stays out of search until the owner sets
  // SITE_INDEXING=true on the Production deployment (see src/lib/site.ts).
  robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: { type: "website", siteName: SITE_NAME, locale: "en_US" },
  twitter: { card: "summary_large_image" },
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
