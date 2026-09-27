import Link from "next/link";
import { CTA, Steps } from "@/components/site";

const STEPS = [
  { title: "Tell us what you make", body: "Describe your product, what you can produce today, and where you want it to go." },
  { title: "Find the gaps", body: "Together we identify what is missing: packaging, distribution, marketing, compliance, or capital planning." },
  { title: "Meet vetted partners", body: "We introduce partners who can fill those gaps, after both sides agree to confidentiality terms." },
  { title: "Launch with a plan", body: "You get a written venture blueprint with costs, margins, and proposed terms to review with your own advisers." },
] as const;

export default function Home() {
  return (
    <>
      <section className="mx-auto max-w-5xl px-4 pb-12 pt-14 md:pt-24">
        <p className="text-sm font-semibold uppercase tracking-wide text-accent">Venture orchestration</p>
        <h1 className="mt-3 max-w-3xl font-serif text-4xl font-semibold leading-tight md:text-6xl">
          You already make something good. We help you build the business around it.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted">
          Lofgren Enterprise works with producers who have a real product but are missing pieces:
          the partners, plan, and agreements that turn production into a brand. We coordinate those
          pieces and stay involved after launch.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <CTA>Start a conversation</CTA>
          <Link href="/how-it-works" className="font-semibold underline underline-offset-4">See how it works</Link>
        </div>
      </section>

      <section aria-labelledby="process" className="mx-auto max-w-5xl px-4 py-12">
        <h2 id="process" className="font-serif text-2xl font-semibold md:text-3xl">The process, in four steps</h2>
        <div className="mt-6"><Steps items={STEPS} /></div>
      </section>

      <section aria-labelledby="who" className="mx-auto grid max-w-5xl gap-6 px-4 py-12 md:grid-cols-2">
        <h2 id="who" className="sr-only">Who we work with</h2>
        <div className="rounded-lg border border-line bg-panel p-6">
          <h3 className="font-serif text-xl font-semibold">Producers</h3>
          <p className="mt-2 text-muted">You have capacity and a product. You want a brand, a channel, and a partner who handles coordination.</p>
          <Link href="/producers" className="mt-4 inline-block font-semibold underline underline-offset-4">For producers</Link>
        </div>
        <div className="rounded-lg border border-line bg-panel p-6">
          <h3 className="font-serif text-xl font-semibold">Partners and professionals</h3>
          <p className="mt-2 text-muted">You provide a capability such as manufacturing, design, logistics, legal, or accounting, and want qualified introductions.</p>
          <Link href="/partners" className="mt-4 inline-block font-semibold underline underline-offset-4">For partners</Link>
        </div>
      </section>
    </>
  );
}
