import { applicationSchema, CONSENT_VERSION } from "@/lib/validation/application";

export type IntakeResult =
  | { status: "received"; reference: string | null }
  | { status: "invalid"; fieldErrors: Record<string, string[]> }
  | { status: "rate_limited" }
  | { status: "unavailable" };

export type IntakeDeps = {
  /** Records the attempt; false means the client is over its limit. */
  recordAttempt: (clientKey: string) => Promise<boolean>;
  /** Calls submit_application with the server-only key; returns the reference. */
  submit: (input: SubmitArgs) => Promise<string>;
  log?: (event: string, detail?: Record<string, unknown>) => void;
};

export type SubmitArgs = {
  p_idempotency_key: string;
  p_kind: "producer" | "partner" | "member";
  p_name: string;
  p_email: string;
  p_location: string;
  p_summary: string;
  p_consent_version: string;
  p_organization: string | null;
  p_capacity: string | null;
  p_gaps: string[];
  p_goals: string | null;
  p_timeline: string | null;
};

export const MAX_FORM_BYTES = 16_000;

/** Converts FormData into the shape the schema expects. */
export function formToObject(form: FormData) {
  const get = (k: string) => {
    const v = form.get(k);
    return typeof v === "string" ? v : undefined;
  };
  return {
    idempotencyKey: get("idempotencyKey"),
    kind: get("kind"),
    name: get("name"),
    email: get("email"),
    organization: get("organization"),
    location: get("location"),
    summary: get("summary"),
    capacity: get("capacity"),
    // Accepts checkbox groups (repeated "gaps") and comma-separated text alike.
    gaps: form
      .getAll("gaps")
      .flatMap((v) => (typeof v === "string" ? v.split(",") : []))
      .map((s) => s.trim())
      .filter(Boolean),
    goals: get("goals"),
    timeline: get("timeline"),
    consent: form.get("consent") === "on" ? true : false,
    adult: form.get("adult") === "on",
    website: get("website"),
  };
}

function formBytes(form: FormData) {
  let n = 0;
  for (const [k, v] of form.entries()) n += k.length + (typeof v === "string" ? v.length : v.size);
  return n;
}

/**
 * Order matters: size check, validation and honeypot, rate limit, then the
 * database call. Only a submission that would be stored uses up a rate-limit
 * attempt, so an applicant fixing typos is never locked out. Rejected input
 * never reaches the database. Errors never reveal whether an application or
 * email already exists.
 */
export async function handleIntake(form: FormData, clientKey: string, deps: IntakeDeps): Promise<IntakeResult> {
  const log = deps.log ?? (() => {});

  if (formBytes(form) > MAX_FORM_BYTES) {
    log("intake.too_large");
    return { status: "invalid", fieldErrors: { form: ["Your answers are too long. Please shorten them."] } };
  }

  const parsed = applicationSchema.safeParse(formToObject(form));
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? "form");
      if (field === "website") {
        // Honeypot filled: answer like a success so bots learn nothing, store nothing.
        log("intake.honeypot");
        return { status: "received", reference: null };
      }
      (fieldErrors[field] ??= []).push(issue.message);
    }
    return { status: "invalid", fieldErrors };
  }

  let allowed: boolean;
  try {
    allowed = await deps.recordAttempt(clientKey);
  } catch {
    log("intake.rate_check_failed");
    return { status: "unavailable" }; // fail closed
  }
  if (!allowed) {
    log("intake.rate_limited");
    return { status: "rate_limited" };
  }

  const a = parsed.data;
  try {
    const reference = await deps.submit({
      p_idempotency_key: a.idempotencyKey,
      p_kind: a.kind,
      p_name: a.name,
      p_email: a.email,
      p_location: a.location,
      p_summary: a.summary,
      p_consent_version: CONSENT_VERSION,
      p_organization: a.organization ?? null,
      p_capacity: a.capacity ?? null,
      p_gaps: a.gaps,
      p_goals: a.goals ?? null,
      p_timeline: a.timeline ?? null,
    });
    log("intake.received", { kind: a.kind });
    return { status: "received", reference };
  } catch {
    log("intake.submit_failed");
    return { status: "unavailable" };
  }
}
