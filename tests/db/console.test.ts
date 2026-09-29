import { randomUUID } from "node:crypto";
import { beforeAll, describe, expect, it } from "vitest";
import { as, freshDb, grantOperator, makeUser, submit, validApplication, type Db } from "./harness";

const OP = randomUUID();
const APPLICANT = randomUUID();
const OUTSIDER = randomUUID();
const REVOKED = randomUUID();

const server = { role: "service_role" } as const;
const anon = { role: "anon" } as const;
const user = (sub: string) => ({ role: "authenticated", sub }) as const;

let db: Db;
let appId: string;

beforeAll(async () => {
  db = await freshDb();
  for (const u of [OP, APPLICANT, OUTSIDER, REVOKED]) await makeUser(db, u);
  await grantOperator(db, OP);
  await grantOperator(db, REVOKED);
  await db.query("update public.operator_grants set revoked_at = now() where user_id = $1", [REVOKED]);
  const ref = await as(db, server, (tx) => submit(tx, validApplication(randomUUID())));
  appId = (await db.query<{ id: string }>("select id from public.applications where reference = $1", [ref])).rows[0]!.id;
  await db.query("update public.applications set applicant_user_id = $1 where id = $2", [APPLICANT, appId]);
}, 60_000);

const addNote = (tx: Db, author: string, body = "Called the applicant; strong studio setup.") =>
  tx.query("insert into public.application_notes (application_id, author_id, body) values ($1, $2, $3)", [appId, author, body]);

describe("operator notes", () => {
  it("has RLS enabled", async () => {
    const r = await db.query<{ relrowsecurity: boolean }>("select relrowsecurity from pg_class where oid = 'public.application_notes'::regclass");
    expect(r.rows[0]!.relrowsecurity).toBe(true);
  });

  it("lets an operator add and read notes as themselves", async () => {
    await as(db, user(OP), (tx) => addNote(tx, OP));
    const r = await as(db, user(OP), (tx) => tx.query<{ author_id: string }>("select author_id from public.application_notes where application_id = $1", [appId]));
    expect(r.rows.map((n) => n.author_id)).toContain(OP);
  });

  it("refuses a note written in someone else's name", async () => {
    await expect(as(db, user(OP), (tx) => addNote(tx, OUTSIDER))).rejects.toThrow(/row-level security/);
  });

  it("refuses blank notes", async () => {
    await expect(as(db, user(OP), (tx) => addNote(tx, OP, "   "))).rejects.toThrow();
  });

  it("hides notes from the applicant, outsiders, and revoked operators", async () => {
    for (const who of [APPLICANT, OUTSIDER, REVOKED]) {
      const r = await as(db, user(who), (tx) => tx.query("select count(*)::int n from public.application_notes"));
      expect(r.rows).toEqual([{ n: 0 }]);
    }
  });

  it("refuses notes from non-operators", async () => {
    for (const who of [APPLICANT, OUTSIDER, REVOKED]) {
      await expect(as(db, user(who), (tx) => addNote(tx, who))).rejects.toThrow(/row-level security/);
    }
  });

  it("denies anonymous access entirely", async () => {
    await expect(as(db, anon, (tx) => tx.query("select * from public.application_notes"))).rejects.toThrow(/permission denied/);
    await expect(as(db, anon, (tx) => addNote(tx, OP))).rejects.toThrow(/permission denied/);
  });

  it("is append-only: notes cannot be edited or deleted, even by operators", async () => {
    await expect(as(db, user(OP), (tx) => tx.query("update public.application_notes set body = 'changed'"))).rejects.toThrow(/permission denied/);
    await expect(as(db, user(OP), (tx) => tx.query("delete from public.application_notes"))).rejects.toThrow(/permission denied/);
  });
});

describe("rewritten policies (advisor fixes) keep the same access", () => {
  it("operator sees the application and its history; applicant sees only the application", async () => {
    const opApps = await as(db, user(OP), (tx) => tx.query("select id from public.applications where id = $1", [appId]));
    expect(opApps.rows).toHaveLength(1);
    const opEvents = await as(db, user(OP), (tx) => tx.query("select id from public.application_events where application_id = $1", [appId]));
    expect(opEvents.rows.length).toBeGreaterThan(0);
    const mine = await as(db, user(APPLICANT), (tx) => tx.query("select id from public.applications"));
    expect(mine.rows).toEqual([{ id: appId }]);
    const events = await as(db, user(APPLICANT), (tx) => tx.query("select id from public.application_events"));
    expect(events.rows).toEqual([]);
  });

  it("an outsider sees their own grant rows only (none) and no applications", async () => {
    const grants = await as(db, user(OUTSIDER), (tx) => tx.query("select * from public.operator_grants"));
    expect(grants.rows).toEqual([]);
    const apps = await as(db, user(OUTSIDER), (tx) => tx.query("select count(*)::int n from public.applications"));
    expect(apps.rows).toEqual([{ n: 0 }]);
  });

  it("indexes every foreign key the advisor flagged", async () => {
    const r = await db.query<{ indexname: string }>(
      "select indexname from pg_indexes where schemaname = 'public' and indexname = any($1)",
      [["applications_applicant_user", "application_events_actor", "operator_grants_granted_by", "application_notes_author"]],
    );
    expect(r.rows).toHaveLength(4);
  });
});
