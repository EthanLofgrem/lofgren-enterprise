# Database state
Updated 2026-09-28.
- Migrations (branch le-002b-intake-form): `20260928144903_le_002_intake`, `20260928151117_le_002b_intake_rate_limit`. Renamed from `20260928000000_intake` and `20260928010000_intake_rate_limit` to match the versions recorded in the dev project; SQL unchanged.
- Verified on PGlite with Supabase role/grant stub (`tests/db/harness.ts`): RLS on all public tables; submit and rate-limit functions callable by service_role only (anon and authenticated denied); applicant/outsider isolation; operator transitions audited; one active owner; rate limit allows 5 per window then refuses.
- Dev Supabase project `kaddnaknuhptcleppspj` (us-west-1): both migrations applied, per the owner's Supabase handoff of 2026-09-28. Not independently verified from a Claude session (no Supabase access here). Owner confirms with `supabase migration list --linked` before any push.
- No production project.
