import { expect, test } from "@playwright/test";

// Runs only against a deployed preview (BASE_URL set by the preview-smoke workflow).
const deployed = process.env.BASE_URL;
const expectedSha = process.env.EXPECTED_SHA;

test.describe("deployed preview", () => {
  test.skip(!deployed, "only runs against a deployed preview");

  test("serves the exact commit that was deployed", async ({ request }) => {
    test.skip(!expectedSha, "EXPECTED_SHA not provided");
    const res = await request.get("/api/health");
    expect(res.ok()).toBe(true);
    const body = await res.json();
    expect(body.app).toBe("lofgren-enterprise");
    expect(body.commit).toBe(expectedSha);
    expect(body.environment).toBe("preview");
  });

  test("refuses a visitor who is not signed in to Vercel", async ({ playwright }) => {
    // A fresh context without the bypass header, like an outside visitor.
    const outsider = await playwright.request.newContext({ baseURL: deployed, maxRedirects: 0 });
    for (const path of ["/", "/api/health", "/join"]) {
      const res = await outsider.get(path);
      const location = res.headers()["location"] ?? "";
      expect([401, 302, 303, 307]).toContain(res.status());
      if (res.status() !== 401) expect(location).toContain("vercel.com/sso-api");
      expect(await res.text()).not.toContain("lofgren-enterprise\",\"status\"");
    }
    await outsider.dispose();
  });

  test("tells search engines not to index the preview", async ({ request }) => {
    const res = await request.get("/");
    expect(res.headers()["x-robots-tag"] ?? "").toContain("noindex");
  });
});
