import type { Metadata } from "next";
import { Page } from "@/components/site";

export const metadata: Metadata = { title: "Application received", robots: { index: false, follow: false } };

// Echoes the reference from the redirect only; it never looks anything up, so
// this page cannot be used to check whether an application exists.
export default async function Received({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const raw = (await searchParams).ref ?? "";
  const ref = /^LE-[0-9A-F]{10}$/.test(raw) ? raw : null;
  return (
    <Page eyebrow="Thank you" title="Application received" intro="A person will review it and reply by email. Receiving an application is not an approval or engagement.">
      {ref && (
        <p className="text-lg">
          Your reference is <strong className="font-mono">{ref}</strong>. Please keep it for your records.
        </p>
      )}
    </Page>
  );
}
