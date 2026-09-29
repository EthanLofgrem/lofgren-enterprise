import type { Metadata } from "next";
import Link from "next/link";
import { CTABand, Page } from "@/components/site";
import { FAQ } from "@/lib/content";
import { jsonLd, pageMetadata } from "@/lib/site";

// Mirrors the visible questions and answers exactly.
const FAQ_PAGE = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export const metadata: Metadata = pageMetadata({
  title: "Frequently asked questions",
  description: "Plain answers about joining Lofgren Enterprise, matching, ownership, fees, and what happens if a team forms a company.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(FAQ_PAGE) }} />
      <Page eyebrow="FAQ" title="Questions people ask before joining." intro="Short, plain answers. If yours isn't here, contact us.">
        <div className="max-w-3xl divide-y divide-line rounded-2xl border border-line bg-panel">
          {FAQ.map((f) => (
            <details key={f.q} className="group p-5 md:p-6">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                <h2 className="text-lg font-semibold">{f.q}</h2>
                <span aria-hidden="true" className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line text-muted transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-8 text-muted">
          Still have a question? <Link href="/contact" className="font-semibold text-accent underline underline-offset-4">Contact us</Link>.
        </p>
      </Page>
      <CTABand />
    </>
  );
}
