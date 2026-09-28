"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { handleIntake, type IntakeResult } from "@/lib/intake/handle";
import { clientKey, intakeEnabled, supabaseIntakeDeps } from "@/lib/intake/server";

export type ApplyState = Exclude<IntakeResult, { status: "received" }> | { status: "idle" };

export async function submitApplication(_prev: ApplyState, form: FormData): Promise<ApplyState> {
  if (!intakeEnabled()) return { status: "unavailable" };

  const h = await headers();
  const key = clientKey(h.get("x-forwarded-for"), process.env.INTAKE_HASH_SALT!);
  const result = await handleIntake(form, key, supabaseIntakeDeps());

  if (result.status === "received") {
    redirect(result.reference ? `/apply/received?ref=${encodeURIComponent(result.reference)}` : "/apply/received");
  }
  return result;
}
