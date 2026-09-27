import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
const { requireEnv } = await import("@/lib/env");

describe("requireEnv", () => {
  it("names missing variables without values", () => {
    expect(() => requireEnv(["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"], { STRIPE_WEBHOOK_SECRET: "whsec_x" }))
      .toThrow("Missing server configuration: STRIPE_SECRET_KEY");
  });

  it("rejects a live Stripe key outside production", () => {
    expect(() => requireEnv(["STRIPE_SECRET_KEY"], { STRIPE_SECRET_KEY: "sk_live_x", VERCEL_ENV: "preview" }))
      .toThrow("test-mode");
  });

  it("returns requested values", () => {
    expect(requireEnv(["STRIPE_SECRET_KEY"], { STRIPE_SECRET_KEY: "sk_test_x" })).toEqual({ STRIPE_SECRET_KEY: "sk_test_x" });
  });
});
