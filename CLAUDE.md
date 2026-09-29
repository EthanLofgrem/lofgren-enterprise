# Claude Code operating instructions — Lofgren Enterprise

Read `BUILD-BRIEF.md` before writing code. This repository belongs to Ethan Lofgren and is a new, isolated venture orchestration business. Do not reuse LPIS/Lofora databases, Stripe objects, Vercel projects, domains, credentials, or branding.

## Mission
Build the public acquisition site, producer and partner intake, protected deal workspace, operator console, and test-mode Stripe setup-fee flow in the order specified in the brief. The repository is currently public (owner decision pending on private vs. public); commit no secrets, customer data, private deal terms, or security details that would aid abuse. Use Next.js, TypeScript, Supabase, Vercel, GitHub Actions, and Stripe. Every external mutation must be attributable and verified.

## First session
1. Inspect repository and provider access. Record repo SHA and connected account/project identities in `docs/BUILD-STATE.md` without secrets.
2. Create `docs/ARCHITECTURE.md`, `docs/THREAT-MODEL.md`, `.env.example`, and baseline Next.js application with CI.
3. Build public pages and intake, deploy a protected Preview, and prove a real submission and operator review with test accounts.
4. Continue through the brief's slices in sequence. Keep legal signatures, equity ownership, revenue shares, and Stripe Connect transfers disabled until their explicit gates pass.

## Working rules
- Use branches and PRs for features, exact commit SHAs for evidence, and a lockfile. Never put keys or personal information into git, logs, screenshots, or chat.
- Run lint, typecheck, unit, browser, and database/RLS negative tests as relevant. A passing mocked test does not prove provider integration.
- RLS on every exposed table; server-side authorization on each mutation and download; no user-editable JWT metadata for roles.
- Stripe webhooks: raw-body signature verification, unique event storage, idempotent state transitions, and refund/dispute reconciliation. Hosted Checkout for Lofgren's own setup fee first.
- Stop and record a precise gate when an account owner, cost confirmation, legal review, provider capability, or protected deployment setting is needed; keep advancing independent source work.
- Report each PR: commit SHA, changed files, CI result, Preview URL/protection, test evidence, and remaining gate. Do not claim production-ready without production evidence.

## Token Machine (every session)
- Follow `ops/README.md`: one task packet, load only what it names, finish with evidence + handoff, then `/clear`.
- Never push to `main` or merge. Work on `le-<id>-<slug>` branches; Ethan merges PRs. Until branch protection is set on `main`, this rule is the control.
- Checks: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm test:e2e`.
- Rule files by task: RLS/auth `ops/rules/rls.md`; schema `ops/rules/migration.md`; Stripe `ops/rules/stripe-webhook.md`; Vercel `ops/rules/vercel-preview.md`; agreements/documents `ops/rules/agreements.md`; sales, statements, payouts `ops/rules/revenue-calculation.md`. Boundaries: `docs/architecture/invariants.md`.
