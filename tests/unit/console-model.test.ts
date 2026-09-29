import { describe, expect, it } from "vitest";
import { ageInDays, decideAccess, parseView, transitionErrorMessage, viewsFor } from "@/lib/console/model";

describe("decideAccess", () => {
  const user = { id: "u1", email: "op@example.com" };
  it("fails closed when the console is not configured", () => {
    expect(decideAccess({ configured: false, user, isOperator: true })).toEqual({ state: "unconfigured" });
  });
  it("sends signed-out visitors to sign in", () => {
    expect(decideAccess({ configured: true, user: null, isOperator: false })).toEqual({ state: "signed_out" });
  });
  it("denies signed-in users without an active operator grant", () => {
    expect(decideAccess({ configured: true, user, isOperator: false })).toEqual({ state: "denied" });
  });
  it("admits active operators", () => {
    expect(decideAccess({ configured: true, user, isOperator: true })).toEqual({ state: "operator", userId: "u1", email: "op@example.com" });
  });
});

describe("queue views", () => {
  const now = new Date("2026-10-10T12:00:00Z");
  const at = (daysAgo: number) => new Date(now.getTime() - daysAgo * 86_400_000).toISOString();

  it("computes whole days of age", () => {
    expect(ageInDays(at(0.5), now)).toBe(0);
    expect(ageInDays(at(3), now)).toBe(3);
  });

  it("places each status in its view", () => {
    expect(viewsFor({ status: "submitted", created_at: at(1) }, now)).toEqual(["new"]);
    expect(viewsFor({ status: "triage", created_at: at(1) }, now)).toEqual(["in_review"]);
    expect(viewsFor({ status: "info_requested", created_at: at(9) }, now)).toEqual(["waiting"]);
    expect(viewsFor({ status: "qualified", created_at: at(9) }, now)).toEqual(["closed"]);
    expect(viewsFor({ status: "declined", created_at: at(9) }, now)).toEqual(["closed"]);
  });

  it("flags open applications with no decision after 3 days as aging", () => {
    expect(viewsFor({ status: "submitted", created_at: at(3) }, now)).toEqual(["new", "aging"]);
    expect(viewsFor({ status: "triage", created_at: at(5) }, now)).toEqual(["in_review", "aging"]);
  });

  it("defaults unknown views to New", () => {
    expect(parseView(undefined)).toBe("new");
    expect(parseView("<script>")).toBe("new");
    expect(parseView("closed")).toBe("closed");
  });
});

describe("transitionErrorMessage", () => {
  it.each([
    [{ code: "40001", message: "stale version" }, /Someone else changed/],
    [{ code: "22023", message: "reason required" }, /give a reason/],
    [{ code: "22023", message: "transition triage -> submitted not allowed" }, /isn't allowed/],
    [{ code: "42501", message: "not authorized" }, /can't make this change/],
    [{ code: "P0002", message: "application not found" }, /no longer exists/],
    [null, /wasn't saved/],
  ])("maps %j", (err, expected) => {
    expect(transitionErrorMessage(err)).toMatch(expected);
  });

  it("never echoes raw database text", () => {
    expect(transitionErrorMessage({ code: "XX000", message: "relation public.secret does not exist" })).not.toContain("secret");
  });
});
