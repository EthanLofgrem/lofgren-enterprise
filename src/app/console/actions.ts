"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { transitionErrorMessage } from "@/lib/console/model";
import { consoleClient, consoleConfigured, requireOperator } from "@/lib/console/server";
import { requestSignInLink, type SignInState } from "@/lib/console/sign-in";

export type ActionState = { status: "idle" } | { status: "ok"; message: string } | { status: "error"; message: string };

const log = (event: string, detail?: Record<string, unknown>) => console.info(JSON.stringify({ event, ...detail }));

async function callbackUrl() {
  // Supabase only sends links to URLs on the project's redirect allowlist,
  // so a forged Host header cannot redirect a sign-in link elsewhere.
  const h = await headers();
  const origin = process.env.NEXT_PUBLIC_APP_URL || `${h.get("x-forwarded-proto") ?? "https"}://${h.get("x-forwarded-host") ?? h.get("host")}`;
  return `${origin}/console/auth/callback`;
}

export async function sendSignInLink(_prev: SignInState, form: FormData): Promise<SignInState> {
  if (!consoleConfigured()) return { status: "unavailable" };
  const supabase = await consoleClient();
  return requestSignInLink(
    form.get("email"),
    await callbackUrl(),
    (email, emailRedirectTo) => supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: false, emailRedirectTo } }),
    log,
  );
}

export async function signOut() {
  if (consoleConfigured()) {
    const supabase = await consoleClient();
    await supabase.auth.signOut();
  }
  redirect("/console/sign-in");
}

const STATUSES = ["submitted", "triage", "info_requested", "qualified", "declined"] as const;

const transitionInput = z.object({
  id: z.uuid(),
  to: z.enum(STATUSES),
  version: z.coerce.number().int().positive(),
  reason: z.string().trim().max(2000).optional(),
});

export async function changeStatus(_prev: ActionState, form: FormData): Promise<ActionState> {
  const { supabase } = await requireOperator();
  if (!supabase) return { status: "error", message: "Your account can't make this change." };
  const parsed = transitionInput.safeParse({
    id: form.get("id"),
    to: form.get("to"),
    version: form.get("version"),
    reason: form.get("reason") ?? undefined,
  });
  if (!parsed.success) return { status: "error", message: "The change wasn't saved. Please reload and try again." };
  const { id, to, version, reason } = parsed.data;
  const { error } = await supabase.rpc("transition_application", {
    p_application_id: id,
    p_to: to,
    p_expected_version: version,
    p_reason: reason || null,
  });
  if (error) {
    log("console.transition_failed", { code: error.code });
    return { status: "error", message: transitionErrorMessage(error) };
  }
  revalidatePath(`/console/applications/${id}`);
  revalidatePath("/console");
  return { status: "ok", message: "Saved." };
}

const noteInput = z.object({ id: z.uuid(), body: z.string().trim().min(1).max(4000) });

export async function addNote(_prev: ActionState, form: FormData): Promise<ActionState> {
  const { access, supabase } = await requireOperator();
  if (!supabase) return { status: "error", message: "Your account can't add notes." };
  const parsed = noteInput.safeParse({ id: form.get("id"), body: form.get("body") });
  if (!parsed.success) return { status: "error", message: "Write a note of up to 4,000 characters." };
  const { error } = await supabase
    .from("application_notes")
    .insert({ application_id: parsed.data.id, author_id: access.userId, body: parsed.data.body });
  if (error) {
    log("console.note_failed", { code: error.code });
    return { status: "error", message: "The note wasn't saved. Please try again." };
  }
  revalidatePath(`/console/applications/${parsed.data.id}`);
  return { status: "ok", message: "Note added." };
}
