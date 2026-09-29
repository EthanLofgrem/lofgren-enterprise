import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DraftNotice, Page } from "@/components/site";
import { CONSENT_VERSION } from "@/lib/consent";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Privacy notice (draft)",
  description: "Draft privacy notice for Lofgren Enterprise, awaiting review. It will explain what we collect, why, who can see it, and how to delete it.",
  path: "/privacy",
});

// Draft written from what the system actually does. Bracketed items are
// decisions for the owner and counsel. Bump CONSENT_VERSION when this changes.
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-serif text-2xl font-semibold text-ink">{title}</h2>
      {children}
    </section>
  );
}

const Blank = ({ children }: { children: ReactNode }) => <mark className="rounded bg-warn/15 px-1 text-ink">[{children}]</mark>;

export default function Privacy() {
  return (
    <Page eyebrow="Draft" title="Privacy notice">
      <DraftNotice>
        Draft for owner and attorney review. Not final, and not legal advice. Items in brackets still need a decision. While the site is in
        preview, applications are closed and nothing typed into the forms is stored. Version: {CONSENT_VERSION}.
      </DraftNotice>

      <div className="mt-10 max-w-3xl space-y-10 leading-relaxed text-muted">
        <Section title="Who we are">
          <p>
            Lofgren Enterprise (<Blank>legal entity name and state</Blank>) connects people who want to build businesses together. This notice
            explains what we collect through this website, why, who can see it, and your choices. Contact: <Blank>privacy contact email</Blank>.
          </p>
        </Section>

        <Section title="What we collect">
          <p>When you apply through the website, we collect what you type into the form. Applying doesn&apos;t give you an account or a login.</p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Your name, email address, and city or region.</li>
            <li>A business name, if you have one.</li>
            <li>What you can contribute, what interests you, the time and resources you could commit, and when you could start.</li>
            <li>That you confirmed you are 18 or older (we check it, but do not store it as a separate record).</li>
            <li>Which version of this notice you agreed to, and when.</li>
          </ul>
          <p>
            We ask you not to include ID numbers, bank or card details, health information, or confidential documents. The form does not accept
            file uploads.
          </p>
          <p>
            To stop spam and abuse, we record a scrambled (salted, one-way hashed) form of your internet address each time you submit. We cannot
            turn it back into your address. Records older than one day are removed the next time anyone submits the form, so an old record can remain until then; there is no separate timed deletion job.
          </p>
          <p>
            When our team reviews your application, we add internal notes and a history of status changes (for example, &ldquo;in
            review&rdquo;). These are visible only to authorized Lofgren Enterprise reviewers.
          </p>
        </Section>

        <Section title="Why we use it">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>To review your application and decide whether we may be able to help.</li>
            <li>To contact you about your application and possible next steps.</li>
            <li>To look for other members whose skills and interests fit yours.</li>
            <li>To keep the website secure and prevent abuse.</li>
          </ul>
          <p>We do not sell your information, and we do not use it for advertising.</p>
        </Section>

        <Section title="Who can see it">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Authorized Lofgren Enterprise reviewers.</li>
            <li>Other members only after you agree to be introduced to them, and only what is needed for that introduction.</li>
            <li>
              Service providers that run the website for us: Supabase (database and sign-in, United States) and Vercel (website hosting). They
              process data on our behalf and may not use it for their own purposes.
            </li>
            <li>Anyone we are legally required to share it with.</li>
          </ul>
        </Section>

        <Section title="Cookies and tracking">
          <p>
            The public website does not use analytics, advertising, or tracking cookies. Our internal review console uses cookies only to keep
            authorized reviewers signed in.
          </p>
        </Section>

        <Section title="How long we keep it">
          <p>
            We keep applications for <Blank>retention period</Blank> after our last contact with you, unless you ask us to delete them sooner or we
            must keep them longer for legal reasons. Abuse-prevention records are removed as described above. <Blank>how and by whom applications are deleted at the end of the retention period</Blank>
          </p>
        </Section>

        <Section title="Your choices">
          <p>
            You can ask to see, correct, or delete the information you gave us, or withdraw from consideration, by emailing{" "}
            <Blank>privacy contact email</Blank>. We will respond within <Blank>response time</Blank>. <Blank>how we verify the request, what a deletion
            removes, and whether a record of the request is kept</Blank>
          </p>
        </Section>

        <Section title="Security">
          <p>
            Access to applications is limited to authorized reviewers and enforced by the database itself, not only by the website. No system is
            perfectly secure, and we will tell you if a breach affects your information as required by law.
          </p>
        </Section>

        <Section title="Children">
          <p>The website is for people 18 or older. We do not knowingly collect information from anyone younger.</p>
        </Section>

        <Section title="Changes">
          <p>If we change this notice, we will update the version shown above. The application form records which version you agreed to.</p>
        </Section>
      </div>
    </Page>
  );
}
