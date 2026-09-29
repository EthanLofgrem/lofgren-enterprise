import { z } from "zod";

export type SignInState = { status: "idle" | "sent" | "invalid" | "unavailable" };

const emailSchema = z.string().trim().toLowerCase().max(254).pipe(z.email());

/**
 * Sends a sign-in link only to existing accounts (public signup stays off).
 * The answer is the same whether or not the address has an account, so the
 * form can't be used to discover who has console access.
 */
export async function requestSignInLink(
  rawEmail: unknown,
  redirectTo: string,
  send: (email: string, redirectTo: string) => Promise<{ error: { status?: number } | null }>,
  log: (event: string, detail?: Record<string, unknown>) => void = () => {},
): Promise<SignInState> {
  const parsed = emailSchema.safeParse(rawEmail);
  if (!parsed.success) return { status: "invalid" };
  try {
    const { error } = await send(parsed.data, redirectTo);
    if (error) log("console.sign_in_link_error", { status: error.status });
  } catch {
    log("console.sign_in_link_error");
  }
  return { status: "sent" };
}
