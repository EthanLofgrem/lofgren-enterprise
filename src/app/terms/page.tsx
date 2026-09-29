import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { DraftNotice, Page } from "@/components/site";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Terms (draft)",
  description: "Draft terms of service for Lofgren Enterprise, awaiting owner and attorney review before the site opens to the public.",
  path: "/terms",
});

// Draft written from what the service actually does today. Bracketed items
// are decisions for the owner and counsel.
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-serif text-2xl font-semibold text-ink">{title}</h2>
      {children}
    </section>
  );
}

const Blank = ({ children }: { children: ReactNode }) => <mark className="rounded bg-warn/15 px-1 text-ink">[{children}]</mark>;

export default function Terms() {
  return (
    <Page eyebrow="Draft" title="Terms of service">
      <DraftNotice>Draft for owner and attorney review. Not final, and not legal advice. Items in brackets still need a decision.</DraftNotice>

      <div className="mt-10 max-w-3xl space-y-10 leading-relaxed text-muted">
        <Section title="About these terms">
          <p>
            These terms apply to your use of the Lofgren Enterprise website, operated by <Blank>legal entity name and state</Blank>. By using the
            site or submitting an application, you agree to them. Our{" "}
            <Link href="/privacy" className="font-semibold text-accent underline underline-offset-4">privacy notice</Link> explains how we handle
            your information.
          </p>
        </Section>

        <Section title="What the website is, and is not">
          <p>
            The website explains how Lofgren Enterprise works and lets you apply to be considered as a member. Applying is free. An application is
            not a match, an approval, an offer, or an agreement, and it does not create a partnership, company, or ownership interest.
          </p>
          <p>
            Any business you form with other members would be governed only by a separate written agreement signed by everyone involved. Nothing on
            this website is binding until then.
          </p>
        </Section>

        <Section title="No advice, no guarantees">
          <p>
            Lofgren Enterprise is not a law firm, accounting firm, or investment adviser. Nothing on the website is legal, tax, financial, or
            investment advice. We do not guarantee any match, business result, income, or return.
          </p>
          <p>
            Nothing on the website is an offer to sell, or a request for an offer to buy, any security or investment. We do not accept money
            through the website.
          </p>
        </Section>

        <Section title="Who can apply">
          <p>You must be 18 or older and able to enter into agreements. You agree to give accurate information about yourself and what you can contribute.</p>
        </Section>

        <Section title="Acceptable use">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Don&apos;t submit false information or apply on someone else&apos;s behalf without permission.</li>
            <li>Don&apos;t submit confidential information you don&apos;t have the right to share.</li>
            <li>Don&apos;t try to access areas you aren&apos;t authorized to use, disrupt the site, or send automated or bulk submissions.</li>
          </ul>
          <p>We may decline or remove any application at our discretion.</p>
        </Section>

        <Section title="Content">
          <p>
            You keep ownership of what you submit. You allow us to use it to review your application and, with your agreement, to introduce you
            to other members. The website&apos;s own text, design, and branding belong to Lofgren Enterprise.
          </p>
        </Section>

        <Section title="Liability">
          <p>
            The website is provided as is. To the extent the law allows, Lofgren Enterprise is not liable for indirect or consequential losses
            arising from use of the website. <Blank>limitation-of-liability wording for counsel</Blank>
          </p>
        </Section>

        <Section title="Changes and contact">
          <p>
            We may update these terms; the version on this page applies. Governing law: <Blank>state</Blank>. Questions: <Blank>contact email</Blank>.
          </p>
        </Section>
      </div>
    </Page>
  );
}
