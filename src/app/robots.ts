import type { MetadataRoute } from "next";
import { indexingEnabled, siteUrl } from "@/lib/site";

// Blocks all crawling until the owner turns on indexing for Production.
export default function robots(): MetadataRoute.Robots {
  if (!indexingEnabled()) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/console", "/join/received", "/api"] },
    sitemap: new URL("/sitemap.xml", siteUrl()).toString(),
  };
}
