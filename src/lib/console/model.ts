/**
 * Pure console logic: access decisions, queue grouping, labels, and error
 * messages. No I/O, so it is unit-tested directly.
 */

export type ApplicationStatus = "submitted" | "triage" | "info_requested" | "qualified" | "declined";

export const STATUS_LABEL: Record<ApplicationStatus, string> = {
  submitted: "New",
  triage: "In review",
  info_requested: "Waiting on applicant",
  qualified: "Potential fit",
  declined: "Declined",
};

/** Button text for moving an application to a status. */
export const ACTION_LABEL: Record<ApplicationStatus, string> = {
  submitted: "Return to new",
  triage: "Start review",
  info_requested: "Request more information",
  qualified: "Mark as potential fit",
  declined: "Decline",
};

export type ConsoleAccess =
  | { state: "unconfigured" }
  | { state: "signed_out" }
  | { state: "denied" }
  | { state: "operator"; userId: string; email: string | null };

export function decideAccess(input: {
  configured: boolean;
  user: { id: string; email?: string | null } | null;
  isOperator: boolean;
}): ConsoleAccess {
  if (!input.configured) return { state: "unconfigured" };
  if (!input.user) return { state: "signed_out" };
  if (!input.isOperator) return { state: "denied" };
  return { state: "operator", userId: input.user.id, email: input.user.email ?? null };
}

export const QUEUE_VIEWS = [
  { key: "new", label: "New" },
  { key: "aging", label: "Aging" },
  { key: "in_review", label: "In review" },
  { key: "waiting", label: "Waiting on applicant" },
  { key: "closed", label: "Closed" },
  { key: "all", label: "All" },
] as const;
export type QueueView = (typeof QUEUE_VIEWS)[number]["key"];

/** Open applications older than this with no decision count as aging. */
export const AGING_DAYS = 3;

export function ageInDays(createdAt: string, now: Date): number {
  return Math.floor((now.getTime() - new Date(createdAt).getTime()) / 86_400_000);
}

/** Which views an application appears in (besides "all"). */
export function viewsFor(app: { status: ApplicationStatus; created_at: string }, now: Date): QueueView[] {
  const views: QueueView[] = [];
  if (app.status === "submitted") views.push("new");
  if (app.status === "triage") views.push("in_review");
  if (app.status === "info_requested") views.push("waiting");
  if (app.status === "qualified" || app.status === "declined") views.push("closed");
  if ((app.status === "submitted" || app.status === "triage") && ageInDays(app.created_at, now) >= AGING_DAYS) views.push("aging");
  return views;
}

export function parseView(raw: string | undefined): QueueView {
  return QUEUE_VIEWS.some((v) => v.key === raw) ? (raw as QueueView) : "new";
}

/** Maps errors raised by transition_application() to operator-facing text. */
export function transitionErrorMessage(err: { code?: string; message?: string } | null): string {
  const code = err?.code ?? "";
  const msg = err?.message ?? "";
  if (code === "40001" || /stale version/.test(msg)) return "Someone else changed this application. Reload the page and try again.";
  if (/reason required/.test(msg)) return "Please give a reason for this decision.";
  if (/not allowed/.test(msg)) return "That change isn't allowed from the current status.";
  if (code === "42501" || /not authorized/.test(msg)) return "Your account can't make this change.";
  if (code === "P0002" || /not found/.test(msg)) return "This application no longer exists.";
  return "The change wasn't saved. Please try again.";
}
