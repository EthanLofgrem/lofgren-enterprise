"use client";

import { useActionState } from "react";
import { ACTION_LABEL, type ApplicationStatus } from "@/lib/console/model";
import { addNote, changeStatus, type ActionState } from "../../actions";

function Result({ state }: { state: ActionState }) {
  if (state.status === "idle") return null;
  return (
    <p role={state.status === "error" ? "alert" : "status"} className={`text-sm ${state.status === "error" ? "text-bad" : "text-ok"}`}>
      {state.message}
    </p>
  );
}

export function StatusForm({
  id,
  version,
  to,
  requiresReason,
}: {
  id: string;
  version: number;
  to: ApplicationStatus;
  requiresReason: boolean;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(changeStatus, { status: "idle" });
  const reasonId = `reason-${to}`;
  return (
    <form action={action} className="space-y-3 rounded-xl border border-line bg-panel p-4">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="to" value={to} />
      <input type="hidden" name="version" value={version} />
      <label htmlFor={reasonId} className="block text-sm font-semibold">
        Reason {requiresReason ? <span className="font-normal text-muted">(required)</span> : <span className="font-normal text-muted">(optional)</span>}
      </label>
      <textarea id={reasonId} name="reason" rows={2} maxLength={2000} required={requiresReason} className="block w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm" />
      <button type="submit" disabled={pending} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-ink disabled:opacity-60">
        {pending ? "Saving…" : ACTION_LABEL[to]}
      </button>
      <Result state={state} />
    </form>
  );
}

export function NoteForm({ id }: { id: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(addNote, { status: "idle" });
  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="id" value={id} />
      <label htmlFor="note-body" className="block text-sm font-semibold">Add a private note</label>
      <textarea id="note-body" name="body" rows={3} maxLength={4000} required className="block w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm" />
      <p className="text-xs text-muted">Notes are visible to operators only and can&apos;t be edited later. Add a new note to correct one.</p>
      <button type="submit" disabled={pending} className="rounded-lg border border-line px-4 py-2 text-sm font-semibold hover:border-ink/40 disabled:opacity-60">
        {pending ? "Saving…" : "Add note"}
      </button>
      <Result state={state} />
    </form>
  );
}
