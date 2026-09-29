import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Every public marketing route. Private routes (/console, /join/received) are
// covered in smoke.spec.ts and must stay out of search.
const PUBLIC = ["/", "/how-it-works", "/who-can-join", "/examples", "/capital-partners", "/faq", "/fees", "/contact", "/privacy", "/terms", "/join"];

// Claims the site must never make (see docs/product/CLAUDE-MISSION.md).
const BANNED = [
  "guaranteed return", "guaranteed income", "guaranteed profit", "passive income", "invest now", "approved venture",
  "automatic payout", "get rich", "our attorneys", "we are a law firm",
];

for (const scheme of ["light", "dark"] as const) {
  test.describe(`accessibility, ${scheme} mode`, () => {
    test.use({ colorScheme: scheme });
    for (const route of PUBLIC) {
      test(`${route} has no WCAG 2.1 A/AA or best-practice violations`, async ({ page }) => {
        await page.goto(route);
        const results = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"])
          .analyze();
        const summary = results.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.length} × ${v.nodes[0]?.target.join(" ")}`);
        expect(summary).toEqual([]);
      });
    }
  });
}

test.describe("content and links", () => {
  test("no page makes a banned claim", async ({ page }) => {
    for (const route of PUBLIC) {
      await page.goto(route);
      const text = (await page.locator("body").innerText()).toLowerCase();
      for (const phrase of BANNED) expect(text, `${route} contains "${phrase}"`).not.toContain(phrase);
    }
  });

  test("every internal link on every public page resolves", async ({ page, request }) => {
    const hrefs = new Set<string>();
    for (const route of PUBLIC) {
      await page.goto(route);
      for (const href of await page.locator('a[href^="/"]').evaluateAll((as) => as.map((a) => a.getAttribute("href") ?? ""))) {
        hrefs.add(href.split("#")[0] || "/");
      }
    }
    expect(hrefs.size).toBeGreaterThan(10);
    for (const href of hrefs) {
      const res = await request.get(href);
      expect(res.status(), href).toBeLessThan(400);
    }
  });

  test("the mobile menu opens and navigates", async ({ page, isMobile }) => {
    test.skip(!isMobile, "mobile layout only");
    await page.goto("/");
    await page.getByText("Menu", { exact: true }).click();
    await page.getByRole("navigation", { name: "Mobile" }).getByRole("link", { name: "How it works" }).click();
    await expect(page).toHaveURL(/\/how-it-works$/);
    await expect(page.locator("h1")).toContainText("Qualify");
  });

  test("the core lines appear where they should", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toHaveText("Bring what you do. Build what comes next.");
    await expect(page.getByText("Make. Create. Operate. Collaborate.").first()).toBeVisible();
    await page.goto("/how-it-works");
    await expect(page.locator("h1")).toHaveText("Qualify. Discover. Diligence. Blueprint. Assemble. Pilot. Operate.");
  });

  test("unknown pages return a helpful 404", async ({ page }) => {
    const res = await page.goto("/this-page-does-not-exist");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("We couldn't find that page.");
    await expect(page.getByRole("main").getByRole("link", { name: "Go to the home page" })).toBeVisible();
  });
});

test.describe("search and sharing metadata", () => {
  test("every public page has a unique title, description, and canonical URL", async ({ page }) => {
    const titles = new Set<string>();
    const descriptions = new Set<string>();
    for (const route of PUBLIC) {
      await page.goto(route);
      const title = await page.title();
      const description = (await page.locator('meta[name="description"]').getAttribute("content")) ?? "";
      expect(title, route).toContain("Lofgren Enterprise");
      expect(description.length, `${route} description length`).toBeGreaterThanOrEqual(50);
      expect(description.length, `${route} description length`).toBeLessThanOrEqual(170);
      titles.add(title);
      descriptions.add(description);
      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(new URL(canonical ?? "").pathname, `${route} canonical`).toBe(route);
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /.+/);
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /opengraph-image/);
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
    }
    expect(titles.size).toBe(PUBLIC.length);
    expect(descriptions.size).toBe(PUBLIC.length);
  });

  test("pre-launch: every page is noindex and robots.txt blocks crawling", async ({ page, request }) => {
    for (const route of PUBLIC) {
      await page.goto(route);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    }
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toMatch(/Disallow: \/\s/);
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.status()).toBe(200);
    expect(await sitemap.text()).not.toContain("<loc>");
  });

  test("share image and site icon are served", async ({ page, request }) => {
    const og = await request.get("/opengraph-image");
    expect(og.status()).toBe(200);
    expect(og.headers()["content-type"]).toContain("image/png");
    await page.goto("/");
    await expect(page.locator('link[rel="icon"]').first()).toHaveAttribute("href", /icon/);
  });

  test("structured data describes the organization and the FAQ, factually", async ({ page }) => {
    await page.goto("/");
    const org = JSON.parse((await page.locator('script[type="application/ld+json"]').first().textContent()) ?? "{}");
    expect(org["@type"]).toBe("Organization");
    expect(org.name).toBe("Lofgren Enterprise");
    expect(org.slogan).toBe("Make. Create. Operate. Collaborate.");
    await page.goto("/faq");
    const faq = JSON.parse((await page.locator('script[type="application/ld+json"]').first().textContent()) ?? "{}");
    expect(faq["@type"]).toBe("FAQPage");
    expect(faq.mainEntity.length).toBe(await page.locator("main details").count());
  });
});
