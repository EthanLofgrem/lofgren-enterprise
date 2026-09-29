# Architecture

Status: LE-001 baseline. Only the public site and `/api/health` exist in code.

## Stack
- Next.js App Router + TypeScript (strict) on Vercel. Tailwind CSS v4. pnpm with committed lockfile.
- Supabase Postgres, Auth, private Storage (from LE-002; not yet provisioned).
- Stripe hosted Checkout for Lofgren's own setup fee, test mode first (from LE-005; no account yet).
- GitHub Actions: lint, typecheck, unit (Vitest), build, browser smoke (Playwright desktop + mobile), gitleaks.

## Trust boundaries
Browser -> Next.js route/server action -> server validation + actor lookup + policy check -> Supabase (RLS) -> audit event.
Stripe -> signed webhook (raw body) -> durable event inbox -> idempotent processor -> ledger.
UI hiding is UX only. RLS and server checks are the authorization boundary.

## Code layout
- `src/app/*` pages and route handlers. `src/components/site.tsx` shared shell.
- `src/lib/health.ts` safe readiness report. `src/lib/env.ts` server-only config, fails fast, refuses live Stripe keys outside production.
- `tests/unit` Vitest, `tests/e2e` Playwright.

## Environments
See `docs/adr/0001-environment-isolation.md`.
