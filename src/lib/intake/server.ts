import "server-only";
import { createHmac } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import type { IntakeDeps, SubmitArgs } from "./handle";

/** Intake is live only when explicitly enabled and fully configured. */
export function intakeEnabled(env: Record<string, string | undefined> = process.env) {
  return (
    env.INTAKE_ENABLED === "true" &&
    !!env.NEXT_PUBLIC_SUPABASE_URL &&
    !!env.SUPABASE_SECRET_KEY &&
    !!env.INTAKE_HASH_SALT &&
    env.INTAKE_HASH_SALT.length >= 32
  );
}

/** Salted hash of the client address, so raw IPs are never stored. */
export function clientKey(forwardedFor: string | null, salt: string) {
  const ip = (forwardedFor ?? "").split(",")[0]?.trim() || "unknown";
  return createHmac("sha256", salt).update(ip).digest("hex");
}

export function supabaseIntakeDeps(): IntakeDeps {
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return {
    async recordAttempt(key) {
      const { data, error } = await db.rpc("record_intake_attempt", { p_client_key: key });
      if (error) throw new Error("rate limit check failed");
      return data === true;
    },
    async submit(args: SubmitArgs) {
      const { data, error } = await db.rpc("submit_application", args);
      if (error || typeof data !== "string") throw new Error("submit failed");
      return data;
    },
    log(event) {
      console.info(JSON.stringify({ event }));
    },
  };
}
