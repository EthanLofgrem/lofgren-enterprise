import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import Link from "next/link";
import { CTABand, IconBadge, Page } from "@/components/site";
import { CATEGORIES } from "@/lib/content";

export const metadata: Metadata = pageMetadata({
  title: "Who can join",
  description: "Artists, performers, builders, sellers, tradespeople, and people with space or equipment: anyone 18 or older with something to contribute can join.",
  path: "/who-can-join",
});

export default function WhoCanJoin() {
  return (
    <>
      <Page
        eyebrow="Who can join"
        title="If you can contribute something, you belong here."
        intro="Anyone 18 or older can create an account. You don't need a business idea, a degree, or money. Here are the kinds of things members bring. Most people bring more than one."
      >
        <ul className="grid gap-5 md:grid-cols-2">
          {CATEGORIES.map((c) => (
            <li key={c.slug} id={c.slug} className="scroll-mt-24 rounded-xl border border-line bg-panel p-6">
              <div className="flex items-start gap-4">
                <IconBadge name={c.icon} />
                <div>
                  <h2 className="font-serif text-2xl font-semibold">{c.title}</h2>
                  <p className="mt-1.5 text-muted">{c.body}</p>
                </div>
              </div>
              <ul className="mt-5 flex flex-wrap gap-2" aria-label={`Examples: ${c.title}`}>
                {c.examples.map((e) => (
                  <li key={e} className="rounded-full bg-sand px-3 py-1 text-sm">{e}</li>
                ))}
              </ul>
              {c.slug === "capital" && (
                <p className="mt-4 text-sm text-muted">
                  Capital has special rules. <Link href="/capital-partners" className="font-semibold text-accent underline underline-offset-4">Read about capital partners</Link>.
                </p>
              )}
            </li>
          ))}
        </ul>

        <section aria-labelledby="not-listed" className="mt-12 grid gap-6 rounded-2xl bg-sand p-6 md:grid-cols-[1.4fr_1fr] md:p-10">
          <div>
            <h2 id="not-listed" className="font-serif text-2xl font-semibold md:text-3xl">Don&apos;t see your skill?</h2>
            <p className="mt-3 text-lg text-muted">
              These lists are only examples. Teaching, writing, childcare, fitness, logistics, translation, organizing, or knowing the right
              people: if it could help a business run, tell us about it when you create your account.
            </p>
          </div>
          <div className="grid content-center gap-3">
            <p className="font-semibold">What we look for in every member</p>
            <ul className="space-y-2 text-muted">
              {["Something real to contribute", "Willingness to work with others", "Honesty about your time and resources", "Interest in building for the long term"].map((t) => (
                <li key={t} className="flex gap-2"><span aria-hidden="true" className="text-brand">✓</span>{t}</li>
              ))}
            </ul>
          </div>
        </section>
      </Page>
      <CTABand title="Tell us what you bring." body="It takes a few minutes to create your account. You choose what to share and who you meet." />
    </>
  );
}
