import type { MetadataRoute } from "next";
import { indexingEnabled, PUBLIC_ROUTES, siteUrl } from "@/lib/site";

// Public pages only. Empty until the owner turns on indexing for Production,
// so previews never advertise their URLs.
export default function sitemap(): MetadataRoute.Sitemap {
  if (!indexingEnabled()) return [];
  const base = siteUrl();
  return PUBLIC_ROUTES.map((path) => ({
    url: new URL(path, base).toString(),
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : path === "/how-it-works" || path === "/join" ? 0.8 : 0.5,
  }));
}
