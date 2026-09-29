# Security state
Updated 2026-09-27 (LE-001, pending first CI run).
- `.env*` gitignored except `.env.example` (names only).
- Security headers set in `next.config.ts`; `/api/health` exposes booleans only (unit-tested).
- `requireEnv` refuses non-test Stripe keys outside production (unit-tested).
- gitleaks runs in CI.
