import type { Metadata } from "next";
import { CTABand, Callout, IconBadge, Page, SectionHeading } from "@/components/site";

export const metadata: Metadata = {
  title: "Capital partners",
  description: "How people who contribute money can take part in Lofgren Enterprise teams, and the legal rules that apply.",
};

const HOW = [
  { icon: "user", title: "Create an account", body: "Tell us the kinds of businesses and people you would like to support, and whether you also bring skills or experience." },
  { icon: "shield", title: "We check the rules first", body: "Before any money is discussed with a team, our attorneys confirm what kind of participation is allowed for you and for that business." },
  { icon: "people", title: "Meet a team", body: "You are introduced only to teams that want capital and have agreed to meet. You see their plan, and they learn what you would contribute." },
  { icon: "pen", title: "Agree in writing", body: "Your contribution, your ownership share, and how and when you could be repaid are written into the operating agreement everyone signs." },
] as const;

export default function CapitalPartners() {
  return (
    <>
      <Page
        eyebrow="Capital partners"
        title="Help good teams get started, on clear and lawful terms."
        intro="Some businesses need money to begin: equipment, space, materials, or a first run of product. Capital partners can contribute funds to a team and own a share of the business in return."
      >
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <section aria-labelledby="how-capital">
            <SectionHeading id="how-capital" title="How it works for capital partners" />
            <ol className="mt-8 space-y-6">
              {HOW.map((h, i) => (
                <li key={h.title} className="flex gap-4">
                  <IconBadge name={h.icon} />
                  <div>
                    <h3 className="text-lg font-semibold"><span className="text-accent">{i + 1}.</span> {h.title}</h3>
                    <p className="mt-1 text-muted">{h.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <div className="grid gap-5 self-start">
            <Callout title="Important: money is regulated">
              <p>
                Contributing money to a business in exchange for a share of its profits can be treated as an investment under securities laws.
                Because of that, capital is only accepted on terms our attorneys confirm are allowed. Some opportunities may be limited to
                accredited investors, or to people who also work in the business.
              </p>
            </Callout>
            <div className="rounded-xl border border-line bg-panel p-6">
              <h2 className="font-semibold">What we will never do</h2>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-muted">
                <li>Promise or guarantee a return.</li>
                <li>Hold your money ourselves.</li>
                <li>Pressure you to decide quickly.</li>
                <li>Share your details with a team you haven&apos;t agreed to meet.</li>
              </ul>
            </div>
            <p className="text-sm text-muted">
              Every business carries risk, including the loss of money contributed. Nothing on this site is an offer to sell or a solicitation of an offer to buy any security.
            </p>
          </div>
        </div>
      </Page>
      <CTABand title="Interested in backing a team?" body="Create an account as a capital partner. We will reach out before any opportunity is shared, to explain what applies to you." />
    </>
  );
}
