"use client";

import { useActionState } from "react";
import type { SignInState } from "@/lib/console/sign-in";
import { sendSignInLink } from "../actions";

export function SignInForm() {
  const [state, action, pending] = useActionState<SignInState, FormData>(sendSignInLink, { status: "idle" });

  if (state.status === "sent") {
    return (
      <p role="status" className="rounded-xl border border-line bg-panel p-5">
        If this address has console access, a sign-in link is on its way. It works once and expires soon.
      </p>
    );
  }

  return (
    <form action={action} className="max-w-md space-y-4 rounded-xl border border-line bg-panel p-6" noValidate>
      <label className="block">
        <span className="font-semibold">Email</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          aria-invalid={state.status === "invalid"}
          aria-describedby={state.status === "invalid" ? "email-error" : undefined}
          className="mt-1.5 block w-full rounded-lg border border-line bg-paper px-3.5 py-2.5 aria-[invalid=true]:border-bad"
        />
      </label>
      {state.status === "invalid" && <p id="email-error" className="text-sm text-bad">Enter a valid email address.</p>}
      {state.status === "unavailable" && <p className="text-sm text-bad">Sign-in isn&apos;t available in this environment.</p>}
      <button type="submit" disabled={pending} className="rounded-lg bg-brand px-5 py-3 font-semibold text-brand-ink disabled:opacity-60">
        {pending ? "Sending…" : "Email me a sign-in link"}
      </button>
    </form>
  );
}
