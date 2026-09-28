# Database state
Updated 2026-09-28. No Supabase project yet.
- Migration head (branch le-002-intake): `20260928000000_intake`.
- Verified on PGlite with Supabase role/grant stub (`tests/db/harness.ts`): RLS on all public tables; submit via service_role only (anon and authenticated denied); applicant/outsider isolation; operator transitions audited; one active owner. 22 DB tests.
- Not yet verified on real Supabase (`supabase db reset` + `supabase test db`).
