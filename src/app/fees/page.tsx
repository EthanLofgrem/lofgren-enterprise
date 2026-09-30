import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { CTABand, DraftNotice, Page } from "@/components/site";

export const metadata: Metadata = pageMetadata({
  title: "Fees",
  description: "Applying to Lofgren Enterprise and being matched are free. Lofgren is paid only for services a team or business chooses, under written terms.",
  path: "/fees",
});

const FEES = [
  { term: "Applying", price: "Free", body: "Tell us what you bring. Applying does not commit you to anything." },
  { term: "Matching and introductions", price: "Free", body: "We review your profile, suggest teams, and make introductions at no cost." },
  {
    term: "Planning, pilot, and operating support",
    price: "Service fees, in writing",
    body: "If a team or business chooses our support, it pays for defined services under a written agreement it can end. Lofgren Enterprise doesn't own any part of your business automatically.",
  },
  {
    term: "Forming a company",
    price: "Paid to your own providers",
    body: "If a team formalizes, state filing fees and its own attorney's or accountant's fees are paid directly to those providers. We don't mark them up.",
  },
] as const;

export default function Fees() {
  return (
    <>
      <Page eyebrow="Fees" title="Free to join. Clear terms for any support." intro="You should know how we are paid before you ever meet a team. Here it is, plainly.">
        <DraftNotice>Pre-launch: service prices are not published yet, and no fees are being charged. Prices will be published before anyone is asked to pay.</DraftNotice>
        <dl className="mt-8 grid gap-5 md:grid-cols-2">
          {FEES.map((f) => (
            <div key={f.term} className="rounded-xl border border-line bg-panel p-6">
              <dt className="text-lg font-semibold">{f.term}</dt>
              <dd>
                <p className="mt-1 font-serif text-2xl font-semibold text-accent">{f.price}</p>
                <p className="mt-2 text-muted">{f.body}</p>
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-8 max-w-2xl text-muted">
          Applying and matching are free today. We recommend every member review any agreement with their own attorney or accountant before signing.
        </p>
      </Page>
      <CTABand />
    </>
  );
}
