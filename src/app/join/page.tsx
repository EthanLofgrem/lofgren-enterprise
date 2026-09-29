import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { Icon } from "@/components/icons";
import { DraftNotice, Eyebrow } from "@/components/site";
import { CATEGORIES, PROMISES } from "@/lib/content";
import { CONSENT_VERSION } from "@/lib/consent";
import { intakeEnabled } from "@/lib/intake/server";
import { JoinForm } from "./join-form";

export const metadata: Metadata = pageMetadata({
  title: "Apply to join",
  description: "Apply to join Lofgren Enterprise for free and tell us what you bring. We look for the people you could build a business with.",
  path: "/join",
});
export const dynamic = "force-dynamic";

export default function Join() {
  const enabled = intakeEnabled();
  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-4 pt-12 md:pt-16 lg:grid-cols-[1fr_1.35fr]">
      <div>
        <Eyebrow>Step 1 of 7: Qualify</Eyebrow>
        <h1 className="mt-3 font-serif text-4xl font-semibold leading-[1.1] tracking-tight md:text-5xl">Apply to join.</h1>
        <p className="mt-3 font-serif text-xl font-semibold text-accent">Bring what you do. Build what comes next.</p>
        <p className="mt-5 text-lg leading-relaxed text-muted">
          Tell us who you are, what you bring, and what you would like to build. It takes a few minutes. A person reviews every profile,
          then we email you about next steps.
        </p>
        <ul className="mt-8 space-y-5">
          {PROMISES.map((p) => (
            <li key={p.title} className="flex gap-3">
              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-md bg-brand-soft text-brand"><Icon name={p.icon} className="h-4 w-4" /></span>
              <span>
                <span className="font-semibold">{p.title}. </span>
                <span className="text-muted">{p.body}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        {!enabled && (
          <div className="mb-5">
            <DraftNotice><strong>Applications aren&apos;t open yet.</strong> You can preview the questions below, but you can&apos;t send an application, and nothing you type is sent or stored.</DraftNotice>
          </div>
        )}
        <JoinForm enabled={enabled} consentVersion={CONSENT_VERSION} categories={CATEGORIES.map(({ slug, title }) => ({ slug, title }))} />
      </div>
    </div>
  );
}
