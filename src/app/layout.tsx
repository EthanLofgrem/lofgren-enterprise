import type { Metadata, Viewport } from "next";
import { SiteFooter, SiteHeader } from "@/components/site";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Lofgren Enterprise", template: "%s · Lofgren Enterprise" },
  description: "Lofgren Enterprise helps producers turn an existing product into a brand by assembling the partners, plan, and agreements it needs.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-panel focus:px-3 focus:py-2">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
