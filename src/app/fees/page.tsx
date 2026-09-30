import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { CTABand, DraftNotice, Page, SectionHeading } from "@/components/site";
import { FREE_SERVICES, PAID_SERVICES, type LofgrenService } from "@/lib/services/catalog";
import { LEVELS } from "@/lib/services/complexity";

export const metadata: Metadata = pageMetadata({
  title: "Fees",
  description: "Applying, introductions, and a Team Trial are free. Deeper support is a paid service you choose, priced by the work involved.",
  path: "/fees",
});

const PRICE_LABEL: Record<LofgrenService["pricing"], string> = {
  free: "Free",
  complexity_adjusted: "Priced before you commit",
  custom: "Scoped and priced in writing",
};

function ServiceCard({ service }: { service: LofgrenService }) {
  return (
    <li className="flex flex-col rounded-xl border border-line bg-panel p-6">
      <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted">
        <span className="rounded-full bg-sand px-2.5 py-1">Stage: {service.stage}</span>
        {service.status === "planned" && <span className="rounded-full border border-line px-2.5 py-1">Not open yet</span>}
      </div>
      <h3 className="mt-3 text-lg font-semibold">{service.name}</h3>
      <p className="mt-1 font-serif text-xl font-semibold text-accent">{PRICE_LABEL[service.pricing]}</p>
      <p className="mt-2 text-muted">{service.summary}</p>
      <p className="mt-4 text-sm font-semibold">Includes</p>
      <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-muted">
        {service.includes.map((i) => <li key={i}>{i}</li>)}
      </ul>
      <p className="mt-3 text-sm font-semibold">Doesn&apos;t include</p>
      <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-muted">
        {service.excludes.map((e) => <li key={e}>{e}</li>)}
      </ul>
    </li>
  );
}

export default function Fees() {
  return (
    <>
      <Page
        eyebrow="Fees"
        title="Join free. Pay only for the help you choose."
        intro="Applying, opt-in introductions, and a self-guided Team Trial are free. If your team wants deeper support, it chooses a defined service, and the price is agreed before any work starts."
      >
        <DraftNotice>Pre-launch: none of these services is open yet, nothing is being charged, and nothing on this page can be bought.</DraftNotice>

        <section aria-labelledby="free" className="mt-12">
          <SectionHeading id="free" title="Free" intro="Everything you need to find people and test whether a team works." />
          <ul className="mt-6 grid gap-5 md:grid-cols-3">
            {FREE_SERVICES.map((s) => <ServiceCard key={s.id} service={s} />)}
          </ul>
        </section>

        <section aria-labelledby="paid" className="mt-16">
          <SectionHeading
            id="paid"
            title="Paid support, only if your team chooses it"
            intro="Each service has a defined scope. You see the price, what's included, and what isn't before you agree to anything."
          />
          <ul className="mt-6 grid gap-5 md:grid-cols-2">
            {PAID_SERVICES.map((s) => <ServiceCard key={s.id} service={s} />)}
          </ul>
        </section>

        <section aria-labelledby="why" className="mt-16 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <SectionHeading
            id="why"
            title="Why prices differ"
            intro="The price of deeper support depends on the work involved, not on the name of the industry. A simple service business and one with a location, staff, or permits need different amounts of planning and coordination. Every paid service has a minimum price."
          />
          <dl className="grid gap-3">
            {LEVELS.map((l) => (
              <div key={l.level} className="rounded-lg bg-sand p-4">
                <dt className="font-semibold">{l.name}</dt>
                <dd className="mt-1 text-muted">{l.body}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="forming" className="mt-16 max-w-3xl">
          <h2 id="forming" className="font-serif text-2xl font-semibold">Forming a company</h2>
          <p className="mt-3 text-muted">
            If a team decides to form a company, state filing fees and its own attorney&apos;s or accountant&apos;s fees are paid directly to
            those providers. We don&apos;t mark them up.
          </p>
          <p className="mt-4 text-muted">
            Paying for a Lofgren Enterprise service doesn&apos;t guarantee a match, a team, funding, a company, customers, revenue, or profit,
            and it never buys a share of a business. Lofgren Enterprise doesn&apos;t own any part of your business automatically.
          </p>
        </section>
      </Page>
      <CTABand />
    </>
  );
}
