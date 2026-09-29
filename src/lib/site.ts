import type { Metadata } from "next";

export const SITE_NAME = "Lofgren Enterprise";
export const SITE_TAGLINE = "Make. Create. Operate. Collaborate.";
export const SITE_HEADLINE = "Bring what you do. Build what comes next.";
export const SITE_DESCRIPTION =
  "Lofgren Enterprise connects people with skills, space, equipment, and capital, and helps them form a business they own together.";

/** Public marketing pages, in sitemap order. Private routes (/console, /join/received) are excluded. */
export const PUBLIC_ROUTES = ["/", "/how-it-works", "/who-can-join", "/examples", "/capital-partners", "/faq", "/fees", "/join", "/contact", "/privacy", "/terms"] as const;

type Env = Record<string, string | undefined>;

/** Absolute base URL for canonical links, share cards, the sitemap, and structured data. */
export function siteUrl(env: Env = process.env): URL {
  if (env.NEXT_PUBLIC_APP_URL) return new URL(env.NEXT_PUBLIC_APP_URL);
  if (env.VERCEL_ENV === "production" && env.VERCEL_PROJECT_PRODUCTION_URL) return new URL(`https://${env.VERCEL_PROJECT_PRODUCTION_URL}`);
  if (env.VERCEL_URL) return new URL(`https://${env.VERCEL_URL}`);
  return new URL("http://localhost:3000");
}

/**
 * Search engines may index the site only when the owner turns it on for the
 * Production deployment. Previews and local runs are never indexable.
 * Changing SITE_INDEXING needs a redeploy because pages are prerendered.
 */
export function indexingEnabled(env: Env = process.env): boolean {
  return env.SITE_INDEXING === "true" && env.VERCEL_ENV === "production";
}

const SHARE_IMAGE = { url: "/opengraph-image", width: 1200, height: 630, alt: `${SITE_NAME}: ${SITE_HEADLINE}` };

/** Title, description, canonical URL, and share card for one public page. */
export function pageMetadata({ title, description, path, absoluteTitle = false }: { title: string; description: string; path: string; absoluteTitle?: boolean }): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} · ${SITE_NAME}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: SITE_NAME, locale: "en_US", title: fullTitle, description, url: path, images: [SHARE_IMAGE] },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [SHARE_IMAGE.url] },
  };
}

/** Serializes structured data for a <script type="application/ld+json"> without allowing markup injection. */
export function jsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
