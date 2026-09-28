import { PGlite } from "@electric-sql/pglite";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

/**
 * Disposable in-process Postgres with the parts of Supabase the migrations rely on:
 * anon/authenticated roles, auth.users, auth.uid() from request.jwt.claims, and
 * Supabase's default table grants (so RLS, not missing grants, is what denies).
 */
const SUPABASE_STUB = `
  create role anon nologin;
  create role authenticated nologin;
  create role service_role nologin bypassrls;
  create schema auth;
  create table auth.users (id uuid primary key, email text);
  create function auth.uid() returns uuid language sql stable as $$
    select nullif(current_setting('request.jwt.claims', true)::json->>'sub', '')::uuid
  $$;
  grant usage on schema public, auth to anon, authenticated, service_role;
  grant execute on function auth.uid() to anon, authenticated;
  alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
  alter default privileges in schema public grant all on functions to anon, authenticated, service_role;
  alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
`;

const MIGRATIONS = path.resolve(__dirname, "../../supabase/migrations");

export async function freshDb() {
  const db = new PGlite();
  await db.exec(SUPABASE_STUB);
  for (const file of readdirSync(MIGRATIONS).filter((f) => f.endsWith(".sql")).sort()) {
    await db.exec(readFileSync(path.join(MIGRATIONS, file), "utf8"));
  }
  return db;
}

export type Db = PGlite;
export type Actor = { role: "anon" } | { role: "authenticated"; sub: string } | { role: "postgres" };

/** Runs fn inside a transaction as the given actor, then rolls back role state. */
export async function as<T>(db: Db, actor: Actor, fn: (tx: Db) => Promise<T>): Promise<T> {
  await db.exec("begin");
  try {
    if (actor.role !== "postgres") {
      const claims = JSON.stringify(actor.role === "authenticated" ? { sub: actor.sub, role: "authenticated" } : { role: "anon" });
      await db.query("select set_config('request.jwt.claims', $1, true)", [claims]);
      await db.exec(`set local role ${actor.role}`);
    }
    const out = await fn(db);
    await db.exec("commit");
    return out;
  } catch (e) {
    await db.exec("rollback");
    throw e;
  }
}

export async function makeUser(db: Db, id: string) {
  await db.query("insert into auth.users (id, email) values ($1, $2)", [id, `${id.slice(0, 8)}@test.local`]);
}

export async function grantOperator(db: Db, userId: string, role: "owner" | "operator" = "operator") {
  await db.query("insert into public.operator_grants (user_id, role, reason) values ($1, $2, 'test bootstrap')", [userId, role]);
}

export const validApplication = (key: string, overrides: Record<string, unknown> = {}) => ({
  key,
  kind: "producer",
  name: "Test Producer",
  email: "producer@example.com",
  location: "Walla Walla, WA",
  summary: "Small-batch producer with spare capacity looking for packaging and distribution.",
  consent: "privacy-2026-09-draft",
  ...overrides,
});

export async function submit(tx: Db, a: ReturnType<typeof validApplication>) {
  const r = await tx.query<{ ref: string }>(
    "select public.submit_application($1, $2, $3, $4, $5, $6, $7) as ref",
    [a.key, a.kind, a.name, a.email, a.location, a.summary, a.consent],
  );
  return r.rows[0]!.ref;
}
