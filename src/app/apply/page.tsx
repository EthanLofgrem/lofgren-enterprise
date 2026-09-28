import type { Metadata } from "next";
import Link from "next/link";
import { DraftNotice, Page } from "@/components/site";
import { intakeEnabled } from "@/lib/intake/server";
import { CONSENT_VERSION } from "@/lib/validation/application";
import { ApplyForm } from "./apply-form";

export const metadata: Metadata = { title: "Apply" };
export const dynamic = "force-dynamic";

export default async function Apply({ searchParams }: { searchParams: Promise<{ kind?: string }> }) {
  const kind = (await searchParams).kind === "partner" ? "partner" : "producer";
  const enabled = intakeEnabled();
  const tab = (k: "producer" | "partner", label: string) => (
    <Link
      href={`/apply?kind=${k}`}
      aria-current={kind === k ? "page" : undefined}
      className={`rounded-md border px-4 py-2 text-sm font-semibold ${kind === k ? "border-brand bg-brand text-brand-ink" : "border-line"}`}
    >
      {label}
    </Link>
  );

  return (
    <Page
      eyebrow="Apply"
      title={kind === "producer" ? "Apply as a producer" : "Apply as a partner"}
      intro="A person reads every application. Applying is free and does not commit you to anything. It is not an engagement, an approval, or an offer of funding."
    >
      <div className="mb-8 flex gap-3">{tab("producer", "Producer")}{tab("partner", "Partner")}</div>
      {!enabled && (
        <div className="mb-8">
          <DraftNotice>Applications are not open yet. This form is shown for preview and cannot be submitted.</DraftNotice>
        </div>
      )}
      <ApplyForm kind={kind} enabled={enabled} consentVersion={CONSENT_VERSION} />
    </Page>
  );
}
