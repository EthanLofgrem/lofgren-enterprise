import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { STATUS_LABEL, type ApplicationStatus } from "@/lib/console/model";
import { requireOperator } from "@/lib/console/server";
import { ConsoleFrame, ConsoleGate, formatDate, StatusBadge } from "../../ui";
import { NoteForm, StatusForm } from "./forms";

export const metadata: Metadata = { title: "Application", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

type Application = {
  id: string;
  reference: string;
  kind: string;
  status: ApplicationStatus;
  version: number;
  name: string;
  email: string;
  organization: string | null;
  location: string;
  summary: string;
  capacity: string | null;
  gaps: string[];
  goals: string | null;
  timeline: string | null;
  consent_version: string;
  consented_at: string;
  created_at: string;
  updated_at: string;
};
type Event = { id: number; actor_id: string | null; from_status: ApplicationStatus | null; to_status: ApplicationStatus; reason: string | null; created_at: string };
type Note = { id: number; author_id: string; body: string; created_at: string };
type Transition = { to_status: ApplicationStatus; requires_reason: boolean };

export default async function ApplicationDetail({ params }: { params: Promise<{ id: string }> }) {
  const { access, supabase } = await requireOperator();
  if (!supabase) return <ConsoleGate access={access} />;

  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();

  const { data: app } = await supabase.from("applications").select("*").eq("id", id).maybeSingle<Application>();
  if (!app) notFound();

  const [events, notes, transitions] = await Promise.all([
    supabase.from("application_events").select("id, actor_id, from_status, to_status, reason, created_at").eq("application_id", id).order("id"),
    supabase.from("application_notes").select("id, author_id, body, created_at").eq("application_id", id).order("id"),
    supabase.from("application_transitions").select("to_status, requires_reason").eq("from_status", app.status),
  ]);
  const who = (actor: string | null) => (actor === null ? "Applicant (web form)" : actor === access.userId ? "You" : `Operator ${actor.slice(0, 8)}`);

  const answers: [string, string | null][] = [
    ["Email", app.email],
    ["Location", app.location],
    ["Business name", app.organization],
    ["Brings", app.gaps.length ? app.gaps.join(", ") : null],
    ["About their skills and resources", app.summary],
    ["Time and resources", app.capacity],
    ["Interests", app.goals],
    ["Could start", app.timeline],
    ["Consent", `${app.consent_version}, ${formatDate(app.consented_at)}`],
  ];

  return (
    <ConsoleFrame email={access.email}>
      <p className="text-sm"><Link href="/console" className="text-accent underline underline-offset-4">Back to applications</Link></p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="font-serif text-3xl font-semibold">{app.name}</h1>
        <StatusBadge status={app.status} />
      </div>
      <p className="mt-2 text-sm text-muted">
        <span className="font-mono">{app.reference}</span> · <span className="capitalize">{app.kind}</span> · Submitted {formatDate(app.created_at)} · Version {app.version}
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-8">
          <section aria-labelledby="answers">
            <h2 id="answers" className="text-lg font-semibold">What they submitted</h2>
            <dl className="mt-3 divide-y divide-line rounded-xl border border-line bg-panel text-sm">
              {answers.map(([k, v]) => (
                <div key={k} className="grid gap-1 px-4 py-3 sm:grid-cols-[12rem_1fr]">
                  <dt className="font-semibold">{k}</dt>
                  <dd className="whitespace-pre-wrap break-words text-muted">{v ?? "Not provided"}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="history">
            <h2 id="history" className="text-lg font-semibold">History</h2>
            {events.error ? (
              <p className="mt-3 text-sm text-bad">Unavailable.</p>
            ) : (
              <ol className="mt-3 space-y-3">
                {(events.data as Event[]).map((e) => (
                  <li key={e.id} className="rounded-lg border border-line bg-panel p-3 text-sm">
                    <p>
                      <span className="font-semibold">{e.from_status ? `${STATUS_LABEL[e.from_status]} → ${STATUS_LABEL[e.to_status]}` : "Submitted"}</span>
                      <span className="text-muted"> · {who(e.actor_id)} · {formatDate(e.created_at)}</span>
                    </p>
                    {e.reason && <p className="mt-1 whitespace-pre-wrap text-muted">Reason: {e.reason}</p>}
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>

        <aside className="space-y-8">
          <section aria-labelledby="decide">
            <h2 id="decide" className="text-lg font-semibold">Decide</h2>
            {transitions.error ? (
              <p className="mt-3 text-sm text-bad">Unavailable.</p>
            ) : (transitions.data as Transition[]).length === 0 ? (
              <p className="mt-3 text-sm text-muted">No further changes are allowed from {STATUS_LABEL[app.status]}.</p>
            ) : (
              <div className="mt-3 space-y-3">
                {(transitions.data as Transition[]).map((t) => (
                  <StatusForm key={t.to_status} id={app.id} version={app.version} to={t.to_status} requiresReason={t.requires_reason} />
                ))}
                <p className="text-xs text-muted">Requesting more information records the request; it does not email the applicant yet. Contact them directly.</p>
              </div>
            )}
          </section>

          <section aria-labelledby="notes">
            <h2 id="notes" className="text-lg font-semibold">Notes</h2>
            {notes.error ? (
              <p className="mt-3 text-sm text-bad">Unavailable.</p>
            ) : (notes.data as Note[]).length === 0 ? (
              <p className="mt-3 text-sm text-muted">No notes yet.</p>
            ) : (
              <ol className="mt-3 space-y-3">
                {(notes.data as Note[]).map((n) => (
                  <li key={n.id} className="rounded-lg border border-line bg-panel p-3 text-sm">
                    <p className="text-muted">{who(n.author_id)} · {formatDate(n.created_at)}</p>
                    <p className="mt-1 whitespace-pre-wrap">{n.body}</p>
                  </li>
                ))}
              </ol>
            )}
            <div className="mt-4"><NoteForm id={app.id} /></div>
          </section>
        </aside>
      </div>
    </ConsoleFrame>
  );
}
