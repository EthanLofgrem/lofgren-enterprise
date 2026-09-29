import { readFileSync } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { beforeAll, describe, expect, it } from "vitest";
import { freshDb, type Db } from "./harness";

// Runs the real hand-run SQL in supabase/snippets/owner-access.sql.
const SNIPPET = readFileSync(path.resolve(__dirname, "../../supabase/snippets/owner-access.sql"), "utf8");
const statements = SNIPPET.split("\n")
  .filter((l) => !l.trimStart().startsWith("--"))
  .join("\n")
  .split(";")
  .map((s) => s.trim())
  .filter(Boolean);
const [grantOwner, grantOperator, revoke, whoHasAccess] = statements as [string, string, string, string];

const run = (db: Db, sql: string, emails: Record<string, string>) =>
  db.query(sql.replaceAll("OWNER_EMAIL", emails.owner ?? "").replaceAll("OPERATOR_EMAIL", emails.operator ?? ""));

let db: Db;
const OWNER = randomUUID();
const OPERATOR = randomUUID();
const UNCONFIRMED = randomUUID();

beforeAll(async () => {
  db = await freshDb();
  await db.query("insert into auth.users (id, email) values ($1, 'owner@example.test'), ($2, 'op@example.test')", [OWNER, OPERATOR]);
  await db.query("insert into auth.users (id, email, email_confirmed_at) values ($1, 'new@example.test', null)", [UNCONFIRMED]);
}, 60_000);

describe("owner access snippet", () => {
  it("has the four documented blocks", () => {
    expect(statements).toHaveLength(4);
  });

  it("refuses an owner whose email is not confirmed", async () => {
    const r = await run(db, grantOwner, { owner: "new@example.test" });
    expect(r.rows).toHaveLength(0);
  });

  it("grants the first owner, matching the email case-insensitively", async () => {
    const r = await run(db, grantOwner, { owner: "Owner@Example.test" });
    expect(r.rows).toEqual([expect.objectContaining({ user_id: OWNER, role: "owner" })]);
  });

  it("does nothing when an active owner already exists", async () => {
    const r = await run(db, grantOwner, { owner: "op@example.test" });
    expect(r.rows).toHaveLength(0);
  });

  it("grants an operator, recording the owner as granter", async () => {
    await run(db, grantOperator, { operator: "op@example.test" });
    const g = await db.query<{ role: string; granted_by: string }>("select role, granted_by from public.operator_grants where user_id = $1", [OPERATOR]);
    expect(g.rows).toEqual([{ role: "operator", granted_by: OWNER }]);
  });

  it("lists who has access, then revokes the operator but keeps the record", async () => {
    const before = await run(db, whoHasAccess, {});
    expect(before.rows.map((r) => (r as { email: string }).email).sort()).toEqual(["op@example.test", "owner@example.test"]);
    const r = await run(db, revoke, { operator: "op@example.test" });
    expect(r.rows).toHaveLength(1);
    const after = await run(db, whoHasAccess, {});
    expect(after.rows).toHaveLength(1);
    const kept = await db.query("select revoked_at from public.operator_grants where user_id = $1", [OPERATOR]);
    expect(kept.rows).toHaveLength(1);
  });
});
