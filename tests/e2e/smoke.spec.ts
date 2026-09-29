import { expect, test } from "@playwright/test";

const ROUTES = ["/", "/how-it-works", "/producers", "/partners", "/fees", "/contact", "/privacy", "/terms"];

for (const route of ROUTES) {
  test(`${route} renders one h1 and no horizontal scroll`, async ({ page }) => {
    const res = await page.goto(route);
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test("health identifies the app", async ({ request }) => {
  const res = await request.get("/api/health");
  expect(res.ok()).toBe(true);
  const body = await res.json();
  expect(body.app).toBe("lofgren-enterprise");
  expect(res.headers()["cache-control"]).toContain("no-store");
});

test("skip link is the first tab stop and targets main", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const focused = page.locator(":focus");
  await expect(focused).toHaveText("Skip to content");
  await expect(focused).toHaveAttribute("href", "#main");
});

test("preview intake form cannot submit", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.getByRole("button", { name: "Submit" })).toBeDisabled();
});

test("security headers are set", async ({ request }) => {
  const res = await request.get("/");
  expect(res.headers()["x-frame-options"]).toBe("DENY");
  expect(res.headers()["x-content-type-options"]).toBe("nosniff");
  expect(res.headers()["x-powered-by"]).toBeUndefined();
});
