"use client";

import { useActionState, useState } from "react";
import { submitApplication, type ApplyState } from "./actions";

const input = "mt-1 block w-full rounded-md border border-line bg-panel px-3 py-2 disabled:opacity-60";

function FieldError({ errors, id }: { errors?: string[]; id: string }) {
  if (!errors?.length) return null;
  return <p id={id} className="mt-1 text-sm text-red-700 dark:text-red-400">{errors[0]}</p>;
}

export function ApplyForm({ kind, enabled, consentVersion }: { kind: "producer" | "partner"; enabled: boolean; consentVersion: string }) {
  const [state, action, pending] = useActionState<ApplyState, FormData>(submitApplication, { status: "idle" });
  // One key per form load: a double click or retry returns the same reference.
  const [idempotencyKey] = useState(() => crypto.randomUUID());
  const errors = state.status === "invalid" ? state.fieldErrors : {};
  const producer = kind === "producer";
  const describedBy = (f: string) => (errors[f] ? `${f}-error` : undefined);

  return (
    <form action={action} className="max-w-xl" noValidate>
      <input type="hidden" name="idempotencyKey" value={idempotencyKey} />
      <input type="hidden" name="kind" value={kind} />
      {/* Honeypot: hidden from people and assistive tech. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <fieldset disabled={!enabled || pending} className="space-y-5">
        <legend className="sr-only">{producer ? "Producer application" : "Partner application"}</legend>
        <label className="block">
          <span className="font-semibold">Name</span>
          <input name="name" autoComplete="name" required maxLength={120} className={input} aria-invalid={!!errors.name} aria-describedby={describedBy("name")} />
          <FieldError errors={errors.name} id="name-error" />
        </label>
        <label className="block">
          <span className="font-semibold">Email</span>
          <input name="email" type="email" autoComplete="email" required maxLength={254} className={input} aria-invalid={!!errors.email} aria-describedby={describedBy("email")} />
          <FieldError errors={errors.email} id="email-error" />
        </label>
        <label className="block">
          <span className="font-semibold">{producer ? "Business or farm name (optional)" : "Company name (optional)"}</span>
          <input name="organization" autoComplete="organization" maxLength={160} className={input} />
        </label>
        <label className="block">
          <span className="font-semibold">Location</span>
          <input name="location" required maxLength={160} placeholder="City, state" className={input} aria-invalid={!!errors.location} aria-describedby={describedBy("location")} />
          <FieldError errors={errors.location} id="location-error" />
        </label>
        <label className="block">
          <span className="font-semibold">{producer ? "What do you make, and what is missing?" : "What capability do you provide?"}</span>
          <textarea name="summary" required rows={5} maxLength={4000} className={input} aria-invalid={!!errors.summary} aria-describedby={describedBy("summary") ?? "summary-hint"} />
          <p id="summary-hint" className="mt-1 text-sm text-muted">At least 20 characters. Please do not include confidential documents, pricing, or financial account details.</p>
          <FieldError errors={errors.summary} id="summary-error" />
        </label>
        <label className="block">
          <span className="font-semibold">{producer ? "Current capacity (optional)" : "Capacity and lead times (optional)"}</span>
          <textarea name="capacity" rows={3} maxLength={2000} className={input} />
        </label>
        {producer && (
          <label className="block">
            <span className="font-semibold">Gaps you need filled (optional, comma separated)</span>
            <input name="gaps" maxLength={1000} placeholder="packaging, distribution, marketing" className={input} />
          </label>
        )}
        <label className="block">
          <span className="font-semibold">Timeline (optional)</span>
          <input name="timeline" maxLength={200} className={input} />
        </label>
        <label className="flex items-start gap-3">
          <input type="checkbox" name="consent" required className="mt-1" aria-invalid={!!errors.consent} aria-describedby={describedBy("consent")} />
          <span>
            I agree that Lofgren Enterprise may store these answers to review my application, as described in the{" "}
            <a href="/privacy" className="underline">privacy notice</a> (version {consentVersion}).
          </span>
        </label>
        <FieldError errors={errors.consent} id="consent-error" />
        <button type="submit" className="rounded-md bg-brand px-5 py-3 font-semibold text-brand-ink disabled:opacity-60">
          {pending ? "Sending…" : "Submit application"}
        </button>
      </fieldset>

      <div role="status" aria-live="polite" className="mt-4 text-sm">
        {state.status === "rate_limited" && <p>Too many attempts from your connection. Please try again in an hour.</p>}
        {state.status === "unavailable" && <p>Applications are not open right now, or something went wrong. Please try again later.</p>}
        {state.status === "invalid" && errors.form && <p>{errors.form[0]}</p>}
        {state.status === "invalid" && !errors.form && <p>Please fix the highlighted fields.</p>}
      </div>
    </form>
  );
}
