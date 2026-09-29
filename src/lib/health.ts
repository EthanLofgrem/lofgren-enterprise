export type HealthReport = {
  app: "lofgren-enterprise";
  status: "ok";
  commit: string | null;
  deployment: string | null;
  environment: string;
  checks: { supabase: "configured" | "not_configured"; stripe: "configured" | "not_configured" };
};

type Env = Record<string, string | undefined>;

const present = (env: Env, ...names: string[]) =>
  names.every((n) => typeof env[n] === "string" && env[n] !== "");

/** Safe readiness summary: identities and booleans only, never values of secrets. */
export function getHealth(env: Env): HealthReport {
  return {
    app: "lofgren-enterprise",
    status: "ok",
    commit: env.VERCEL_GIT_COMMIT_SHA || env.GIT_COMMIT_SHA || null,
    deployment: env.VERCEL_DEPLOYMENT_ID || null,
    environment: env.VERCEL_ENV || env.NODE_ENV || "development",
    checks: {
      supabase: present(env, "NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY")
        ? "configured"
        : "not_configured",
      stripe: present(env, "STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET") ? "configured" : "not_configured",
    },
  };
}
