import type { Metadata } from "next";
import { CTA, Page } from "@/components/site";

export const metadata: Metadata = { title: "For producers" };

export default function Producers() {
  return (
    <Page
      eyebrow="For producers"
      title="Keep making the product. We coordinate the rest."
      intro="If you can produce something consistently but lack a brand, packaging, sales channels, or the right partners, we can help you assess what is missing and assemble it."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-lg border border-line bg-panel p-6">
          <h2 className="text-lg font-semibold">A good fit usually means</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-muted">
            <li>You produce something today, with capacity to grow</li>
            <li>You want to build a brand rather than only sell wholesale</li>
            <li>You are open to working with partners under written agreements</li>
          </ul>
        </section>
        <section className="rounded-lg border border-line bg-panel p-6">
          <h2 className="text-lg font-semibold">What you can expect</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-muted">
            <li>An honest assessment, including when we are not the right fit</li>
            <li>Your information shared only with partners you approve</li>
            <li>A written blueprint before you commit to anything</li>
          </ul>
        </section>
      </div>
      <div className="mt-10"><CTA href="/apply?kind=producer">Apply as a producer</CTA></div>
    </Page>
  );
}
