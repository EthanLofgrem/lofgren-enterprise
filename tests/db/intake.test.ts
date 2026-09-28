import { randomUUID } from "node:crypto";
import { beforeAll, describe, expect, it } from "vitest";
import { as, freshDb, grantOperator, makeUser, submit, validApplication, type Db } from "./harness";

const A = randomUUID(); // applicant A
const B = randomUUID(); // applicant B
const OP = randomUUID(); // operator
const OWNER = randomUUID();
const OUTSIDER = randomUUID();

const anon = { role: "anon" } as const;
const server = { role: "service_role" } as const;
const user = (sub: string) => ({ role: "authenticated", sub }) as const;

let db: Db;
let appA: string;
let appB: string;

async function idOf(ref: string) {
  const r = await db.query<{ id: string }>("select id from public.applications where reference = $1", [ref]);
  return r.rows[0]!.id;
}

beforeAll(async () => {
  db = await freshDb();
  for (const u of [A, B, OP, OWNER, OUTSIDER]) await makeUser(db, u);
  await grantOperator(db, OP);
  await grantOperator(db, OWNER, "owner");
  const refA = await as(db, server, (tx) => submit(tx, validApplication(randomUUID(), { email: "a@example.com" })));
  const refB = await as(db, server, (tx) => submit(tx, validApplication(randomUUID(), { email: "b@example.com" })));
  appA = await idOf(refA);
  appB = await idOf(refB);
  // Linking an application to a verified account is a server step (LE-003); simulate it here.
  await db.query("update public.applications set applicant_user_id = $1 where id = $2", [A, appA]);
  await db.query("update public.applications set applicant_user_id = $1 where id = $2", [B, appB]);
}, 60_000);

describe("schema", () => {
  it("has RLS enabled on every public table", async () => {
    const r = await db.query<{ relname: string }>(
      "select relname from pg_class where relnamespace = 'public'::regnamespace and relkind = 'r' and not relrowsecurity",
    );
    expect(r.rows).toEqual([]);
  });
});

describe("intake (server-mediated)", () => {
  it("returns a reference and records a submitted event", async () => {
    const ref = await as(db, server, (tx) => submit(tx, validApplication(randomUUID())));
    expect(ref).toMatch(/^LE-[0-9A-F]{10}$/);
    const ev = await db.query("select to_status from public.application_events e join public.applications a on a.id = e.application_id where a.reference = $1", [ref]);
    expect(ev.rows).toEqual([{ to_status: "submitted" }]);
  });

  it("is idempotent on repeat submit", async () => {
    const key = randomUUID();
    const r1 = await as(db, server, (tx) => submit(tx, validApplication(key)));
    const r2 = await as(db, server, (tx) => submit(tx, validApplication(key, { name: "Changed Name" })));
    expect(r2).toBe(r1);
    const n = await db.query<{ n: number }>("select count(*)::int n from public.applications where idempotency_key = $1", [key]);
    expect(n.rows[0]!.n).toBe(1);
  });

  it.each([
    ["short summary", { summary: "too short" }],
    ["bad email", { email: "not-an-email" }],
    ["oversized summary", { summary: "x".repeat(4001) }],
    ["missing consent", { consent: "" }],
    ["one-letter name", { name: "X" }],
  ])("rejects %s", async (_label, bad) => {
    await expect(as(db, server, (tx) => submit(tx, validApplication(randomUUID(), bad)))).rejects.toThrow();
  });

  it("anonymous visitors cannot call submit_application directly", async () => {
    await expect(as(db, anon, (tx) => submit(tx, validApplication(randomUUID())))).rejects.toThrow(/permission denied/);
  });

  it("signed-in users cannot call submit_application directly", async () => {
    await expect(as(db, user(OUTSIDER), (tx) => submit(tx, validApplication(randomUUID())))).rejects.toThrow(/permission denied/);
  });

  it("anonymous visitors cannot read applications", async () => {
    await expect(as(db, anon, (tx) => tx.query("select * from public.applications"))).rejects.toThrow(/permission denied/);
  });

  it("cannot insert directly", async () => {
    await expect(
      as(db, anon, (tx) => tx.query("insert into public.applications (kind, name, email, location, summary, consent_version, consented_at, idempotency_key) values ('producer','Nm','x@y.co','Here','twenty characters long text','v1',now(),gen_random_uuid())")),
    ).rejects.toThrow(/permission denied/);
  });

  it("cannot transition status", async () => {
    await expect(as(db, anon, (tx) => tx.query("select public.transition_application($1, 'triage', 1)", [appA]))).rejects.toThrow(/permission denied/);
  });
});

describe("applicant isolation", () => {
  it("applicant A sees only their own application, including counts", async () => {
    const rows = await as(db, user(A), (tx) => tx.query<{ id: string }>("select id from public.applications"));
    expect(rows.rows.map((r) => r.id)).toEqual([appA]);
    const byId = await as(db, user(A), (tx) => tx.query("select id from public.applications where id = $1", [appB]));
    expect(byId.rows).toEqual([]);
  });

  it("outsider sees nothing", async () => {
    const rows = await as(db, user(OUTSIDER), (tx) => tx.query("select count(*)::int n from public.applications"));
    expect(rows.rows).toEqual([{ n: 0 }]);
  });

  it("applicant cannot update or delete their own application", async () => {
    await expect(as(db, user(A), (tx) => tx.query("update public.applications set status = 'qualified' where id = $1", [appA]))).rejects.toThrow(/permission denied/);
    await expect(as(db, user(A), (tx) => tx.query("delete from public.applications where id = $1", [appA]))).rejects.toThrow(/permission denied/);
  });

  it("applicant cannot read status history", async () => {
    const r = await as(db, user(A), (tx) => tx.query("select * from public.application_events"));
    expect(r.rows).toEqual([]);
  });

  it("applicant cannot call transition", async () => {
    await expect(as(db, user(A), (tx) => tx.query("select public.transition_application($1, 'qualified', 1)", [appA]))).rejects.toThrow(/not authorized/);
  });

  it("user cannot grant themselves operator or owner", async () => {
    await expect(
      as(db, user(OUTSIDER), (tx) => tx.query("insert into public.operator_grants (user_id, role, reason) values ($1, 'owner', 'self')", [OUTSIDER])),
    ).rejects.toThrow(/permission denied/);
  });
});

describe("operator review", () => {
  it("operator sees all applications", async () => {
    const r = await as(db, user(OP), (tx) => tx.query<{ id: string }>("select id from public.applications where id = any($1)", [[appA, appB]]));
    expect(r.rows).toHaveLength(2);
  });

  it("moves through allowed transitions with an audit trail", async () => {
    const v2 = await as(db, user(OP), (tx) => tx.query<{ v: number }>("select public.transition_application($1, 'triage', 1) v", [appA]));
    expect(v2.rows[0]!.v).toBe(2);
    await as(db, user(OP), (tx) => tx.query("select public.transition_application($1, 'info_requested', 2, 'Need capacity figures')", [appA]));
    const ev = await as(db, user(OP), (tx) =>
      tx.query("select actor_id, from_status, to_status, reason from public.application_events where application_id = $1 order by id", [appA]),
    );
    expect(ev.rows).toEqual([
      { actor_id: null, from_status: null, to_status: "submitted", reason: null },
      { actor_id: OP, from_status: "submitted", to_status: "triage", reason: null },
      { actor_id: OP, from_status: "triage", to_status: "info_requested", reason: "Need capacity figures" },
    ]);
  });

  it("rejects a disallowed transition", async () => {
    await expect(as(db, user(OP), (tx) => tx.query("select public.transition_application($1, 'qualified', 1)", [appB]))).rejects.toThrow(/not allowed/);
  });

  it("rejects a stale version", async () => {
    await expect(as(db, user(OP), (tx) => tx.query("select public.transition_application($1, 'triage', 99)", [appB]))).rejects.toThrow(/stale version/);
  });

  it("requires a reason to decline", async () => {
    await expect(as(db, user(OP), (tx) => tx.query("select public.transition_application($1, 'declined', 1)", [appB]))).rejects.toThrow(/reason required/);
  });

  it("revoked operator loses access", async () => {
    const tmp = randomUUID();
    await makeUser(db, tmp);
    await grantOperator(db, tmp);
    await db.query("update public.operator_grants set revoked_at = now() where user_id = $1", [tmp]);
    const r = await as(db, user(tmp), (tx) => tx.query("select count(*)::int n from public.applications"));
    expect(r.rows).toEqual([{ n: 0 }]);
    await expect(as(db, user(tmp), (tx) => tx.query("select public.transition_application($1, 'triage', 1)", [appB]))).rejects.toThrow(/not authorized/);
  });

  it("allows exactly one active owner", async () => {
    const second = randomUUID();
    await makeUser(db, second);
    await expect(grantOperator(db, second, "owner")).rejects.toThrow(/operator_grants_one_active_owner/);
  });
});
