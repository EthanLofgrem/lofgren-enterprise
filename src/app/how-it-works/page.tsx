import type { Metadata } from "next";
import { Icon } from "@/components/icons";
import { CTABand, Callout, DraftNotice, Page, SectionHeading } from "@/components/site";
import { STEPS } from "@/lib/content";

export const metadata: Metadata = {
  title: "How it works",
  description: "The seven steps from creating a free account to owning a business with your team: match, meet, plan, sign through DocuSign, and form your LLC.",
};

const EXITS: Record<number, string> = {
  2: "Not the right fit? Decline the match and we keep looking. Anyone can say no after meeting, at no cost.",
  3: "If something doesn't check out, anyone can walk away at no cost.",
  4: "If the team can't agree on the plan, everyone walks away free.",
  5: "Nothing is binding until every member signs.",
  6: "If the pilot falls short, the team can redesign, pause, or close the business under its agreement.",
};

export default function HowItWorks() {
  return (
    <>
      <Page
        eyebrow="How it works"
        title="Qualify. Discover. Diligence. Blueprint. Assemble. Pilot. Operate."
        intro="Seven steps from sign-up to a business you own. Joining is free, and you only move forward when you choose to. Here is exactly what happens at each step, what you do, and what we do."
      >
        <div className="mb-10 max-w-3xl">
          <DraftNotice>
            Pre-launch: this is how the process is designed to work once accounts open. Each team&apos;s agreement, DocuSign signing,
            and LLC filing will be handled case by case with licensed professionals.
          </DraftNotice>
        </div>
        <ol className="relative">
          {STEPS.map((s, i) => (
            <li key={s.n} className="relative grid gap-4 pb-12 pl-16 md:grid-cols-[1fr_1.1fr] md:gap-10 md:pl-24">
              {i < STEPS.length - 1 && (
                <span aria-hidden="true" className="absolute left-[23px] top-14 bottom-0 w-px bg-line md:left-[35px]" />
              )}
              <span
                aria-hidden="true"
                className="absolute left-0 top-0 grid h-12 w-12 place-items-center rounded-full bg-brand font-serif text-lg font-semibold text-brand-ink md:h-[72px] md:w-[72px] md:text-2xl"
              >
                {s.n}
              </span>
              <div>
                <p className="text-sm font-semibold text-accent">Step {s.n} of 7</p>
                <h2 className="mt-1 font-serif text-3xl font-semibold md:text-4xl">{s.name}</h2>
                <p className="mt-1 text-lg font-semibold">{s.title}</p>
                <p className="mt-3 text-lg leading-relaxed text-muted">{s.body}</p>
              </div>
              <div className="grid gap-3 self-start sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
                <div className="rounded-xl border border-line bg-panel p-4">
                  <p className="flex items-center gap-2 text-sm font-semibold"><Icon name="user" className="h-4 w-4 text-accent" />What you do</p>
                  <p className="mt-1.5 text-muted">{s.you}</p>
                </div>
                <div className="rounded-xl border border-line bg-panel p-4">
                  <p className="flex items-center gap-2 text-sm font-semibold"><Icon name="people" className="h-4 w-4 text-accent" />What we do</p>
                  <p className="mt-1.5 text-muted">{s.us}</p>
                </div>
                {EXITS[s.n] && (
                  <p className="rounded-lg bg-sand px-4 py-3 text-sm sm:col-span-2 md:col-span-1 lg:col-span-2">
                    <span className="font-semibold">You can stop here. </span>
                    <span className="text-muted">{EXITS[s.n]}</span>
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>

        <section aria-labelledby="official" className="mt-12 grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              id="official"
              eyebrow="Making it official"
              title="The agreement and your LLC, in plain English."
            />
            <div className="mt-5 space-y-4 text-lg leading-relaxed text-muted">
              <p>
                <strong className="text-ink">The operating agreement</strong> is the rulebook for your business. It names every member,
                what each person contributes, their role, their ownership share, how profits are shared, how decisions are made, and what happens if someone leaves.
              </p>
              <p>
                <strong className="text-ink">DocuSign</strong> lets everyone read and sign that agreement online from any device. Each member gets a copy of the signed agreement.
              </p>
              <p>
                <strong className="text-ink">The LLC</strong> (limited liability company) is registered with your state. It separates the business from each member&apos;s personal finances and records who owns what.
              </p>
            </div>
          </div>
          <div className="grid gap-4 self-start">
            <Callout title="Protections built into every step">
              <ul className="list-disc space-y-1.5 pl-5">
                <li>Introductions happen only when both sides agree.</li>
                <li>Agreements are prepared with a licensed attorney.</li>
                <li>You are encouraged to have your own lawyer or accountant review the agreement.</li>
                <li>Lofgren&apos;s own share or fee is written into the agreement before anyone signs.</li>
                <li>Money is only contributed on terms our attorneys confirm are allowed.</li>
              </ul>
            </Callout>
            <p className="text-sm text-muted">
              Lofgren Enterprise coordinates this process with licensed professionals. We are not a law firm and do not give legal, tax, or investment advice.
            </p>
          </div>
        </section>
      </Page>
      <CTABand title="Step 1 takes a few minutes." body="Create your free account and tell us what you bring. We will take it from there, one step at a time." />
    </>
  );
}
