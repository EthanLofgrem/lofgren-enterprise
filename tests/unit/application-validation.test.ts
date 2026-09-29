import { randomUUID } from "node:crypto";
import { describe, expect, it } from "vitest";
import { applicationSchema } from "@/lib/validation/application";

const valid = () => ({
  idempotencyKey: randomUUID(),
  kind: "producer",
  name: "  Test Producer ",
  email: " Producer@Example.COM ",
  location: "Walla Walla, WA",
  summary: "Small-batch producer with spare capacity looking for distribution.",
  consent: true,
});

describe("applicationSchema", () => {
  it("accepts and normalizes a valid application", () => {
    const r = applicationSchema.parse({ ...valid(), organization: "" });
    expect(r.name).toBe("Test Producer");
    expect(r.email).toBe("producer@example.com");
    expect(r.organization).toBeUndefined();
    expect(r.gaps).toEqual([]);
  });

  it("accepts a member who confirms they are 18 or older", () => {
    const r = applicationSchema.parse({ ...valid(), kind: "member", adult: true, gaps: ["visual-arts", "capital"] });
    expect(r.kind).toBe("member");
    expect(r.gaps).toEqual(["visual-arts", "capital"]);
  });

  it("rejects a member who has not confirmed their age", () => {
    const r = applicationSchema.safeParse({ ...valid(), kind: "member" });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues[0]?.path).toEqual(["adult"]);
  });

  it.each([
    ["missing consent", { consent: false }],
    ["bad email", { email: "nope" }],
    ["short summary", { summary: "short" }],
    ["long summary", { summary: "x".repeat(4001) }],
    ["unknown kind", { kind: "investor" }],
    ["bad idempotency key", { idempotencyKey: "123" }],
    ["too many gaps", { gaps: Array.from({ length: 13 }, (_, i) => `gap ${i}`) }],
    ["honeypot filled", { website: "http://spam.example" }],
  ])("rejects %s", (_label, bad) => {
    expect(applicationSchema.safeParse({ ...valid(), ...bad }).success).toBe(false);
  });
});
