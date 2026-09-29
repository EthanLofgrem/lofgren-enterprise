import "server-only";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decideAccess, type ConsoleAccess } from "./model";

/**
 * The console signs operators in with Supabase Auth and queries as that
 * user with the publishable key, so database RLS decides what they can see.
 * It never uses the service-role key.
 */
export function consoleConfigured(env: Record<string, string | undefined> = process.env) {
  return !!env.NEXT_PUBLIC_SUPABASE_URL && !!env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
}

/** A new client per request, reading and writing the auth cookies. */
export async function consoleClient(): Promise<SupabaseClient> {
  const store = await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // Server components can't set cookies; src/proxy.ts refreshes the session instead.
        }
      },
    },
  });
}

export async function getConsoleAccess(): Promise<ConsoleAccess> {
  if (!consoleConfigured()) return decideAccess({ configured: false, user: null, isOperator: false });
  const supabase = await consoleClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return decideAccess({ configured: true, user: null, isOperator: false });
  const { data, error } = await supabase.rpc("is_operator");
  return decideAccess({ configured: true, user, isOperator: !error && data === true });
}

/**
 * For console pages and actions: signed-out visitors go to sign-in; anyone
 * else who is not an active operator gets no client and sees a gate page.
 */
export async function requireOperator(): Promise<
  | { access: Extract<ConsoleAccess, { state: "operator" }>; supabase: SupabaseClient }
  | { access: Exclude<ConsoleAccess, { state: "operator" }>; supabase: null }
> {
  const access = await getConsoleAccess();
  if (access.state === "signed_out") redirect("/console/sign-in");
  if (access.state !== "operator") return { access, supabase: null };
  return { access, supabase: await consoleClient() };
}
