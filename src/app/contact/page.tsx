import type { Metadata } from "next";
import Link from "next/link";
import { DraftNotice, Page } from "@/components/site";

export const metadata: Metadata = { title: "Contact" };

const input = "mt-1 block w-full rounded-md border border-line bg-panel px-3 py-2.5 disabled:opacity-60";

export default function Contact() {
  return (
    <Page
      eyebrow="Contact"
      title="Talk to a person."
      intro="Have a question before you join? Send us a note. If you are ready to take part, creating an account is the fastest way in: a person reads every one."
    >
      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <DraftNotice>The contact form opens with the public launch. It is shown here as a preview and does not send or store anything.</DraftNotice>
          <form aria-describedby="form-status" className="mt-8 max-w-xl">
            <fieldset disabled className="space-y-5">
              <legend className="sr-only">Contact form preview</legend>
              <label className="block">
                <span className="font-semibold">Name</span>
                <input name="name" autoComplete="name" className={input} />
              </label>
              <label className="block">
                <span className="font-semibold">Email</span>
                <input name="email" type="email" autoComplete="email" className={input} />
              </label>
              <label className="block">
                <span className="font-semibold">Message</span>
                <textarea name="message" rows={5} className={input} />
              </label>
              <button type="submit" className="rounded-md bg-brand px-6 py-3.5 font-semibold text-brand-ink disabled:opacity-60">
                Send message
              </button>
            </fieldset>
            <p id="form-status" className="mt-4 text-sm text-muted">Messages open soon.</p>
          </form>
        </div>
        <aside className="self-start rounded-2xl bg-sand p-6 md:p-8">
          <h2 className="font-serif text-2xl font-semibold">Before you write</h2>
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
