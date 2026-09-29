import { defineConfig, devices } from "@playwright/test";

const port = 3100;

// Set BASE_URL to test a deployed Vercel preview instead of a local server.
// Protected previews need Vercel's "Protection Bypass for Automation" secret.
const deployed = process.env.BASE_URL;
const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

export default defineConfig({
  testDir: "tests/e2e",
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: deployed ?? `http://127.0.0.1:${port}`,
    extraHTTPHeaders: deployed && bypass ? { "x-vercel-protection-bypass": bypass } : undefined,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: deployed
    ? undefined
    : {
        command: `pnpm start -p ${port}`,
        url: `http://127.0.0.1:${port}/api/health`,
        reuseExistingServer: !process.env.CI,
      },
});
