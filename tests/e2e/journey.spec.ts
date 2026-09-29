import { expect, test, type Page } from "@playwright/test";

// The public click-to-outcome journey, exercised the way people actually use it.

/** Presses Tab until the focused element matches, so the path is keyboard-only. */
async function tabTo(page: Page, name: RegExp, max = 40) {
  for (let i = 0; i < max; i++) {
    await page.keyboard.press("Tab");
    const label = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el) return "";
      const labelled = el.id ? document.querySelector(`label[for="${el.id}"]`)?.textContent : null;
      return (el.getAttribute("aria-label") ?? labelled ?? el.closest("label")?.textContent ?? el.textContent ?? "").trim();
    });
    if (name.test(label)) return;
  }
  throw new Error(`Could not reach ${name} with Tab`);
}

test("home call to action reaches the application, and browser Back returns home", async ({ page, isMobile }) => {
  await page.goto("/");
  await page.getByRole("main").getByRole("link", { name: "Apply to join" }).first().click();
  await expect(page).toHaveURL(/\/join$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Apply to join.");
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  if (!isMobile) {
    await page.getByRole("banner").getByRole("link", { name: "Apply" }).click();
    await expect(page).toHaveURL(/\/join$/);
  }
});

test("the application works with the keyboard alone, through to the closed-state ending", async ({ page }) => {
  await page.goto("/join");
  await tabTo(page, /^Full name/);
  await page.keyboard.type("Test Member");
  await tabTo(page, /^Email/);
  await page.keyboard.type("member@example.com");
  await tabTo(page, /^Where are you based/);
  await page.keyboard.type("Tucson, AZ");
  await tabTo(page, /^Continue$/);
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: "What you bring" })).toBeFocused();

  // Continuing without a choice is refused, with the error announced near the group.
  await tabTo(page, /^Continue$/);
  await page.keyboard.press("Enter");
  await expect(page.getByText("Choose at least one thing you bring.")).toBeVisible();
  await expect(page.getByLabel("Visual arts and crafts")).toBeFocused();
  await page.keyboard.press("Space");
  await tabTo(page, /^Tell us about your skills/);
  await page.keyboard.type("Portrait photographer with studio lighting and ten years of experience.");
  await tabTo(page, /^Continue$/);
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: "What you want to build" })).toBeFocused();
  await tabTo(page, /^Continue$/);
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: "Review and send" })).toBeFocused();
  await expect(page.locator("dd", { hasText: "member@example.com" })).toBeVisible();
  await expect(page.getByText("End of the preview.")).toBeVisible();
  await expect(page.getByRole("button", { name: /send/i })).toHaveCount(0);
});

test("refreshing the application starts over and keeps nothing", async ({ page }) => {
  await page.goto("/join");
  await page.getByLabel("Full name").fill("Test Member");
  await page.reload();
  await expect(page.getByLabel("Full name")).toHaveValue("");
  await expect(page.getByRole("heading", { name: "About you" })).toBeVisible();
});

test("an invalid email is caught before moving on", async ({ page }) => {
  await page.goto("/join");
  await page.getByLabel("Full name").fill("Test Member");
  await page.getByLabel("Email").fill("not-an-email");
  await page.getByLabel("Where are you based?").fill("Tucson, AZ");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByLabel("Email")).toBeFocused();
  await expect(page.getByRole("heading", { name: "About you" })).toBeVisible();
});

test("key pages never scroll sideways on a phone", async ({ page, isMobile }) => {
  test.skip(!isMobile, "phone layout only");
  for (const route of ["/", "/how-it-works", "/who-can-join", "/examples", "/fees", "/faq", "/contact", "/join", "/privacy"]) {
    await page.goto(route);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `${route} overflows by ${overflow}px`).toBeLessThanOrEqual(0);
  }
});
