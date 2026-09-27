import type { Metadata } from "next";
import { CTA, Page } from "@/components/site";

export const metadata: Metadata = { title: "For partners" };

export default function Partners() {
  return (
    <Page
      eyebrow="For partners"
      title="Qualified introductions to producers who need what you do"
      intro="Manufacturers, co-packers, designers, logistics providers, marketers, attorneys, and accountants can join our partner network."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-lg border border-line bg-panel p-6">
          <h2 className="text-lg font-semibold">How introductions work</h2>
          <p className="mt-3 text-muted">
            We propose a match only when your capability, capacity, and location fit a producer&apos;s need.
            Both sides agree to confidentiality before identities are shared, and you choose whether to engage.
          </p>
        </section>
        <section className="rounded-lg border border-line bg-panel p-6">
          <h2 className="text-lg font-semibold">Your listing</h2>
          <p className="mt-3 text-muted">
            Listings are reviewed before they are used for matching. Your contact details are never shown to
            producers without an approved introduction.
          </p>
        </section>
      </div>
      <div className="mt-10"><CTA>Apply as a partner</CTA></div>
    </Page>
  );
}
