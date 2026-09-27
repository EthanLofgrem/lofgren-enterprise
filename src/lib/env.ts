import "server-only";

export const SERVER_KEYS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_SECRET_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "NEXT_PUBLIC_APP_URL",
] as const;

export type ServerKey = (typeof SERVER_KEYS)[number];

/**
 * Returns the requested server configuration or throws naming only the missing
 * variables. Call at the point of use so unrelated routes do not need every key.
 */
export function requireEnv<K extends ServerKey>(
  keys: readonly K[],
  env: Record<string, string | undefined> = process.env,
): Record<K, string> {
  const missing = keys.filter((k) => !env[k]);
  if (missing.length) throw new Error(`Missing server configuration: ${missing.join(", ")}`);
  if (env.VERCEL_ENV !== "production" && keys.includes("STRIPE_SECRET_KEY" as K)) {
    if (!env.STRIPE_SECRET_KEY!.startsWith("sk_test_") && !env.STRIPE_SECRET_KEY!.startsWith("rk_test_"))
      throw new Error("Non-production environments must use a Stripe test-mode key");
  }
  return Object.fromEntries(keys.map((k) => [k, env[k]!])) as Record<K, string>;
}
