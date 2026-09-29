import type { MetadataRoute } from "next";
import { INDEXABLE_ROUTES, indexingEnabled, siteUrl } from "@/lib/site";

// Launch-reviewed informational pages only. Empty until the owner turns on indexing for Production,
// so previews never advertise their URLs.
export default function sitemap(): MetadataRoute.Sitemap {
  if (!indexingEnabled()) return [];
  const base = siteUrl();
  return INDEXABLE_ROUTES.map((path) => ({
    url: new URL(path, base).toString(),
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : path === "/how-it-works" ? 0.8 : 0.5,
  }));
}
