import { randomUUID } from "node:crypto";
import { beforeAll, describe, expect, it } from "vitest";
import { as, freshDb, type Db } from "./harness";

const server = { role: "service_role" } as const;
const anon = { role: "anon" } as const;
let db: Db;

const key = () => `k_${randomUUID().replaceAll("-", "")}`;
const attempt = (tx: Db, k: string, limit = 3) =>
  tx.query<{ ok: boolean }>("select public.record_intake_attempt($1, $2) as ok", [k, limit]).then((r) => r.rows[0]!.ok);

beforeAll(async () => {
  db = await freshDb();
}, 60_000);

describe("record_intake_attempt", () => {
  it("allows up to the limit, then refuses", async () => {
    const k = key();
    const results = [];
    for (let i = 0; i < 4; i++) results.push(await as(db, server, (tx) => attempt(tx, k)));
    expect(results).toEqual([true, true, true, false]);
  });

  it("counts each client separately", async () => {
    const a = key();
    for (let i = 0; i < 3; i++) await as(db, server, (tx) => attempt(tx, a));
    expect(await as(db, server, (tx) => attempt(tx, a))).toBe(false);
    expect(await as(db, server, (tx) => attempt(tx, key()))).toBe(true);
  });

  it("forgets attempts outside the window", async () => {
    const k = key();
    for (let i = 0; i < 3; i++) await as(db, server, (tx) => attempt(tx, k));
    await db.query("update public.intake_attempts set created_at = now() - interval '2 hours' where client_key = $1", [k]);
    expect(await as(db, server, (tx) => attempt(tx, k))).toBe(true);
  });

  it("rejects out-of-range limits", async () => {
    await expect(as(db, server, (tx) => attempt(tx, key(), 1000))).rejects.toThrow(/invalid limit/);
  });

  it("cannot be called by anonymous or signed-in clients", async () => {
    await expect(as(db, anon, (tx) => attempt(tx, key()))).rejects.toThrow(/permission denied/);
    await expect(as(db, { role: "authenticated", sub: randomUUID() }, (tx) => attempt(tx, key()))).rejects.toThrow(/permission denied/);
  });

  it("attempt log is not readable by clients", async () => {
    await expect(as(db, anon, (tx) => tx.query("select * from public.intake_attempts"))).rejects.toThrow(/permission denied/);
  });
});
