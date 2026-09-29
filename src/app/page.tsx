import Link from "next/link";
import { Icon } from "@/components/icons";
import { CTA, CTABand, IconBadge, SectionHeading, StepList } from "@/components/site";
import { CATEGORIES, EXAMPLES, PROMISES, STEPS, TAGLINE } from "@/lib/content";

const HERO_TEAM = [
  { icon: "palette", role: "Photographer" },
  { icon: "palette", role: "Ceramicist" },
  { icon: "key", role: "Building owner" },
  { icon: "chart", role: "Sales lead" },
  { icon: "coins", role: "Capital partner" },
] as const;

function HeroVisual() {
  return (
    <figure className="relative mx-auto w-full max-w-md" aria-labelledby="hero-visual-caption">
      <div aria-hidden="true" className="absolute -left-6 -top-6 h-40 w-40 rounded-full bg-copper-bright/15" />
      <div aria-hidden="true" className="absolute -bottom-8 -right-4 h-48 w-48 rounded-full bg-brand/10" />
      <div className="relative rounded-2xl border border-line bg-panel p-5 shadow-xl shadow-ink/5 md:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Five people bring</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {HERO_TEAM.map((m) => (
            <li key={m.role} className="flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 text-sm font-medium">
              <Icon name={m.icon} className="h-4 w-4 text-accent" />
              {m.role}
            </li>
          ))}
        </ul>
        <div aria-hidden="true" className="my-4 flex items-center gap-3 text-muted">
          <span className="h-px flex-1 bg-line" />
          <span className="grid h-8 w-8 place-items-center rounded-full border border-line bg-paper">↓</span>
          <span className="h-px flex-1 bg-line" />
        </div>
        <div className="rounded-xl bg-brand p-5 text-brand-ink">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] opacity-80">One business they own</p>
          <p className="mt-1 font-serif text-2xl font-semibold">Gallery &amp; Shop LLC</p>
          <ul className="mt-4 space-y-2 text-sm">
            {["Everyone agreed to the team", "Roles and ownership in one plan", "Agreement signed through DocuSign", "Registered as an LLC"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span aria-hidden="true" className="grid h-5 w-5 place-items-center rounded-full bg-brand-ink/15 text-xs">✓</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <figcaption id="hero-visual-caption" className="mt-3 text-center text-xs text-muted">Illustrative example of how a team comes together.</figcaption>
    </figure>
  );
}

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-14 px-4 pb-16 pt-12 md:pt-20 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-3 py-1 text-sm font-medium text-muted">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-ok" />
            Free to join. You choose who you build with.
          </p>
          <p className="mt-7 text-sm font-semibold uppercase tracking-[0.18em] text-accent">{TAGLINE}</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
            Bring what you do. Build what comes next.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted md:text-xl">
            Lofgren Enterprise connects people who have skills, talents, property, equipment, or capital, then helps them
            turn a good team into a real business: one written agreement, signed by everyone, and an LLC you own together.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <CTA>Create your free account</CTA>
            <CTA href="/how-it-works" variant="secondary">See the 7 steps</CTA>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
            {["No cost to be matched", "Introductions only when you agree", "Nothing binding until everyone signs"].map((t) => (
              <li key={t} className="flex items-center gap-2"><span aria-hidden="true" className="text-ok">✓</span>{t}</li>
            ))}
          </ul>
        </div>
        <HeroVisual />
      </section>

      {/* What Lofgren does, in one line each */}
      <section aria-labelledby="what" className="border-y border-line bg-sand">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 id="what" className="sr-only">What Lofgren Enterprise does</h2>
          <div className="grid gap-10 md:grid-cols-3">
            {([
              { icon: "people", title: "We connect", body: "You tell us what you bring and what interests you. We find people whose strengths fit yours." },
              { icon: "blueprint", title: "We organize", body: "We help the team agree on roles, contributions, and ownership, and put it all in one clear plan." },
              { icon: "building", title: "We make it official", body: "An attorney-prepared agreement, signed through DocuSign, and a new LLC registered for your team." },
            ] as const).map((b) => (
              <div key={b.title} className="flex gap-4">
                <IconBadge name={b.icon} />
                <div>
                  <h3 className="font-serif text-xl font-semibold">{b.title}</h3>
                  <p className="mt-1.5 text-muted">{b.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What people bring */}
      <section aria-labelledby="bring" className="mx-auto max-w-6xl px-4 pt-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            id="bring"
            eyebrow="Who can join"
            title="Anyone with something to contribute."
            intro="A craft, a trade, a talent, a place, a tool, or money. Every business needs a mix of these, and almost nobody has them all."
          />
          <Link href="/who-can-join" className="font-semibold text-accent underline underline-offset-4">See every kind of member</Link>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {CATEGORIES.map((c) => (
            <li key={c.slug} className="flex flex-col rounded-xl border border-line bg-panel p-4 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ink/5 sm:p-5">
              <IconBadge name={c.icon} />
              <h3 className="mt-3 font-semibold leading-snug sm:mt-4">{c.title}</h3>
              <p className="mt-1.5 text-sm text-muted">{c.examples.slice(0, 4).join(", ")}, and more</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Seven steps */}
      <section aria-labelledby="steps" className="mx-auto max-w-6xl px-4 pt-24">
        <SectionHeading
          id="steps"
          eyebrow="How it works"
          title="Seven steps from sign-up to your own business."
          intro={`${STEPS.map((s) => s.name).join(", ")}. You move forward only when you want to, and saying no is always free.`}
        />
        <div className="mt-10"><StepList /></div>
      </section>

      {/* Example teams */}
      <section aria-labelledby="teams" className="mx-auto max-w-6xl px-4 pt-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            id="teams"
            eyebrow="Example teams"
            title="Different people. One business."
            intro="These are illustrative examples of the kinds of teams that could form, not real businesses or results."
          />
          <Link href="/examples" className="font-semibold text-accent underline underline-offset-4">More example teams</Link>
        </div>
        <ul className="mt-10 grid gap-5 lg:grid-cols-3">
          {EXAMPLES.slice(0, 3).map((e) => (
            <li key={e.title} className="flex flex-col rounded-xl border border-line bg-panel p-6">
              <div className="flex items-center gap-3">
                <IconBadge name={e.icon} />
                <span className="rounded-full bg-sand px-2.5 py-1 text-xs font-medium text-muted">Illustrative</span>
              </div>
              <h3 className="mt-4 font-serif text-xl font-semibold">{e.title}</h3>
              <p className="mt-2 text-muted">{e.summary}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {e.team.map((m) => (
                  <li key={m.role} className="rounded-full border border-line px-3 py-1 text-sm">{m.role}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      {/* Promises */}
      <section aria-labelledby="promises" className="mx-auto max-w-6xl px-4 pt-24">
        <SectionHeading id="promises" eyebrow="Why it's easy" title="Simple to start. Fair and clear all the way through." />
        <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {PROMISES.map((p) => (
            <li key={p.title}>
              <IconBadge name={p.icon} />
              <h3 className="mt-4 text-lg font-semibold">{p.title}</h3>
              <p className="mt-1.5 text-muted">{p.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Lofgren's role */}
      <section aria-labelledby="role" className="mx-auto max-w-6xl px-4 pt-24">
        <div className="grid gap-10 rounded-2xl border border-line bg-panel p-6 md:p-10 lg:grid-cols-2">
          <div>
            <SectionHeading id="role" eyebrow="Our role" title="What Lofgren Enterprise does, and how we are paid." />
            <p className="mt-4 text-muted">
              Joining and being matched are free. When a team forms a business, Lofgren Enterprise usually becomes a member of
              the new LLC or receives a fee for organizing it. Those terms are written into the agreement, so you see them before anyone signs.
            </p>
            <Link href="/fees" className="mt-5 inline-block font-semibold text-accent underline underline-offset-4">How fees work</Link>
          </div>
          <ul className="grid gap-4 self-center">
            {[
              ["We do", "Match members, guide the plan, coordinate the attorney, DocuSign, and LLC filing, and support the business after launch."],
              ["We don't", "Guarantee results, promise returns, give legal or tax advice, or hold your money."],
              ["You decide", "Who you work with, what you contribute, and whether to sign."],
            ].map(([h, b]) => (
              <li key={h} className="rounded-lg bg-sand p-4">
                <p className="font-semibold">{h}</p>
                <p className="mt-1 text-muted">{b}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CTABand />
    </>
  );
}
