import { describe, expect, it, vi } from "vitest";
import { requestSignInLink } from "@/lib/console/sign-in";

const redirect = "https://example.test/console/auth/callback";

describe("requestSignInLink", () => {
  it("rejects a malformed email without calling Supabase", async () => {
    const send = vi.fn();
    expect(await requestSignInLink("not-an-email", redirect, send)).toEqual({ status: "invalid" });
    expect(send).not.toHaveBeenCalled();
  });

  it("normalizes the email and passes the callback URL", async () => {
    const send = vi.fn(async () => ({ error: null }));
    expect(await requestSignInLink("  Owner@Example.COM ", redirect, send)).toEqual({ status: "sent" });
    expect(send).toHaveBeenCalledWith("owner@example.com", redirect);
  });

  it("gives the same answer when the account doesn't exist", async () => {
    const log = vi.fn();
    const send = vi.fn(async () => ({ error: { status: 422 } }));
    expect(await requestSignInLink("stranger@example.com", redirect, send, log)).toEqual({ status: "sent" });
    expect(log).toHaveBeenCalledWith("console.sign_in_link_error", { status: 422 });
    expect(JSON.stringify(log.mock.calls)).not.toContain("stranger");
  });

  it("gives the same answer when Supabase is unreachable", async () => {
    const send = vi.fn(async () => { throw new Error("network down"); });
    expect(await requestSignInLink("owner@example.com", redirect, send)).toEqual({ status: "sent" });
  });
});
