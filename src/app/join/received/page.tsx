import type { Metadata } from "next";
import Link from "next/link";
import { Page } from "@/components/site";
import { STEPS } from "@/lib/content";

export const metadata: Metadata = { title: "Account request received", robots: { index: false, follow: false } };

// Echoes the reference from the redirect only; it never looks anything up, so
// this page cannot be used to check whether an account request exists.
export default async function Received({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const raw = (await searchParams).ref ?? "";
  const ref = /^LE-[0-9A-F]{10}$/.test(raw) ? raw : null;
  const next = STEPS.slice(1, 4);
  return (
    <Page
      eyebrow="Welcome"
      title="You're in. Qualify is underway."
      intro="A person on our team will review your profile and email you about next steps. Creating an account is not a match, an approval, or an agreement."
    >
      {ref && (
        <p className="rounded-xl border border-line bg-panel p-5 text-lg">
          Your reference is <strong className="font-mono">{ref}</strong>. Keep it if you contact us about your account.
        </p>
      )}
      <h2 className="mt-10 font-serif text-2xl font-semibold">What happens next</h2>
      <ol className="mt-5 grid gap-4 md:grid-cols-3">
        {next.map((s) => (
          <li key={s.n} className="rounded-xl border border-line bg-panel p-5">
            <p className="font-serif text-2xl font-semibold text-accent">{String(s.n).padStart(2, "0")}</p>
            <h3 className="mt-2 font-serif text-xl font-semibold">{s.name}</h3>
            <p className="mt-0.5 text-sm font-semibold">{s.title}</p>
            <p className="mt-1 text-muted">{s.short}</p>
          </li>
        ))}
      </ol>
      <p className="mt-8"><Link href="/how-it-works" className="font-semibold text-accent underline underline-offset-4">See all seven steps</Link></p>
    </Page>
  );
}
