# Database state
Updated 2026-09-29.

## Migrations (branch le/003-owner-console)
1. `20260928144903_le_002_intake`: applied to dev (per owner handoff 2026-09-28)
2. `20260928151117_le_002b_intake_rate_limit`: applied to dev (per owner handoff 2026-09-28)
3. `20260929000000_member_kind`: **not yet applied to dev**
4. `20260929010000_le_003_console`: **not yet applied to dev**

Owner applies 3 and 4 with `supabase db push --dry-run` then `supabase db push` after checking the dry run lists only these two.

## Verified on PGlite with the Supabase role/grant stub (`tests/db/harness.ts`)
- RLS on every public table; server-only functions callable by service_role only.
- Applicant/outsider isolation; operator transitions audited with optimistic version; one active owner.
- Rate limit: 5 per window, then refuses.
- Notes: operator-only read/insert, author must be self, no update/delete; hidden from applicants, outsiders, revoked operators, anonymous.
- `supabase/snippets/owner-access.sql` grants, refuses a second owner or unconfirmed account, and revokes while keeping the record.

Not independently verified from a Claude session: the dev project's live schema (no Supabase access here).
