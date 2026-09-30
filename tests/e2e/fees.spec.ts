import { expect, test } from "@playwright/test";
import { FREE_SERVICES, PAID_SERVICES } from "@/lib/services/catalog";

// The Fees page is generated from the service catalog: free and paid are
// clearly separated, and nothing can be bought before launch.

test("fees separates free help from paid support and sells nothing", async ({ page }) => {
  await page.goto("/fees");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Join free. Pay only for the help you choose.");

  const free = page.locator("section", { has: page.getByRole("heading", { name: "Free", exact: true }) });
  await expect(free.getByRole("listitem").filter({ has: page.getByRole("heading", { level: 3 }) })).toHaveCount(FREE_SERVICES.length);
  for (const s of FREE_SERVICES) await expect(free.getByRole("heading", { name: s.name })).toBeVisible();

  const paid = page.locator("section", { has: page.getByRole("heading", { name: "Paid support, only if your team chooses it" }) });
  for (const s of PAID_SERVICES) await expect(paid.getByRole("heading", { name: s.name })).toBeVisible();
  await expect(paid.getByText("Priced before you commit").first()).toBeVisible();
  await expect(page.getByText("Specialist review", { exact: true })).toBeVisible();

  // No way to pay: no forms, no buttons, and no purchase links in the page body.
  const main = page.getByRole("main");
  await expect(main.locator("form")).toHaveCount(0);
  await expect(main.getByRole("button")).toHaveCount(0);
  await expect(main.getByRole("link", { name: /buy|checkout|pay|subscribe|purchase/i })).toHaveCount(0);
  await expect(page.getByText("nothing on this page can be bought")).toBeVisible();
});
