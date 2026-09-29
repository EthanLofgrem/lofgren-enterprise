import Link from "next/link";
import type { ReactNode } from "react";
import { STATUS_LABEL, type ApplicationStatus, type ConsoleAccess } from "@/lib/console/model";
import { signOut } from "./actions";

export function ConsoleFrame({ email, children }: { email?: string | null; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
        <nav aria-label="Console" className="flex items-center gap-5 text-sm">
          <Link href="/console" className="font-serif text-lg font-semibold">Console</Link>
          <Link href="/console" className="text-muted hover:text-ink">Applications</Link>
        </nav>
        {email !== undefined && (
          <form action={signOut} className="flex items-center gap-3 text-sm">
            {email && <span className="text-muted">Signed in as {email}</span>}
            <button type="submit" className="rounded-md border border-line px-3 py-1.5 font-semibold hover:border-ink/40">Sign out</button>
          </form>
        )}
      </div>
      <div className="pt-8">{children}</div>
    </div>
  );
}

/** Shown instead of any data when the visitor may not use the console. */
export function ConsoleGate({ access }: { access: Exclude<ConsoleAccess, { state: "operator" }> }) {
  if (access.state === "unconfigured") {
    return (
      <ConsoleFrame>
        <h1 className="font-serif text-3xl font-semibold">The console isn&apos;t set up here.</h1>
        <p className="mt-3 max-w-xl text-muted">This environment has no Supabase connection, so there is nothing to show and no one can sign in.</p>
      </ConsoleFrame>
    );
  }
  return (
    <ConsoleFrame email={null}>
      <h1 className="font-serif text-3xl font-semibold">This account doesn&apos;t have console access.</h1>
      <p className="mt-3 max-w-xl text-muted">Console access is granted by the owner. If you think this is a mistake, sign out and contact the owner.</p>
    </ConsoleFrame>
  );
}

const STATUS_STYLE: Record<ApplicationStatus, string> = {
  submitted: "border-accent/40 text-accent",
  triage: "border-brand/40 text-brand",
  info_requested: "border-warn/50 text-warn",
  qualified: "border-ok/50 text-ok",
  declined: "border-line text-muted",
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span className={`inline-block whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLE[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Phoenix" });
}
