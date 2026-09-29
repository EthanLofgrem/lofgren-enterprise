import { describe, expect, it } from "vitest";
import { getHealth } from "@/lib/health";

describe("getHealth", () => {
  it("identifies the app and commit", () => {
    const h = getHealth({ VERCEL_GIT_COMMIT_SHA: "abc123", VERCEL_ENV: "preview" });
    expect(h.app).toBe("lofgren-enterprise");
    expect(h.commit).toBe("abc123");
    expect(h.environment).toBe("preview");
  });

  it("reports providers as not configured when keys are absent", () => {
    expect(getHealth({}).checks).toEqual({ supabase: "not_configured", stripe: "not_configured" });
  });

  it("never echoes secret values", () => {
    const secret = "sk_test_do_not_leak";
    const h = getHealth({ STRIPE_SECRET_KEY: secret, STRIPE_WEBHOOK_SECRET: "whsec_x" });
    expect(h.checks.stripe).toBe("configured");
    expect(JSON.stringify(h)).not.toContain(secret);
    expect(JSON.stringify(h)).not.toContain("whsec_x");
  });
});
