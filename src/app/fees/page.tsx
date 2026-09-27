import type { Metadata } from "next";
import { CTA, DraftNotice, Page } from "@/components/site";

export const metadata: Metadata = { title: "Fees" };

const FEES = [
  { term: "Applying", body: "Free. The application and first call cost nothing." },
  { term: "Setup fee", body: "A one-time fee, agreed in advance and in writing, for assessment, matching, and blueprint work." },
  {
    term: "Ongoing terms",
    body: "Where we stay involved after launch, compensation may be a management fee, a revenue share, or equity, but only under a signed agreement. Nothing is owed without one.",
  },
] as const;

export default function Fees() {
  return (
    <Page eyebrow="Fees" title="How Lofgren Enterprise is paid" intro="We want you to know how our compensation works before your first call.">
      <DraftNotice>
        Pre-launch: specific amounts are not yet published. Terms are set in a written agreement for each venture.
      </DraftNotice>
      <dl className="mt-8 grid gap-6 md:grid-cols-3">
        {FEES.map((f) => (
          <div key={f.term} className="rounded-lg border border-line bg-panel p-6">
            <dt className="text-lg font-semibold">{f.term}</dt>
            <dd className="mt-2 text-muted">{f.body}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-8 max-w-2xl text-muted">
        We do not charge partners for introductions. We recommend every party review agreements with their own
        attorney and accountant.
      </p>
      <div className="mt-10"><CTA>Ask a question</CTA></div>
    </Page>
  );
}
