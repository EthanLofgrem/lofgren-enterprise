# Threat model (LE-001)

| Asset | Threat | Control | Status |
|---|---|---|---|
| Secrets (Supabase secret, Stripe keys) | Committed to git, logged, bundled to browser | `.env*` gitignored, gitleaks in CI, `server-only` env module, health reports booleans only, no `NEXT_PUBLIC_` secrets | in place |
| Live money | Preview or local hits live Stripe | env module rejects non-test keys outside production; no Stripe code yet | in place |
| Applicant / venture data | Cross-tenant read, enumeration | RLS on every table + negative matrix tests (LE-002/003) | planned |
| Partner identities | Disclosed before NCNDA / approval | Server-side introduction state machine (LE-004) | planned |
| Intake form | Spam, abuse, oversized payloads | Server validation, rate limits, honeypot (LE-002). Form disabled today | planned |
| Payment status | Forged via redirect or client POST | Paid only from verified webhook (LE-005) | planned |
| Owner/operator role | Self-assigned at signup | Controlled bootstrap, no role selector (LE-003) | planned |
| Clickjacking / sniffing | Framing, MIME confusion | `X-Frame-Options: DENY`, `nosniff`, referrer policy, no `x-powered-by` | in place |
| `main` branch | Unreviewed push | Owner-only merges by practice; GitHub does not enforce rules on this private personal repo | gap, see BUILD-STATE |
