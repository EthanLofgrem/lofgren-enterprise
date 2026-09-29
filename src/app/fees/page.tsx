import type { Metadata } from "next";
import { CTABand, DraftNotice, Page } from "@/components/site";

export const metadata: Metadata = {
  title: "Fees",
  description: "Joining Lofgren Enterprise and being matched are free. Our share or fee for forming a business is written into each agreement before anyone signs.",
};

const FEES = [
  { term: "Creating an account", price: "Free", body: "Sign up, build your profile, and update it any time." },
  { term: "Matching and introductions", price: "Free", body: "We review your profile, suggest teams, and make introductions at no cost." },
  {
    term: "When a business forms",
    price: "Set in your agreement",
    body: "Lofgren Enterprise may become a member of the new LLC, receive a fee for organizing it, or both. The exact terms are written into the operating agreement you review before signing.",
  },
  {
    term: "Formation costs",
    price: "Paid by the new business",
    body: "State filing fees and attorney costs for the agreement are business expenses. The team agrees how they are covered as part of the plan.",
  },
] as const;

export default function Fees() {
  return (
    <>
      <Page eyebrow="Fees" title="Free to join. Clear terms if you build." intro="You should know how we are paid before you ever meet a team. Here it is, plainly.">
        <DraftNotice>Pre-launch: specific percentages and amounts are not published yet. They are set in writing for each business, before anyone signs.</DraftNotice>
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
          If no business forms, you owe nothing. We recommend every member review the agreement with their own attorney or accountant before signing.
        </p>
      </Page>
      <CTABand />
    </>
  );
}
