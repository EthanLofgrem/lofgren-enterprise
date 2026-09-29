import { describe, expect, it } from "vitest";
import { INDEXABLE_ROUTES, indexingEnabled, isIndexable, jsonLd, pageMetadata, PUBLIC_ROUTES, siteUrl } from "@/lib/site";

describe("indexingEnabled", () => {
  it("stays off unless SITE_INDEXING=true on a Production deployment", () => {
    expect(indexingEnabled({})).toBe(false);
    expect(indexingEnabled({ SITE_INDEXING: "true" })).toBe(false);
    expect(indexingEnabled({ SITE_INDEXING: "true", VERCEL_ENV: "preview" })).toBe(false);
    expect(indexingEnabled({ SITE_INDEXING: "yes", VERCEL_ENV: "production" })).toBe(false);
    expect(indexingEnabled({ SITE_INDEXING: "true", VERCEL_ENV: "production" })).toBe(true);
  });
});

describe("siteUrl", () => {
  it("prefers the configured app URL", () => {
    expect(siteUrl({ NEXT_PUBLIC_APP_URL: "https://example.com", VERCEL_URL: "x.vercel.app" }).origin).toBe("https://example.com");
  });
  it("uses the production domain everywhere, so previews never leak their temporary URL", () => {
    expect(siteUrl({ VERCEL_ENV: "production", VERCEL_PROJECT_PRODUCTION_URL: "prod.example.com", VERCEL_URL: "x.vercel.app" }).origin).toBe("https://prod.example.com");
    expect(siteUrl({ VERCEL_ENV: "preview", VERCEL_PROJECT_PRODUCTION_URL: "prod.example.com", VERCEL_URL: "x.vercel.app" }).origin).toBe("https://prod.example.com");
  });
  it("uses the deployment URL only when no production address is known", () => {
    expect(siteUrl({ VERCEL_ENV: "preview", VERCEL_URL: "x.vercel.app" }).origin).toBe("https://x.vercel.app");
  });
  it("falls back to localhost", () => {
    expect(siteUrl({}).origin).toBe("http://localhost:3000");
  });
});

describe("pageMetadata", () => {
  it("sets the canonical path, share card, and a branded share title", () => {
    const m = pageMetadata({ title: "Fees", description: "d".repeat(60), path: "/fees" });
    expect(m.alternates?.canonical).toBe("/fees");
    expect(m.openGraph).toMatchObject({ title: "Fees · Lofgren Enterprise", url: "/fees" });
    expect(m.twitter).toMatchObject({ card: "summary_large_image" });
  });
  it("keeps pages outside the launch set noindex but followable", () => {
    for (const path of ["/capital-partners", "/faq", "/fees", "/join", "/contact", "/privacy", "/terms"]) {
      expect(pageMetadata({ title: "t", description: "d", path }).robots).toEqual({ index: false, follow: true });
    }
    for (const path of INDEXABLE_ROUTES) expect(pageMetadata({ title: "t", description: "d", path }).robots).toBeUndefined();
  });
  it("supports an absolute title for the home page", () => {
    expect(pageMetadata({ title: "Home title", description: "d".repeat(60), path: "/", absoluteTitle: true }).title).toEqual({ absolute: "Home title" });
  });
});

describe("jsonLd", () => {
  it("cannot close the script tag it is placed in", () => {
    const out = jsonLd({ name: "</script><script>alert(1)</script>" });
    expect(out).not.toContain("</script>");
    expect(JSON.parse(out).name).toBe("</script><script>alert(1)</script>");
  });
});

describe("INDEXABLE_ROUTES", () => {
  it("is exactly the four informational pages, all public", () => {
    expect([...INDEXABLE_ROUTES]).toEqual(["/", "/how-it-works", "/who-can-join", "/examples"]);
    for (const r of INDEXABLE_ROUTES) expect((PUBLIC_ROUTES as readonly string[]).includes(r)).toBe(true);
    expect(isIndexable("/join")).toBe(false);
  });
});

describe("PUBLIC_ROUTES", () => {
  it("never lists private routes", () => {
    for (const r of PUBLIC_ROUTES) expect(r.startsWith("/console") || r.startsWith("/join/received") || r.startsWith("/api")).toBe(false);
  });
});
