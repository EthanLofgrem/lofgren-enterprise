"use client";

import { useActionState, useRef, useState } from "react";
import { submitApplication, type JoinState } from "./actions";

export type Category = { slug: string; title: string };

const STEP_TITLES = ["About you", "What you bring", "What you want to build", "Review and create"] as const;

/** Which step each server-side field error belongs to, so we can jump back to it. */
const FIELD_STEP: Record<string, number> = {
  name: 0, email: 0, location: 0, organization: 0,
  gaps: 1, summary: 1, capacity: 1,
  goals: 2, timeline: 2,
  consent: 3, adult: 3,
};

const TIMELINES = ["Right away", "In 1 to 3 months", "In 3 to 6 months", "Just exploring for now"] as const;

const input =
  "mt-1.5 block w-full rounded-lg border border-line bg-panel px-3.5 py-2.5 text-base placeholder:text-muted/70 aria-[invalid=true]:border-bad";

function FieldError({ errors, id }: { errors?: string[]; id: string }) {
  if (!errors?.length) return null;
  return <p id={id} className="mt-1.5 text-sm text-bad">{errors[0]}</p>;
}

function Hint({ id, children }: { id: string; children: React.ReactNode }) {
  return <p id={id} className="mt-1.5 text-sm text-muted">{children}</p>;
}

export function JoinForm({ enabled, consentVersion, categories }: { enabled: boolean; consentVersion: string; categories: readonly Category[] }) {
  const [state, action, pending] = useActionState<JoinState, FormData>(submitApplication, { status: "idle" });
  // One key per form load: a double click or retry returns the same reference.
  const [idempotencyKey] = useState(() => crypto.randomUUID());
  const [step, setStep] = useState(0);
  const [review, setReview] = useState<Record<string, string>>({});
  const [groupError, setGroupError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const stepRefs = useRef<(HTMLFieldSetElement | null)[]>([]);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const serverErrors = state.status === "invalid" ? state.fieldErrors : {};
  const errorStep = Math.min(...Object.keys(serverErrors).map((f) => FIELD_STEP[f] ?? 3), 99);
  const [shownErrorFor, setShownErrorFor] = useState<JoinState | null>(null);
  // After a server response with field errors, jump once to the first step that has one.
  if (state.status === "invalid" && shownErrorFor !== state && errorStep < 99) {
    setShownErrorFor(state);
    setStep(errorStep);
  }
  const describedBy = (f: string, hint?: string) => [serverErrors[f] ? `${f}-error` : null, hint].filter(Boolean).join(" ") || undefined;

  function go(to: number) {
    setStep(to);
    requestAnimationFrame(() => headingRef.current?.focus());
  }

  /** Validates the current step in the browser so people fix mistakes before anything is sent. */
  function next() {
    const fs = stepRefs.current[step];
    if (!fs) return;
    const fields = Array.from(fs.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>("input, textarea, select"));
    for (const el of fields) {
      if (!el.checkValidity()) {
        el.reportValidity();
        el.focus();
        return;
      }
    }
    if (step === 1 && !fs.querySelector<HTMLInputElement>('input[name="gaps"]:checked')) {
      setGroupError("Choose at least one thing you bring.");
      fs.querySelector<HTMLInputElement>('input[name="gaps"]')?.focus();
      return;
    }
    setGroupError(null);
    if (step === 2 && formRef.current) {
      const data = new FormData(formRef.current);
      setReview({
        Name: String(data.get("name") ?? ""),
        Email: String(data.get("email") ?? ""),
        Location: String(data.get("location") ?? ""),
        "Business name": String(data.get("organization") ?? "") || "None yet",
        "You bring": data.getAll("gaps").map((g) => categories.find((c) => c.slug === g)?.title ?? String(g)).join("; "),
        "About your skills": String(data.get("summary") ?? ""),
        "Time and resources": String(data.get("capacity") ?? "") || "Not specified",
        Interests: String(data.get("goals") ?? "") || "Not specified",
        "Could start": String(data.get("timeline") ?? "") || "Not specified",
      });
    }
    go(step + 1);
  }

  return (
    <form ref={formRef} action={action} noValidate className="rounded-2xl border border-line bg-panel p-5 shadow-xl shadow-ink/5 md:p-8">
      <input type="hidden" name="idempotencyKey" value={idempotencyKey} />
      <input type="hidden" name="kind" value="member" />
      {/* Honeypot: hidden from people and assistive tech. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <ol className="grid grid-cols-4 gap-2" aria-label="Sign-up progress">
        {STEP_TITLES.map((t, i) => (
          <li key={t} aria-current={i === step ? "step" : undefined}>
            <span className={`block h-1.5 rounded-full ${i <= step ? "bg-brand" : "bg-line"}`} />
            <span className={`mt-2 hidden text-xs font-medium sm:block ${i === step ? "text-ink" : "text-muted"}`}>{t}</span>
          </li>
        ))}
      </ol>
      <h2 ref={headingRef} tabIndex={-1} className="mt-6 font-serif text-2xl font-semibold outline-none md:text-3xl">
        <span className="sr-only">Step {step + 1} of 4: </span>{STEP_TITLES[step]}
      </h2>
      <p className="mt-1 text-sm text-muted">Step {step + 1} of 4</p>

      {/* Step 1: About you */}
      <fieldset ref={(el) => { stepRefs.current[0] = el; }} hidden={step !== 0} className="mt-6 space-y-5">
        <legend className="sr-only">About you</legend>
        <label className="block">
          <span className="font-semibold">Full name</span>
          <input name="name" autoComplete="name" required minLength={2} maxLength={120} className={input} aria-invalid={!!serverErrors.name} aria-describedby={describedBy("name")} />
          <FieldError errors={serverErrors.name} id="name-error" />
        </label>
        <label className="block">
          <span className="font-semibold">Email</span>
          <input name="email" type="email" autoComplete="email" required maxLength={254} className={input} aria-invalid={!!serverErrors.email} aria-describedby={describedBy("email", "email-hint")} />
          <Hint id="email-hint">We will send your account confirmation here.</Hint>
          <FieldError errors={serverErrors.email} id="email-error" />
        </label>
        <label className="block">
          <span className="font-semibold">Where are you based?</span>
          <input name="location" autoComplete="address-level2" required minLength={2} maxLength={160} placeholder="City, state" className={input} aria-invalid={!!serverErrors.location} aria-describedby={describedBy("location")} />
          <FieldError errors={serverErrors.location} id="location-error" />
        </label>
        <label className="block">
          <span className="font-semibold">Business name <span className="font-normal text-muted">(optional)</span></span>
          <input name="organization" autoComplete="organization" maxLength={160} className={input} aria-describedby="organization-hint" />
          <Hint id="organization-hint">Only if you already run a business. Most members don&apos;t.</Hint>
        </label>
      </fieldset>

      {/* Step 2: What you bring */}
      <fieldset ref={(el) => { stepRefs.current[1] = el; }} hidden={step !== 1} className="mt-6 space-y-6">
        <legend className="sr-only">What you bring</legend>
        <div role="group" aria-labelledby="gaps-label" aria-describedby={groupError || serverErrors.gaps ? "gaps-error" : "gaps-hint"}>
          <p id="gaps-label" className="font-semibold">What can you contribute?</p>
          <Hint id="gaps-hint">Choose everything that applies.</Hint>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {categories.map((c) => (
              <label key={c.slug} className="flex cursor-pointer items-center gap-3 rounded-lg border border-line px-3.5 py-3 has-[:checked]:border-brand has-[:checked]:bg-brand-soft">
                <input type="checkbox" name="gaps" value={c.slug} className="h-4 w-4 accent-[var(--color-brand)]" onChange={() => setGroupError(null)} />
                <span>{c.title}</span>
              </label>
            ))}
          </div>
          {(groupError || serverErrors.gaps) && <p id="gaps-error" className="mt-2 text-sm text-bad">{groupError ?? serverErrors.gaps?.[0]}</p>}
        </div>
        <label className="block">
          <span className="font-semibold">Tell us about your skills, talents, or resources</span>
          <textarea name="summary" required minLength={20} maxLength={4000} rows={5} placeholder="For example: I'm a wedding photographer with 8 years of experience and my own studio lighting." className={input} aria-invalid={!!serverErrors.summary} aria-describedby={describedBy("summary", "summary-hint")} />
          <Hint id="summary-hint">At least 20 characters. Please don&apos;t include bank details, ID numbers, or confidential documents.</Hint>
          <FieldError errors={serverErrors.summary} id="summary-error" />
        </label>
        <label className="block">
          <span className="font-semibold">Time and resources you could commit <span className="font-normal text-muted">(optional)</span></span>
          <textarea name="capacity" maxLength={2000} rows={3} placeholder="For example: about 15 hours a week, weekends, a work van." className={input} />
        </label>
      </fieldset>

      {/* Step 3: What you want to build */}
      <fieldset ref={(el) => { stepRefs.current[2] = el; }} hidden={step !== 2} className="mt-6 space-y-5">
        <legend className="sr-only">What you want to build</legend>
        <label className="block">
          <span className="font-semibold">What kinds of businesses or people interest you?</span>
          <textarea name="goals" maxLength={2000} rows={5} placeholder="For example: I'd love to be part of a gallery or a creative studio with other artists." className={input} aria-describedby="goals-hint" />
          <Hint id="goals-hint">No idea yet? That&apos;s fine. Tell us what you enjoy and we&apos;ll suggest options.</Hint>
        </label>
        <label className="block">
          <span className="font-semibold">When could you start?</span>
          <select name="timeline" defaultValue={TIMELINES[0]} className={input}>
            {TIMELINES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </label>
      </fieldset>

      {/* Step 4: Review and create */}
      <fieldset ref={(el) => { stepRefs.current[3] = el; }} hidden={step !== 3} disabled={pending} className="mt-6 space-y-5">
        <legend className="sr-only">Review and create your account</legend>
        <dl className="divide-y divide-line rounded-xl border border-line bg-paper text-sm">
          {Object.entries(review).map(([k, v]) => (
            <div key={k} className="grid gap-1 px-4 py-3 sm:grid-cols-[10rem_1fr]">
              <dt className="font-semibold">{k}</dt>
              <dd className="break-words text-muted">{v}</dd>
            </div>
          ))}
        </dl>
        <label className="flex items-start gap-3">
          <input type="checkbox" name="adult" required className="mt-1 h-4 w-4 accent-[var(--color-brand)]" aria-invalid={!!serverErrors.adult} aria-describedby={serverErrors.adult ? "adult-error" : undefined} />
          <span>I am 18 or older.</span>
        </label>
        <FieldError errors={serverErrors.adult} id="adult-error" />
        <label className="flex items-start gap-3">
          <input type="checkbox" name="consent" required className="mt-1 h-4 w-4 accent-[var(--color-brand)]" aria-invalid={!!serverErrors.consent} aria-describedby={serverErrors.consent ? "consent-error" : undefined} />
          <span>
            Lofgren Enterprise may store my answers to review my profile and suggest matches, as described in the{" "}
            <a href="/privacy" className="underline">privacy notice</a> (version {consentVersion}). My profile is shared only with people I agree to meet.
          </span>
        </label>
        <FieldError errors={serverErrors.consent} id="consent-error" />
      </fieldset>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
        {step > 0 ? (
          <button type="button" onClick={() => go(step - 1)} className="rounded-lg border border-line px-5 py-3 font-semibold hover:border-ink/40">
            Back
          </button>
        ) : <span />}
        {step < 3 ? (
          <button type="button" onClick={next} className="rounded-lg bg-brand px-6 py-3 font-semibold text-brand-ink hover:opacity-90">
            Continue
          </button>
        ) : (
          <button type="submit" disabled={!enabled || pending} className="rounded-lg bg-brand px-6 py-3 font-semibold text-brand-ink hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
            {pending ? "Creating your account…" : "Create my account"}
          </button>
        )}
      </div>

      <div role="status" aria-live="polite" className="mt-4 text-sm">
        {!enabled && step === 3 && <p className="text-muted">Sign-up opens soon. You can look through every step, but nothing is sent yet.</p>}
        {state.status === "rate_limited" && <p className="text-bad">Too many attempts from your connection. Please try again in an hour.</p>}
        {state.status === "unavailable" && enabled && <p className="text-bad">Something went wrong on our side. Please try again in a few minutes.</p>}
        {state.status === "invalid" && serverErrors.form && <p className="text-bad">{serverErrors.form[0]}</p>}
        {state.status === "invalid" && !serverErrors.form && <p className="text-bad">Please fix the highlighted answers.</p>}
      </div>
    </form>
  );
}
