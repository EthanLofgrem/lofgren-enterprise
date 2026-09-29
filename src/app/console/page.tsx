import type { Metadata } from "next";
import Link from "next/link";
import { ageInDays, parseView, QUEUE_VIEWS, viewsFor, type ApplicationStatus } from "@/lib/console/model";
import { requireOperator } from "@/lib/console/server";
import { ConsoleFrame, ConsoleGate, formatDate, StatusBadge } from "./ui";

export const metadata: Metadata = { title: "Console", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

type Row = {
  id: string;
  reference: string;
  kind: string;
  status: ApplicationStatus;
  name: string;
  location: string;
  created_at: string;
  updated_at: string;
};

export default async function Queue({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const { access, supabase } = await requireOperator();
  if (!supabase) return <ConsoleGate access={access} />;

  const view = parseView((await searchParams).view);
  const { data, error } = await supabase
    .from("applications")
    .select("id, reference, kind, status, name, location, created_at, updated_at")
    .order("created_at", { ascending: false })
    .limit(500);
  const loadedAt = new Date();
  const apps = (data ?? []) as Row[];
  const counts = Object.fromEntries(QUEUE_VIEWS.map((v) => [v.key, v.key === "all" ? apps.length : apps.filter((a) => viewsFor(a, loadedAt).includes(v.key)).length]));
  const rows = view === "all" ? apps : apps.filter((a) => viewsFor(a, loadedAt).includes(view));

  return (
    <ConsoleFrame email={access.email}>
      <h1 className="font-serif text-3xl font-semibold">Applications</h1>
      <p className="mt-2 text-sm text-muted">
        {error ? "Unavailable: the application list could not be loaded." : `Loaded ${formatDate(loadedAt.toISOString())} (Arizona time). Aging means open with no decision for 3 or more days.`}
      </p>

      <nav aria-label="Queue views" className="mt-6 flex flex-wrap gap-2">
        {QUEUE_VIEWS.map((v) => (
          <Link
            key={v.key}
            href={`/console?view=${v.key}`}
            aria-current={v.key === view ? "page" : undefined}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold ${v.key === view ? "border-brand bg-brand text-brand-ink" : "border-line hover:border-ink/40"}`}
          >
            {v.label} <span className="font-normal">({error ? "–" : counts[v.key]})</span>
          </Link>
        ))}
      </nav>

      {error ? (
        <p role="alert" className="mt-6 rounded-lg border border-bad/40 p-4 text-bad">Unavailable. Reload the page to try again.</p>
      ) : rows.length === 0 ? (
        <p className="mt-6 rounded-lg border border-line bg-panel p-6 text-muted">No applications in this view.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-line bg-panel">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <caption className="sr-only">Applications in the {QUEUE_VIEWS.find((v) => v.key === view)?.label} view</caption>
            <thead className="border-b border-line text-muted">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">Reference</th>
                <th scope="col" className="px-4 py-3 font-semibold">Name</th>
                <th scope="col" className="px-4 py-3 font-semibold">Type</th>
                <th scope="col" className="px-4 py-3 font-semibold">Location</th>
                <th scope="col" className="px-4 py-3 font-semibold">Status</th>
                <th scope="col" className="px-4 py-3 font-semibold">Age</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.id} className="border-b border-line last:border-0">
                  <th scope="row" className="px-4 py-3 font-mono font-medium">
                    <Link href={`/console/applications/${a.id}`} className="text-accent underline underline-offset-4">{a.reference}</Link>
                  </th>
                  <td className="px-4 py-3">{a.name}</td>
                  <td className="px-4 py-3 capitalize">{a.kind}</td>
                  <td className="px-4 py-3">{a.location}</td>
                  <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                  <td className="px-4 py-3 whitespace-nowrap">{ageInDays(a.created_at, loadedAt)} days</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </ConsoleFrame>
  );
}
