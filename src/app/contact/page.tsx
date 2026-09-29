import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import Link from "next/link";
import { CTA, Page } from "@/components/site";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: "Questions before you apply to Lofgren Enterprise? Where to find answers about the seven steps and fees, and when the contact form opens.",
  path: "/contact",
});

export default function Contact() {
  return (
    <Page
      eyebrow="Contact"
      title="Questions? Start here."
      intro="Have a question before you apply? These pages answer most of them. If you are ready to take part, applying is the fastest way in: a person reads every application."
    >
      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <section aria-labelledby="messages-closed" className="max-w-xl rounded-2xl border border-line bg-panel p-6 md:p-8">
            <h2 id="messages-closed" className="font-serif text-2xl font-semibold">Messages aren&apos;t open yet.</h2>
            <p className="mt-3 text-muted">
              The contact form opens with the public launch. Until then there is no way to send us a message through this site, and nothing
              you type anywhere here is stored.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <CTA href="/faq">Read the FAQ</CTA>
              <CTA href="/how-it-works" variant="secondary">See the 7 steps</CTA>
            </div>
          </section>
        </div>
        <aside className="self-start rounded-2xl bg-sand p-6 md:p-8">
          <h2 className="font-serif text-2xl font-semibold">Good places to start</h2>
          <ul className="mt-4 space-y-3 text-muted">
            <li><Link href="/how-it-works" className="font-semibold text-ink underline underline-offset-4">How it works</Link> explains all seven steps.</li>
            <li><Link href="/fees" className="font-semibold text-ink underline underline-offset-4">Fees</Link> shows how we are paid.</li>
            <li><Link href="/faq" className="font-semibold text-ink underline underline-offset-4">FAQ</Link> answers the most common questions.</li>
          </ul>
          <p className="mt-6 text-sm text-muted">Please don&apos;t send confidential documents, bank details, or ID numbers by message.</p>
        </aside>
      </div>
    </Page>
  );
}
