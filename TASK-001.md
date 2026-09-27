# LE-001 — First buildable protected Preview

Objective: Convert the docs-only private repository into a production-quality Next.js TypeScript baseline and protected Vercel Preview without live payments or customer data.

Scope: app shell; public Home, How it Works, Producer, Partner and Contact pages; server-side health endpoint; basic accessible responsive design; CI lint/typecheck/build/browser smoke; architecture and threat model; environment validation. Use the exact repo `EthanLofgrem/lofgren-enterprise`.

Acceptance: a private branch and PR; reproducible locked install; CI runs against exact head SHA; browser screenshot and mobile viewport review; Preview URL and deployment ID; protection verified with unauthenticated request; health route identifies `lofgren-enterprise` and head SHA. No production deploy or unrelated project writes.

Next: LE-002 isolated producer/partner intake with Supabase RLS and anti-abuse controls; LE-003 deal room; LE-004 Stripe test-mode setup fee. Separate cards, no generic subscription entitlements.

Report: changed files, full SHA, PR, commands/results, Preview URL/protection, tests and artifacts, remaining provider/owner gate. Do not claim integration if only mocks run.
