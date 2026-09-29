import { randomUUID } from "node:crypto";
import { describe, expect, it, vi } from "vitest";
import { handleIntake, MAX_FORM_BYTES, type IntakeDeps } from "@/lib/intake/handle";

vi.mock("server-only", () => ({}));
const { clientKey, intakeEnabled } = await import("@/lib/intake/server");

function form(overrides: Record<string, string | undefined> = {}) {
  const f = new FormData();
  const base: Record<string, string | undefined> = {
    idempotencyKey: randomUUID(),
    kind: "producer",
    name: "Test Producer",
    email: "Producer@Example.com",
    location: "Tucson, AZ",
    summary: "Small-batch producer with spare capacity looking for distribution.",
    gaps: "packaging, distribution",
    consent: "on",
    ...overrides,
  };
  for (const [k, v] of Object.entries(base)) if (v !== undefined) f.set(k, v);
  return f;
}

function deps(over: Partial<IntakeDeps> = {}) {
  return {
    recordAttempt: vi.fn(async () => true),
    submit: vi.fn(async () => "LE-ABCDEF1234"),
    ...over,
  } satisfies IntakeDeps;
}

describe("handleIntake", () => {
  it("submits a valid application with normalized values and the current consent version", async () => {
    const submit = vi.fn<IntakeDeps["submit"]>(async () => "LE-ABCDEF1234");
    const r = await handleIntake(form(), "k".repeat(64), deps({ submit }));
    expect(r).toEqual({ status: "received", reference: "LE-ABCDEF1234" });
    const args = submit.mock.calls[0]![0];
    expect(args.p_email).toBe("producer@example.com");
    expect(args.p_gaps).toEqual(["packaging", "distribution"]);
    expect(args.p_consent_version).toMatch(/^privacy-/);
  });

  it("submits a member with checkbox categories as gaps", async () => {
    const submit = vi.fn<IntakeDeps["submit"]>(async () => "LE-ABCDEF1234");
    const f = form({ kind: "member", gaps: undefined, adult: "on" });
    f.append("gaps", "visual-arts");
    f.append("gaps", "space-equipment");
    const r = await handleIntake(f, "k".repeat(64), deps({ submit }));
    expect(r).toEqual({ status: "received", reference: "LE-ABCDEF1234" });
    const args = submit.mock.calls[0]![0];
    expect(args.p_kind).toBe("member");
    expect(args.p_gaps).toEqual(["visual-arts", "space-equipment"]);
  });

  it("returns field errors without calling the database or using a rate-limit attempt", async () => {
    const d = deps();
    const r = await handleIntake(form({ email: "bad", consent: undefined }), "k", d);
    expect(r.status).toBe("invalid");
    if (r.status === "invalid") expect(Object.keys(r.fieldErrors).sort()).toEqual(["consent", "email"]);
    expect(d.recordAttempt).not.toHaveBeenCalled();
    expect(d.submit).not.toHaveBeenCalled();
  });

  it("refuses a valid submission over the rate limit without submitting", async () => {
    const d = deps({ recordAttempt: vi.fn(async () => false) });
    expect(await handleIntake(form(), "k", d)).toEqual({ status: "rate_limited" });
    expect(d.recordAttempt).toHaveBeenCalledTimes(1);
    expect(d.submit).not.toHaveBeenCalled();
  });

  it("lets an applicant fix typos: invalid tries do not count toward the limit", async () => {
    // Simulates the database limiter: 5 allowed attempts per client.
    let used = 0;
    const d = deps({ recordAttempt: vi.fn(async () => ++used <= 5) });
    for (let i = 0; i < 6; i++) {
      expect((await handleIntake(form({ email: "typo" }), "k", d)).status).toBe("invalid");
    }
    expect(used).toBe(0);
    expect((await handleIntake(form(), "k", d)).status).toBe("received");
    expect(used).toBe(1);
  });

  it("fails closed when the rate-limit check errors", async () => {
    const d = deps({ recordAttempt: vi.fn(async () => { throw new Error("db down"); }) });
    expect(await handleIntake(form(), "k", d)).toEqual({ status: "unavailable" });
    expect(d.submit).not.toHaveBeenCalled();
  });

  it("answers a honeypot hit like a success but stores nothing", async () => {
    const d = deps();
    expect(await handleIntake(form({ website: "http://spam.example" }), "k", d)).toEqual({ status: "received", reference: null });
    expect(d.recordAttempt).not.toHaveBeenCalled();
    expect(d.submit).not.toHaveBeenCalled();
  });

  it("rejects oversized payloads before touching the database", async () => {
    const d = deps();
    const r = await handleIntake(form({ summary: "x".repeat(MAX_FORM_BYTES) }), "k", d);
    expect(r.status).toBe("invalid");
    expect(d.recordAttempt).not.toHaveBeenCalled();
  });

  it("hides database errors behind a generic message", async () => {
    const d = deps({ submit: vi.fn(async () => { throw new Error("duplicate key value violates unique constraint"); }) });
    expect(await handleIntake(form(), "k", d)).toEqual({ status: "unavailable" });
  });
});

describe("intake server helpers", () => {
  it("is disabled unless explicitly enabled and fully configured", () => {
    const full = { INTAKE_ENABLED: "true", NEXT_PUBLIC_SUPABASE_URL: "http://x", SUPABASE_SECRET_KEY: "s", INTAKE_HASH_SALT: "x".repeat(32) };
    expect(intakeEnabled(full)).toBe(true);
    expect(intakeEnabled({ ...full, INTAKE_ENABLED: "false" })).toBe(false);
    expect(intakeEnabled({ ...full, INTAKE_HASH_SALT: "short" })).toBe(false);
    expect(intakeEnabled({})).toBe(false);
  });

  it("hashes the first forwarded address with the salt and never returns the raw IP", () => {
    const k = clientKey("203.0.113.9, 10.0.0.1", "s".repeat(32));
    expect(k).toMatch(/^[0-9a-f]{64}$/);
    expect(k).not.toContain("203.0.113.9");
    expect(k).toBe(clientKey("203.0.113.9", "s".repeat(32)));
    expect(k).not.toBe(clientKey("203.0.113.9", "t".repeat(32)));
  });
});
