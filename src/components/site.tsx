import Link from "next/link";
import type { ReactNode } from "react";

export const NAV = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/producers", label: "For producers" },
  { href: "/partners", label: "For partners" },
  { href: "/fees", label: "Fees" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  return (
    <header className="border-b border-line bg-panel">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="font-serif text-xl font-semibold tracking-tight">
          Lofgren Enterprise
        </Link>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-6 text-sm">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="text-muted hover:text-ink">{n.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <details className="relative md:hidden">
          <summary className="cursor-pointer list-none rounded border border-line px-3 py-1.5 text-sm">Menu</summary>
          <nav aria-label="Mobile" className="absolute right-0 z-10 mt-2 w-52 rounded border border-line bg-panel p-2 shadow">
            <ul>
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="block rounded px-3 py-2 text-sm hover:bg-paper">{n.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </details>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-wrap justify-between gap-4 px-4 py-8 text-sm text-muted">
        <p>© {new Date().getFullYear()} Lofgren Enterprise. Pre-launch preview.</p>
        <ul className="flex gap-4">
          <li><Link href="/privacy" className="hover:text-ink">Privacy (draft)</Link></li>
          <li><Link href="/terms" className="hover:text-ink">Terms (draft)</Link></li>
        </ul>
      </div>
    </footer>
  );
}

export function Page({ eyebrow, title, intro, children }: { eyebrow?: string; title: string; intro?: string; children?: ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-12 md:pt-16">
      {eyebrow && <p className="text-sm font-semibold uppercase tracking-wide text-accent">{eyebrow}</p>}
      <h1 className="mt-2 max-w-3xl font-serif text-3xl font-semibold leading-tight md:text-5xl">{title}</h1>
      {intro && <p className="mt-5 max-w-2xl text-lg text-muted">{intro}</p>}
      <div className="mt-10">{children}</div>
    </div>
  );
}

export function Steps({ items }: { items: readonly { title: string; body: string }[] }) {
  return (
    <ol className="grid gap-4 md:grid-cols-2">
      {items.map((s, i) => (
        <li key={s.title} className="rounded-lg border border-line bg-panel p-5">
          <p className="text-sm font-semibold text-accent">Step {i + 1}</p>
          <h2 className="mt-1 text-lg font-semibold">{s.title}</h2>
          <p className="mt-2 text-muted">{s.body}</p>
        </li>
      ))}
    </ol>
  );
}

export function CTA({ href = "/contact", children }: { href?: string; children: ReactNode }) {
  return (
    <Link href={href} className="inline-block rounded-md bg-brand px-5 py-3 font-semibold text-brand-ink hover:opacity-90">
      {children}
    </Link>
  );
}

export function DraftNotice({ children }: { children: ReactNode }) {
  return (
    <div role="note" className="rounded-md border border-accent/60 bg-accent/10 p-4 text-sm">
      {children}
    </div>
  );
}
