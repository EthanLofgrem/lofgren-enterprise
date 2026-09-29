import type { Metadata } from "next";
import { CTABand, IconBadge, Page } from "@/components/site";
import { EXAMPLES } from "@/lib/content";

export const metadata: Metadata = {
  title: "Example teams",
  description: "Illustrative examples of businesses Lofgren Enterprise members could build together: galleries, production companies, renovation businesses, food brands, and more.",
};

export default function Examples() {
  return (
    <>
      <Page
        eyebrow="Example teams"
        title="Businesses that could start with the right people."
        intro="These are illustrative examples, not real businesses or results. They show how different skills and resources can combine into one company that everyone owns a share of."
      >
        <ul className="grid gap-6 lg:grid-cols-2">
          {EXAMPLES.map((e) => (
            <li key={e.title} className="flex flex-col rounded-2xl border border-line bg-panel p-6 md:p-8">
              <div className="flex items-center justify-between gap-3">
                <IconBadge name={e.icon} />
                <span className="rounded-full bg-sand px-2.5 py-1 text-xs font-medium text-muted">Illustrative example</span>
              </div>
              <h2 className="mt-5 font-serif text-2xl font-semibold">{e.title}</h2>
              <p className="mt-2 text-muted">{e.summary}</p>
              <table className="mt-6 w-full text-left text-sm">
                <caption className="sr-only">Who is on the {e.title} team and what they bring</caption>
                <thead>
                  <tr className="border-b border-line text-muted">
                    <th scope="col" className="py-2 pr-4 font-semibold">Member</th>
                    <th scope="col" className="py-2 font-semibold">Brings</th>
                  </tr>
                </thead>
                <tbody>
                  {e.team.map((m) => (
                    <tr key={m.role} className="border-b border-line last:border-0">
                      <th scope="row" className="py-2.5 pr-4 font-medium">{m.role}</th>
                      <td className="py-2.5 text-muted">{m.brings}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-5 rounded-lg bg-sand px-4 py-3 text-sm text-muted">
                Each member&apos;s role and ownership share would be agreed by the team and written into the LLC&apos;s operating agreement.
              </p>
            </li>
          ))}
        </ul>
      </Page>
      <CTABand title="Your team could be next." body="Create an account and tell us which kinds of businesses interest you. We look for the people who fit." />
    </>
  );
}
