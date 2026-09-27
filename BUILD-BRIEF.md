# Lofgren Enterprise — Claude Code remote full-stack build brief

**Owner:** Ethan Lofgren  
**Source:** September 2026 Lofgren Enterprise business report supplied by Ethan  
**Objective:** Build a production-quality foundation for a venture orchestration company: a public acquisition site, producer/partner intake, a private deal workspace, and an operator console. Connect GitHub, Vercel, Supabase, and Stripe in staged environments. Produce a working, protected pilot before enabling real client payments or transfers.

## Instruction to Claude Code

You are the implementation lead. Inspect the existing GitHub organization, repositories, deployments, and environment before creating anything. If a relevant Lofgren Enterprise repository exists, use it; otherwise create a private repository named `lofgren-enterprise` in Ethan's authorized account. Record repository URL, branch, commit SHA, Vercel project ID, Supabase project ref, and Stripe account mode in `docs/BUILD-STATE.md`. Never infer that an integration exists merely from a document. Work in small PRs; run tests and attach logs for the exact commit in each PR. Use test-mode Stripe and a private or password-protected Vercel Preview for the pilot. Keep the public site publish decision separate from the private platform release.

### Business boundary

Lofgren coordinates producers, suppliers, professionals, and venture members to turn existing products or assets into brands. Early monetization is a negotiated setup fee and, later, contracted management fees, equity, or revenue share. A website cannot establish equity, an enforceable NCNDA, or an automatic claim against a venture's unrelated sales. Treat deal percentages, ownership, legal status, professional approvals, and revenue share as **draft records** until signed documents and operational verification exist. Never imply that a partner has agreed or that funds are owed solely because an admin entered a percentage.

The report's wine and clothing examples are illustrations. Use a generic producer workflow and one configurable pilot niche. Do not hard-code alcohol sales, winery permissions, trademark ownership, entity formation, securities offerings, or referral commissions. All legal templates and industry-specific claims await attorney review.

## Release slices and acceptance criteria

| Slice | Deliverable | Demonstration / gate |
| --- | --- | --- |
| 0. Recon | Existing asset inventory; architecture decision record; threat model; account and domain checklist; private repository and CI | Reproducible local setup, no secrets committed; gaps listed with owner |
| 1. Public site | Home, how it works, producer and partner paths, transparent compensation explanation, contact, privacy/terms placeholders clearly marked for review, accessible mobile UI | Site passes build, accessibility smoke checks, and form spam/rate controls; no unverified testimonials or promises |
| 2. Intake | Producer and partner applications, validation, confirmation, admin triage, consent/version/timestamp | Anonymous applicant can submit; only authorized operator can read full submission; duplicate and abuse handling tested |
| 3. Identity and workspace | Supabase Auth, invitations, organization membership, roles, venture membership, private documents, activity history | Cross-tenant negative tests; unauthorized users cannot enumerate or download another venture's data |
| 4. Deal operations | Pipeline, partner directory, consent-gated introductions, blueprint drafts, tasks, term sheet revisions, explicit human approval | Partner identities remain hidden until documented gate; every approval is attributable; no fake e-signature |
| 5. Stripe setup fees | Fixed-price or approved custom-amount **Lofgren-owned service fee** paid via Stripe-hosted Checkout; invoice/payment status via webhook | Test-mode successful, failed, duplicate, delayed, and refunded payments; receipt and ledger reconcile; no paid status from redirect alone |
| 6. Pilot operations | Venture dashboard, manually entered sales with provenance, calculated **proposed** revenue share, statements, exception queue, export, reconciliation | Calculation fixtures include refunds, tax, shipping, period boundaries, adjustments; operator approval required before posting |
| 7. Future Connect | Design document and test-only spike for approved sales flow and connected accounts | No live collection, transfer, payout, or automated share until Stripe account eligibility, contract basis, and payment-flow design are verified |

## Architecture

- Next.js App Router and TypeScript deployed to Vercel; server actions/routes for privileged mutations; a small, documented component system and accessible forms.
- Supabase Postgres, Auth, and private Storage; SQL migrations in version control. Enable RLS on every exposed table and explicit policies for documents. Keep service credentials server-only. Bootstrap Ethan's single operator account through a controlled script, never a public role selector.
- Stripe Checkout for Lofgren's own setup fees first. Webhook signature verification uses the raw request body. Store unique provider event IDs and business transaction IDs, process events idempotently, and reconcile asynchronous outcomes. Stripe Connect is a distinct future flow; choose charge type and who is merchant of record only after documenting where the underlying sales occur and obtaining provider/legal approval.
- GitHub Actions: lint, typecheck, unit tests, migration replay, database authorization tests, browser smoke, secret scan, and build. Require checks on the protected main branch. Vercel PR Preview uses isolated test configuration; production secrets are separate.
- Keep email, electronic signature, and external sales integrations behind adapter interfaces. Until provider accounts and attorney-approved templates exist, implement explicit manual statuses and upload of externally signed documents; do not emulate legal execution.

## Data model minimum

`profiles`, `organizations`, `organization_members`, `applications`, `partner_capabilities`, `ventures`, `venture_members`, `introductions`, `consent_records`, `blueprints`, `deal_terms`, `documents`, `document_access`, `tasks`, `activity_events`, `service_orders`, `stripe_events`, `payments`, `sales_imports`, `sales_lines`, `share_rules`, `share_calculations`, `statement_periods`, `statements`, `reconciliation_exceptions`.

Every business record has a stable ID, owner organization/venture, timestamps, status, actor/provenance, and immutable event trail where decisions or money are involved. Model terms and formulas with effective dates and versions. Store money as integer minor units plus currency; use deterministic decimal calculations for percentages, explicit rounding rules, and immutable adjustment entries. Restrict PII fields and document downloads by membership and purpose. Retain signed file hashes, signer/provider metadata, and version identifiers when a real signing provider is added.

## Required end-to-end journeys

1. Visitor applies as producer without seeing partner identities; receives a submission reference. Admin reviews, requests more information, and approves or rejects with reason.
2. Partner applies; admin checks capability and consents before making an introduction. Producer and partner each see only their authorized deal room.
3. Admin drafts a Venture Blueprint; proposed equity, fee, and revenue-share terms are visibly unexecuted until verified signed agreements are attached.
4. Approved setup fee creates Checkout Session; webhook confirms payment; repeated or reordered delivery cannot create duplicate fulfillment. Refund or dispute updates the ledger and admin alert.
5. Operator imports a synthetic venture sales file; the app calculates a proposed share for a dated agreement, flags missing data/refunds, and produces an auditable statement. No automatic transfer occurs.
6. Two independent organizations and two ventures attempt each other's URLs, IDs, API requests, and storage keys; every unauthorized read/write/download fails.

## Execution order

1. Inventory authorized accounts and existing project state. Document unknowns as blockers, not assumptions. Check business name/domain availability separately before public branding or DNS changes.
2. Create private repository or branch, baseline Next.js app, package lock, CI, example environment file, and local dev instructions.
3. Design database and implement migrations plus adversarial RLS/storage tests before private customer data is entered.
4. Implement public site and intake. Deploy protected Preview and run actual browser journeys.
5. Implement invitations, role enforcement, deal room, and documents; verify cross-tenant isolation in browser and database.
6. Add Stripe test-mode setup fees, signed webhook processing, transaction ledger, and test-mode lifecycle verification.
7. Add manual sales and proposed share statements, operator review, and export. Write Connect decision record only after mapping actual sale ownership and contractual payment rights.
8. Run a complete pilot journey on one exact commit SHA; retain CI logs, migration result, browser evidence, webhook IDs in redacted form, reconciliation report, Preview URL, and unresolved gates.

## Configuration and operational controls

Provide `.env.example` with variable **names only**: Supabase URL and publishable key, server-only Supabase secret where strictly needed, Stripe secret key, Stripe webhook signing secret, public site URL, and optional email/provider settings. Never paste values into issues, logs, or chat. Keep separate development/test and production projects or configurations. Preview must never write to live Stripe or production data. Maintain a secret rotation and backup/restore runbook; test restore on a disposable database. Add rate limits and CAPTCHA or equivalent abuse controls for public intake, file type/size enforcement, signed temporary download URLs, server-side authorization on every mutation, error monitoring with PII redaction, and a data retention/deletion policy.

## Explicit release gates

**Public acquisition site:** owner approves brand, domain, privacy/terms, contact address, and final copy; automated checks and human browser review pass. **Private pilot:** invitation-only users, contract workflow marked draft/manual, tenant isolation tests and database restore pass. **Real setup fees:** Stripe live account enabled, prices and refund policy approved, webhook and reconciliation tested in live configuration with a controlled transaction. **Connect and automated shares:** counsel confirms agreements and funds flow; Stripe approves supported Connect use and connected-account onboarding; finance owner approves tax and accounting treatment; security review and live controlled reconciliation pass. Do not activate a gate by changing a feature flag alone.

## Status format after each PR

Report: exact commit SHA; changed files and PR URL; Vercel deployment URL and protection status; CI commands and pass/fail logs; database migration head; Stripe mode and test event references; demonstrated user journeys; open blockers with accountable owner and next action. Distinguish source-complete, local-tested, integration-tested, and production-verified. Do not claim a launch or revenue until the matching evidence exists.

## Immediate first assignment

Perform Slice 0 and Slice 1, then implement Slice 2 against an isolated Supabase environment if credentials and authorization exist. Leave a protected Preview that Ethan can review, a working intake pipeline with tenant/privacy tests, and an exact-SHA evidence report. Continue to later slices in order while credentials and approvals permit. If an external account or legal decision blocks a slice, deliver the tested code and a precise account-owner checklist, then advance independent work.
