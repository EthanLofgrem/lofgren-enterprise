# ADR 0001: Environment isolation

Status: accepted, 2026-09-27

## Decision
- Lofgren Enterprise uses its own Vercel project, Supabase project(s), and Stripe account. No LPIS, Lofora, FoundFunds, or Tillvex resource, key, domain, or data is reused.
- Environments: local, Vercel Preview (protected), later staging, later production. Each has separately scoped variables.
- Preview and local use Supabase test data and Stripe test mode only. `src/lib/env.ts` rejects non-test Stripe keys unless `VERCEL_ENV=production`.
- Production variables stay empty until the launch gates in the master build pack pass.
- The site sends `noindex` until the owner approves public launch.

## Consequences
Provider setup is an owner step (see `PROVIDER-GATES.md`). Code can progress and be tested locally and in CI without any provider.
