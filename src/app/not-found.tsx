import type { Metadata } from "next";
import Link from "next/link";
import { CTA, Page } from "@/components/site";

export const metadata: Metadata = { title: "Page not found", robots: { index: false, follow: false } };

export default function NotFound() {
  return (
    <Page eyebrow="404" title="We couldn't find that page." intro="The link may be old, or the page may have moved. These are good places to start.">
      <div className="flex flex-wrap gap-3">
        <CTA href="/">Go to the home page</CTA>
        <CTA href="/how-it-works" variant="secondary">See the 7 steps</CTA>
      </div>
      <p className="mt-8 text-muted">
        Ready to take part? <Link href="/join" className="font-semibold text-accent underline underline-offset-4">Apply to join</Link>.
      </p>
    </Page>
  );
}
