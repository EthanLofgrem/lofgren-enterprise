import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/icons";
import { STEPS, TAGLINE, type IconName } from "@/lib/content";

export const NAV = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/who-can-join", label: "Who can join" },
  { href: "/examples", label: "Examples" },
  { href: "/capital-partners", label: "Capital partners" },
  { href: "/faq", label: "FAQ" },
] as const;

const FOOTER = [
  { heading: "Get started", links: [{ href: "/join", label: "Create your account" }, { href: "/how-it-works", label: "How it works" }, { href: "/who-can-join", label: "Who can join" }] },
  { heading: "Learn more", links: [{ href: "/examples", label: "Example teams" }, { href: "/capital-partners", label: "Capital partners" }, { href: "/fees", label: "Fees" }, { href: "/faq", label: "FAQ" }] },
  { heading: "Company", links: [{ href: "/contact", label: "Contact" }, { href: "/privacy", label: "Privacy (draft)" }, { href: "/terms", label: "Terms (draft)" }] },
] as const;

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 font-serif text-lg font-semibold tracking-tight md:text-xl">
      <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-md bg-brand font-serif text-base text-brand-ink">L</span>
      Lofgren Enterprise
    </Link>
  );
}

/** Shown on every page until the owner opens the site. */
export function PrelaunchBanner() {
  return (
    <aside aria-label="Site status" className="bg-brand px-4 py-2 text-center text-sm text-brand-ink">
      Pre-launch preview. Accounts, matching, agreements, and LLC formation are not open yet.
    </aside>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/85">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Logo />
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-7 text-[15px]">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="text-muted hover:text-ink">{n.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/join" className="hidden rounded-md bg-brand px-4 py-2 text-sm font-semibold text-brand-ink hover:opacity-90 sm:inline-block">
            Create account
          </Link>
          <details className="relative lg:hidden">
            <summary className="cursor-pointer list-none rounded-md border border-line px-3 py-2 text-sm font-semibold [&::-webkit-details-marker]:hidden">Menu</summary>
            <nav aria-label="Mobile" className="absolute right-0 z-50 mt-2 w-60 rounded-lg border border-line bg-panel p-2 shadow-lg">
              <ul>
                {NAV.map((n) => (
                  <li key={n.href}>
                    <Link href={n.href} className="block rounded px-3 py-2.5 hover:bg-sand">{n.label}</Link>
                  </li>
                ))}
                <li className="mt-1 border-t border-line pt-2">
                  <Link href="/join" className="block rounded bg-brand px-3 py-2.5 text-center font-semibold text-brand-ink">Create account</Link>
                </li>
              </ul>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-sand">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Logo />
          <p className="mt-4 font-serif text-lg font-semibold">{TAGLINE}</p>
          <p className="mt-2 max-w-xs text-sm text-muted">
            Bring what you do. Build what comes next. Lofgren Enterprise connects people and helps them form businesses they own together.
          </p>
        </div>
        {FOOTER.map((col) => (
          <div key={col.heading}>
            <h2 className="text-sm font-semibold">{col.heading}</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {col.links.map((l) => (
                <li key={l.href}><Link href={l.href} className="text-muted hover:text-ink">{l.label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-muted">
          © {new Date().getFullYear()} Lofgren Enterprise. Pre-launch preview. Lofgren Enterprise is not a law firm, accounting firm, or investment adviser, and nothing on this site is legal, tax, or investment advice.
        </p>
      </div>
    </footer>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">{children}</p>;
}

export function Page({ eyebrow, title, intro, children }: { eyebrow?: string; title: string; intro?: string; children?: ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-12 md:pt-20">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h1 className="mt-3 max-w-3xl font-serif text-4xl font-semibold leading-[1.1] tracking-tight md:text-6xl">{title}</h1>
      {intro && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">{intro}</p>}
      <div className="mt-12">{children}</div>
    </div>
  );
}

export function SectionHeading({ id, eyebrow, title, intro }: { id: string; eyebrow?: string; title: string; intro?: string }) {
  return (
    <div className="max-w-2xl">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 id={id} className="mt-2 font-serif text-3xl font-semibold leading-tight tracking-tight md:text-4xl">{title}</h2>
      {intro && <p className="mt-4 text-lg leading-relaxed text-muted">{intro}</p>}
    </div>
  );
}

export function CTA({ href = "/join", variant = "primary", children }: { href?: string; variant?: "primary" | "secondary"; children: ReactNode }) {
  const styles =
    variant === "primary"
      ? "bg-brand text-brand-ink hover:opacity-90"
      : "border border-ink/20 bg-panel text-ink hover:border-ink/40";
  return (
    <Link href={href} className={`inline-flex items-center justify-center rounded-md px-6 py-3.5 font-semibold transition ${styles}`}>
      {children}
    </Link>
  );
}

export function IconBadge({ name }: { name: IconName }) {
  return (
    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
      <Icon name={name} />
    </span>
  );
}

/** The seven steps as a compact numbered list; used on the home page. */
export function StepList() {
  return (
    <ol className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
      {STEPS.map((s) => (
        <li key={s.n} className={`bg-panel p-6 ${s.n === 7 ? "sm:col-span-2 lg:col-span-1" : ""}`}>
          <div className="flex items-center gap-3">
            <span className="font-serif text-3xl font-semibold text-accent">{String(s.n).padStart(2, "0")}</span>
            <Icon name={s.icon} className="h-5 w-5 text-muted" />
          </div>
          <h3 className="mt-3 font-serif text-2xl font-semibold">{s.name}</h3>
          <p className="mt-0.5 text-sm font-semibold">{s.title}</p>
          <p className="mt-1.5 text-muted">{s.short}</p>
        </li>
      ))}
      <li className="flex flex-col justify-center bg-brand p-6 text-brand-ink sm:col-span-2 lg:col-span-1">
        <p className="font-serif text-2xl font-semibold leading-snug">Nothing is binding until everyone signs.</p>
        <Link href="/how-it-works" className="mt-4 font-semibold underline underline-offset-4">Read each step in detail</Link>
      </li>
    </ol>
  );
}

export function CTABand({ title = TAGLINE, body = "Bring what you do. Build what comes next. Create a free account, tell us what you bring, and we will look for the people you could build a business with." }: { title?: string; body?: string }) {
  return (
    <section aria-labelledby="cta-band" className="mx-auto mt-24 max-w-6xl px-4">
      <div className="relative overflow-hidden rounded-2xl bg-brand px-6 py-12 text-brand-ink md:px-12 md:py-16">
        <div aria-hidden="true" className="absolute -right-16 -top-16 h-64 w-64 rounded-full border-[28px] border-copper-bright/40" />
        <div className="relative max-w-2xl">
          <h2 id="cta-band" className="font-serif text-3xl font-semibold leading-tight md:text-4xl">{title}</h2>
          <p className="mt-4 text-lg opacity-90">{body}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/join" className="inline-flex rounded-md bg-brand-ink px-6 py-3.5 font-semibold text-brand hover:opacity-90">Create your free account</Link>
            <Link href="/how-it-works" className="inline-flex rounded-md border border-brand-ink/40 px-6 py-3.5 font-semibold hover:border-brand-ink">See the 7 steps</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function DraftNotice({ children }: { children: ReactNode }) {
  return (
    <div role="note" className="rounded-lg border border-warn/50 bg-warn/10 p-4 text-sm">
      {children}
    </div>
  );
}

export function Callout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <aside className="rounded-xl border border-line bg-sand p-6">
      <h2 className="flex items-center gap-2 font-semibold"><Icon name="shield" className="h-5 w-5 text-brand" />{title}</h2>
      <div className="mt-2 text-muted">{children}</div>
    </aside>
  );
}
