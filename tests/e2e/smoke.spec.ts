import { expect, test } from "@playwright/test";

const ROUTES = ["/", "/join", "/how-it-works", "/who-can-join", "/examples", "/capital-partners", "/faq", "/fees", "/contact", "/privacy", "/terms"];

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
  await expect(page.getByRole("button", { name: "Send message" })).toBeDisabled();
});

test("security headers are set", async ({ request }) => {
  const res = await request.get("/");
  expect(res.headers()["x-frame-options"]).toBe("DENY");
  expect(res.headers()["x-content-type-options"]).toBe("nosniff");
  expect(res.headers()["x-powered-by"]).toBeUndefined();
});

test("old routes redirect to the member pages", async ({ page }) => {
  await page.goto("/apply");
  await expect(page).toHaveURL(/\/join$/);
  await page.goto("/producers");
  await expect(page).toHaveURL(/\/who-can-join$/);
});

test("join walks through all four steps and stays locked while sign-up is closed", async ({ page }) => {
  await page.goto("/join");
  await expect(page.getByText("Sign-up opens soon").first()).toBeVisible();
  await page.getByLabel("Full name").fill("Test Member");
  await page.getByLabel("Email").fill("member@example.com");
  await page.getByLabel("Where are you based?").fill("Tucson, AZ");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByText("Choose at least one thing you bring.")).toBeVisible();
  await page.getByLabel("Visual arts and crafts").check();
  await page.getByLabel("Tell us about your skills, talents, or resources").fill("Portrait photographer with studio lighting and ten years of experience.");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.locator("dd", { hasText: "Visual arts and crafts" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Create my account" })).toBeDisabled();
});

test("console fails closed when Supabase is not configured", async ({ page }) => {
  test.skip(!!process.env.BASE_URL, "deployed previews may have Supabase configured");
  for (const path of ["/console", "/console/sign-in", "/console/applications/00000000-0000-4000-8000-000000000000"]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { name: "The console isn't set up here." })).toBeVisible();
    await expect(page.locator("table")).toHaveCount(0);
    await expect(page.getByLabel("Email")).toHaveCount(0);
  }
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});

test("sign-in callback without a code goes back to sign-in", async ({ page }) => {
  const res = await page.goto("/console/auth/callback?next=https://evil.example");
  expect(new URL(page.url()).pathname).toBe("/console/sign-in");
  expect(page.url()).not.toContain("evil.example");
  expect(res?.status()).toBe(200);
});

test("confirmation page is noindex and echoes only a well-formed reference", async ({ page }) => {
  await page.goto("/join/received?ref=LE-ABCDEF1234");
  await expect(page.getByText("LE-ABCDEF1234")).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await page.goto("/join/received?ref=%3Cscript%3E");
  await expect(page.getByText("Your reference is")).toHaveCount(0);
});
