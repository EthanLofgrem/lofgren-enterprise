# Lofgren Enterprise — Claude Code Pro master build pack

**Issued:** 2026-09-27  
**Repository:** `EthanLofgrem/lofgren-enterprise` (private)  
**Owner:** Ethan Lofgren  
**Project:** A venture orchestration business that helps producers assemble partners, agreements, launch operations, and continuing management.  
**Role of this pack:** A working order for Claude Code Pro. It is not a substitute for actual provider access, signed legal documents, test evidence, or owner approval.

## 0. Start here: state, scope, and first command

Read `CLAUDE.md`, `BUILD-BRIEF.md`, `PLATFORM-OPERATIONS.md`, `PROVIDER-GATES.md`, `TASK-001.md`, and this pack. Verify `git remote -v`, `git status --short`, `git rev-parse HEAD`, the private repository identity, and the current branch before editing. The repository was documentation-only at the handoff commit `17f3bdaeee62636c7d6ef14d8d71bb467a431d7d`. If its head has advanced, inspect the diff and treat current repository state as authoritative. Never overwrite work that another process added.

This is a **new business**. Do not import LPIS/Lofora code, customer records, Supabase projects, Vercel projects, Stripe objects, environment variables, domains, brand assets, or credentials into Lofgren Enterprise. The existing GitHub repository is an Ethan-owned private repository dedicated to Lofgren; GitHub login isolation is a separate owner decision. Vercel, Supabase, and Stripe are not yet connected for this business. See `PROVIDER-GATES.md` and verify provider state before any claim of connectivity.

**First work order:** Complete `TASK-001.md`: a buildable Next.js app, public marketing pages, health endpoint, useful CI, a protected Preview if provider access permits, and exact-head evidence. Work on a feature branch. Do not attempt checkout, live signup, sales sync, legal signing, or production deploy to satisfy this first milestone.

### Definition of done for every task

A task is done only when its declared behavior works, relevant negative cases fail safely, checks pass on one exact commit, and evidence is retained. Return this structure:

```text
Task ID and intended outcome:
Branch / PR / immutable head SHA:
Changed files and migration head:
Commands and test receipts (pass, fail, skipped with reason):
Vercel deployment ID, URL, protection and SHA if deployed:
Supabase project ref and isolated environment if used:
Stripe account context and test/live mode if used:
Browser journey and authorization denials observed:
Risks, unresolved gates, next bounded task:
```

Never describe source code as deployed, mocked providers as connected, a successful Checkout redirect as payment, a draft agreement as signed, or a proposed revenue share as money due.

## 1. Product contract: what to build

Lofgren Enterprise starts as an operator-led service that helps a producer identify a viable opportunity, assess missing capabilities, introduce vetted partners under suitable protection, draft a venture blueprint, coordinate professional agreements, launch a small pilot, and monitor outcomes. The platform makes that process legible, efficient, and auditable. Ethan remains the human operator and approver of introductions, proposals, deal terms, and consequential decisions.

### Roles and their permitted surfaces

| Role | Typical access | Explicit boundary |
| --- | --- | --- |
| Visitor | Public explanation, intake and contact | No partner directory, client records, venture data |
| Producer applicant | Own submitted application and status through verified identity when enabled | Cannot see other applicants or partner identities by default |
| Partner applicant | Own capacity/profile submission and invitations | Cannot browse producer opportunities without introduction approval |
| Venture member | Only ventures and documents where membership is active | No portfolio-wide data or admin decisions |
| Professional | Explicitly invited deal documents/tasks within scoped venture | No blanket attorney/CPA authority or implicit signature |
| Lofgren operator | Review queues, approved venture workspaces, audit and exceptions | Every privileged action attributable and checked server-side |
| Ethan owner | Account oversight, approvals, access grants, release decisions | Account bootstrap is controlled; public signup cannot become owner |

One natural person can have multiple memberships. Use an organization/venture membership table as the source of authorization, with explicit statuses and effective dates. Do not use email domain, role text in browser state, or user-editable metadata as authorization.

### Public site pages

Build Home, How It Works, For Producers, For Partners, Contact/Application, and a plain-language explanation of fees and the engagement process. Provide a strong, truthful offer and clear next action. Do not invent testimonials, completed ventures, partner counts, savings, income results, licenses, attorney endorsements, or regulatory approvals. Privacy and terms may initially be clearly marked for owner/counsel review; do not present placeholders as final policies. Accessible, responsive layout and semantic forms are required.

### First operational journey

Visitor submits producer application → submission stored in an isolated Lofgren database → operator reviews and requests information → producer can verify identity and see only own status → operator proposes a partner match without revealing identities → approved introduction and consent are recorded → operator drafts blueprint with assumptions, projected unit economics and explicit compensation → professionally drafted documents are attached after external signing → pilot tasks and outcomes are tracked. The first journey can end at a reviewed blueprint if legal/provider gates remain; its status must reflect that reality.

## 2. System architecture and trust boundaries

Use Next.js App Router with TypeScript on Vercel; Supabase Postgres/Auth/private Storage for Lofgren data; Stripe hosted Checkout for Lofgren's own setup fees in **test mode first**; GitHub for code and CI. Keep provider integrations in typed adapters and isolate business rules from routes. Run privileged mutations on the server, validate input there, and authorize each request against database membership. UI restrictions are helpful UX, not a security boundary.

```text
Visitor / member browser
  → Next.js public or authenticated route
  → server validation + actor lookup + policy check
  → Supabase RLS-protected tables / scoped private Storage
  → immutable audit event for decisions and money-related state

Stripe → signed webhook route → durable event inbox → idempotent processor
       → Lofgren service-order ledger → reconciliation / exception queue
```

Distinct environments: local (CLI/local DB), protected Preview (Lofgren isolated test data), persistent staging if justified, production (eventually public). Do not create a separate paid project for every PR by default; decide Preview data isolation based on actual provider plan, cost and supported branching. A Preview may use a persistent Lofgren test project with namespace/seed isolation if branch projects are unavailable, provided tenant and data leakage tests are strict. Never use LPIS resources as a shortcut.

Implement a server-only configuration module that fails fast on missing values. Prefix only intentionally public values with `NEXT_PUBLIC_`. Do not log the environment, bearer tokens, raw Stripe payloads containing sensitive fields, or database connection strings. `/api/health` returns `app: lofgren-enterprise`, commit SHA when provided by deployment, and safe readiness signals without secrets or internal stack traces.

## 3. Domain model and state machines

Start with the smallest schema that supports verified journeys. Add migrations incrementally rather than creating thirty unrelated tables in the first PR. Candidate aggregates:

- `profiles`; `organizations`; `organization_members`; `operator_grants` with only a controlled owner bootstrap.
- `applications`, `application_events`, `application_consents`, `application_attachments` with intake source, timestamps, retention dates, and status.
- `partners`, `partner_capabilities`, `partner_availability`, `introductions`, `introduction_approvals`.
- `ventures`, `venture_members`, `blueprints`, `blueprint_versions`, `deal_terms`, `deal_documents`, `document_access`.
- `tasks`, `task_events`, `activity_events` and structured exceptions.
- `service_orders`, `checkout_attempts`, `stripe_events`, `payments`, `payment_adjustments` for Lofgren fees.
- Later: `sales_sources`, `sales_import_batches`, `sales_lines`, `share_rules`, `share_calculation_runs`, `statement_periods`, `statements`, `reconciliation_exceptions`.

Every sensitive record carries organization/venture scope, actor/provenance, created/updated timestamps, status, and source reference. IDs are opaque UUIDs; display numbers are separate. Introductions and deal terms use versioned immutable decisions. Store money as integer minor units and ISO currency; percentages as bounded rational/decimal values with an explicitly tested rounding rule. Never use binary floating point for a posted amount.

State transition examples:

```text
Application: submitted → triage → info_requested → qualified | declined
Introduction: proposed → consent_pending → approved → disclosed | canceled
Blueprint: draft → operator_review → shared → superseded | withdrawn
Agreement: draft → sent_externally → signed_verified | rejected | expired
Setup fee: proposed → checkout_open → paid | failed | expired → refunded/disputed
Statement: calculated → exception_review → approved → issued → reconciled
```

Implement transitions on the server with an allowed-transition table and compare-and-swap/version checks. A successful external signature or payment is recognized only from verified provider evidence or a carefully audited operator record, never a client-supplied status. Agreements and equity are records of external legally approved documents, not magically created by a database write.

## 4. Authorization and privacy specification

Enable RLS on every exposed table; explicit grants and policies for each action. Anonymous intake should use a narrow server route with validation, rate limits and abuse controls rather than broad anonymous write access to all application data. Keep administrative writes server-only and narrow by operation. Be careful that a service key can bypass RLS; its server use requires an explicit policy check against the authenticated actor before the privileged action.

Build a matrix test suite across anonymous, applicant A, applicant B, partner A, venture member A, professional invited to venture A, outsider to venture B, operator, and owner. For each resource test intended allow and deny for list, direct ID read, insert, update, delete, file URL and download, and side-channel enumeration. Include role revocation, invitation expiry, ownership reassignment, document replacement and signed URL expiry. No cross-tenant leakage in API messages, counts, search results or audit events.

Storage: private buckets, path includes opaque venture or application scope, separate database access record, server-generated short-lived signed download URL after actor authorization, file type and size limits, malware workflow if available, deletion/retention policy. Do not serve legal/financial documents from a public bucket.

Owner bootstrap: manually establish the known founder identity in a controlled test environment and verify exactly one active owner role. Public registration cannot assign operator or owner. Record who grants and revokes access. Never hard-code Ethan's personal email as the sole authorization mechanism.

## 5. Payments: service fees before venture money flows

For a negotiated Lofgren setup fee, create an immutable service order with scope, price, currency, responsible payer, expiry, refund terms version and owner approval. The server creates a Stripe-hosted Checkout Session in the **dedicated Lofgren Stripe test account** with an idempotency key derived from an internal action ID. Checkout return page shows pending until backend confirms payment.

Webhook handler: read raw body, verify signature, verify test/live mode and account, store unique event ID durably, apply a transaction-safe state update, and return a response suitable for provider retry semantics. Duplicate delivery does not duplicate access or accounting. Handle asynchronous completion, expiration, failure, refund and dispute; fetch canonical Stripe object when event order makes local state ambiguous. Maintain a daily or operator-triggered reconciliation report comparing Stripe payment IDs/amounts to service orders.

**Do not build generic subscriptions or entitlement gating** merely because the attached intelligence notes include subscription examples. Lofgren's initial business model is negotiated service fees and later contractual equity/revenue-share arrangements. A producer's Shopify/Square/external sales do not become Stripe Connect transfers by adding a percentage field. Draft a separate funds-flow ADR stating who is merchant of record, where customer payments occur, which entity owes Lofgren, whether a connected account exists, and what Stripe actually supports. Require owner/provider/counsel review before live Connect or automated collections.

## 6. Intelligence layers: implement as evidence, not adjectives

| Layer | Minimum executable behavior | Evidence |
| --- | --- | --- |
| Product intelligence | Versioned task packet, clear acceptance cases and user journey | Task ID linked to PR and observed browser journey |
| Change intelligence | PR template, CI, protected branch if plan supports it, CODEOWNERS | Exact SHA, check names, changed files, review status |
| Deployment intelligence | Commit and deployment ID in health/logs, Preview protection and smoke | Deployment URL/ID, unauthenticated denial, screenshot |
| Data intelligence | Migrations, RLS negative/positive tests, generated types | Fresh replay, migration head, denial receipts |
| Financial intelligence | Signed webhook inbox, state projection, reconciliation | Test-mode event IDs, duplicates/refunds, ledger diff |
| Observability intelligence | Redacted structured logs, error and exception queues | Alert threshold and synthetic failure response |
| Recovery intelligence | Code rollback and disposable DB restore drill | Restored SHA/schema and verified read/write |
| Context intelligence | Scoped task packet, ADR index, concise verified handoff | Evidence manifest and next task with no guessed facts |

AI matching can suggest partners using criteria such as capability, region, capacity, lead time and conflict constraints. It must provide explanation and source references; Ethan approves disclosure. Do not add an AI API dependency until deterministic matching and manual review work. If later using a model, keep prompts and sensitive deal data scoped, log cost and purpose, and require explicit consent/retention design.

## 7. Build phases and gates

### LE-000 — Repository and provider reconnaissance

Read files and discover permissions. Inventory GitHub repo privacy, branch rules, installed apps, Vercel team/projects, Supabase organization/projects, and Stripe account contexts. Only record non-secret IDs and observed access. Do not create duplicate provider resources if a Lofgren-specific one already appeared after this pack was issued. Confirm current versions and syntax from official docs/installed CLIs before creating `.claude/settings.json`, hooks, Supabase CLI migrations or provider workflow files.

Deliver `docs/BUILD-STATE.md`, `docs/ARCHITECTURE.md`, `docs/THREAT-MODEL.md`, and `docs/adr/0001-environment-isolation.md`. Each unknown has owner, exact required action and verifiable completion signal. GitHub UI reported that branch rules for this personal private repo would not be enforced on the current plan; do not claim protection unless a supported plan/organization actually enforces it. A CODEOWNERS file alone is not a review gate.

### LE-001 — Buildable app and protected Preview

Follow `TASK-001.md`. Set up package manager lockfile, pinned dependencies, TypeScript strict mode, lint, formatting and accessible page shell. Add actual content based on the supplied business report, not subscription claims. Include responsive navigation, contact path, form shells and clear unlaunched state. Build CI using stable check names and least-privilege `permissions: contents: read`. Test typecheck, lint, build, basic routes, keyboard navigation and mobile viewport. Deploy from the exact commit to a separate Vercel project only when it builds; protect Preview and verify logged-out access fails. Record environment variable **names**, scopes and target project IDs, never values.

### LE-002 — Producer and partner intake

Create isolated Supabase Lofgren project only after owner chooses organization/region and confirms the actual quoted cost. Establish migration history and local test DB first. Implement intake forms with server validation, length/type bounds, honeypot/rate limiting, privacy consent version, idempotency key, confirmation reference, operator triage and anti-spam handling. Test malformed input, repeated submit, large payload, replay, concurrent updates and unauthorized read. Browser test a real submission into non-production DB and operator disposition. No cross-app data.

### LE-003 — Identity and private workspaces

Supabase Auth, verified email/invitation, callback allowlist, sessions, organization/venture membership, owner bootstrap, private Storage, secure downloads, operator dashboard. Write and run RLS negative tests before onboarding real people. Browser test sign-in, sign-out, return login, revoked membership, role transitions and cross-tenant URLs. Restore test DB from backup or export into disposable environment.

### LE-004 — Deal operations

Partner capacity records, proposed match, consent/approval gate, introduction, blueprint assumptions and version history, deal room tasks, external signed document tracking. A partner identity is disclosed only on approved transition. Blueprint math exposes sales forecast, price, COGS, gross margin, operating expense, cash requirement and sensitivity, with inputs labelled as assumptions. Document equity and revenue-share percentages as draft proposals until professionally approved agreements are verified.

### LE-005 — Stripe test-mode setup fee

Provision/access dedicated Lofgren Stripe account, test keys scoped to non-production, Checkout and webhook route, durable event inbox, service-order ledger, success/fail/expiration/refund/dispute tests, reconciliation. Use webhook signature and mode validation; cover duplicate and out-of-order delivery. No live price or charge, no reuse of Lofora account.

### LE-006 — Pilot and statement engine

Accept manual CSV or API-derived sales with explicit provenance, declared timezone, period, currency, tax/refund/shipping treatment and agreement version. Reject unknown formats and duplicates; quarantine exceptions. Calculate **proposed** share using deterministic decimal arithmetic and test every boundary. Operator reviews, signs off statement and exports. No Stripe Connect transfer. Verify revision after late refunds and amended data without silently rewriting issued statements.

### LE-007 — Hardening and first invitation-only pilot

Run security review and actual browser/database/Stripe integration suite on one pinned SHA. Test backup/restore, incident runbook, rate limits, service access, accessibility, performance budget, audit/event integrity, monitoring and error redaction. Invite only authorized pilot users after privacy/terms and industry-specific claims are approved. Measure conversion, time to blueprint, partner response, cost to serve, errors and support burden; do not claim profitability from estimates.

### LE-008 — Public site and financial expansion

Owner separately approves public site copy, brand/domain/DNS, real fees, contract templates and pilot results. Only then consider production deployment and live charges. Connect and sales automation require a separate approved architecture decision, supported payment flow, onboarding capability, agreements, test-mode reconciliation, controlled live verification and accounting review. Do not hide a new commercial program inside a code release.

## 8. Concrete test matrix

### Source and build

- Clean install from lockfile; lint, typecheck, build, unit tests, route smoke; no secrets in logs or bundle.
- CI workflow edits reviewed for least-privilege permissions and untrusted PR input safety.
- Preview deploy contains exact source SHA; health route, homepage and route smoke agree on application identity.

### Authentication and tenants

- Anonymous cannot access private records or file URLs; applicant A cannot read applicant B; venture A cannot read venture B; expired invite and revoked member lose access.
- Operator cannot accidentally gain owner by changing client metadata; direct API access denies forbidden mutation even if UI hides control.
- Full registration, callback, sign-out, return login and isolation journey in real browser and test DB.

### Intake and deal state

- Required consent and current policy version captured; malformed/oversized input rejected; duplicate submission idempotent; abuse throttled.
- Partner is not disclosed while consent pending; unauthorized actor cannot approve; audit history captures actor and previous/new status.
- Blueprint recalculation reproducible from versioned inputs and formula revision; no fabricated market data.

### Stripe and statements

- Invalid signature rejected; valid new event persisted; repeated event no duplicated side effect; temporary DB outage triggers safe retry; late refund adjusts ledger.
- Paid state comes from verified provider evidence, not redirect query parameter or browser POST.
- Sales import rejects duplicate lines; refunds, zero values, negative adjustments, period boundaries, rounding and currency mismatch tested; issued statement retained with correction trail.

### Recovery and observability

- Restore into disposable DB and verify representative authorized/denied queries; identify last known-good deployment and reversible code rollback.
- Redacted logs never expose PII, credentials, full document text or payment details; operational exceptions are visible to Ethan.

## 9. Claude Code Pro operating discipline

Claude Code Pro is an interactive coding assistant; a Pro subscription alone does not schedule continuous work or grant access to GitHub/Vercel/Supabase/Stripe. Do not promise a six-hour autonomous shift, infinite usage, unattended production control or guaranteed parallelism. Work in bounded sessions with an exact task packet and a resumable evidence handoff. Keep root `CLAUDE.md` short; put details here and retrieve sections as needed. Use one branch per outcome and avoid broad exploratory changes that consume context without producing evidence.

Recommended session rhythm:

1. Verify head and read task packet plus directly relevant ADRs.
2. Inspect the smallest relevant code surface, dependencies and current tests.
3. State one implementation decision and expected risks in the task notes.
4. Implement vertical slice; run narrow meaningful tests.
5. Run required gates; deploy isolated Preview when applicable.
6. Write evidence manifest and PR summary; mark unknowns unknown.
7. Hand off exact SHA, status, remaining gate and next smallest task.

Do not blindly copy the uploaded generic permission JSON or hook examples into `.claude/settings.json`; syntax, supported permission names and inheritance may differ by installed version. Prefer provider-level controls and GitHub permissions to a prose promise. A Claude hook is defense in depth only after its behavior is tested with allowed and denied commands. Never configure a bypass-permissions mode as standing practice.

For context efficiency, first read concise `ops` facts and changed files; pull in the original business report only for product copy and strategy decisions. Avoid repeatedly pasting long business notes into every task. Prefer unit/integration tests to repeated broad E2E runs during development; run full gates for release candidates. Record use of paid provider services and estimated spend; obtain owner approval for any new recurring charge.

## 10. Remote operations runbooks

### Failed CI

Identify workflow URL, head SHA, failed job, exact failing assertion and first relevant error. Reproduce locally or in an isolated test environment. Fix on the same feature branch, rerun the narrow failure and full required gate. Never mark a flaky test passed by rerunning until green without understanding cause.

### Failed Preview

Compare Vercel source SHA, build logs, environment scope and safe health response. Check that Preview points to Lofgren test DB and Stripe test mode. Do not expose Preview publicly as a workaround for authentication. Retain deployment ID and failure evidence.

### Failed migration

Stop remote writes. Replay complete migration chain in disposable DB; inspect schema delta, lock/compatibility and RLS. Write a forward repair migration. Never edit an already-applied migration in place or run improvised SQL against production.

### Failed webhook

Inspect event ID, signature verification outcome, durable inbox status and transaction ledger. Distinguish provider retry, duplicate, out-of-order and processing error. Repair processor idempotently and replay controlled test event. Do not manually set paid status solely from a dashboard screenshot.

### Suspected privacy or access leak

Stop feature promotion and preserve evidence without copying personal records into issues. Reproduce with synthetic identities, narrow the authorization failure, patch policy and route, add denial regression test, inspect affected access logs and escalate factual scope to Ethan. Customer notification is an owner/legal decision.

## 11. Launch readiness evidence

Before inviting first real user: current privacy policy, support contact, owner identity, terms, retention plan, scoped operator access, documented email flows, RLS negative tests, browser identity journey, backups and restore exercise, protected Preview and monitoring. Before charging first real fee: dedicated Lofgren live Stripe account, signed service terms and refund policy, approved price, controlled live transaction with reconciliation, tax/accounting owner review. Before automated venture sales collection: signed compensation agreements, source-of-truth sales integration, merchant-of-record/funds-flow legal analysis, approved Stripe Connect account structure, payout liability and dispute workflow, audited test and controlled live run.

### Final instruction to Claude

Start with LE-000 reconnaissance, then execute LE-001. Produce code and a protected Preview if access permits. If a provider gate blocks deployment, finish buildable code, CI and local browser proof, record the exact missing owner step, and continue independent work in the next slice. Never fill an evidence field with an assumption.

## Source references for version-sensitive guidance

Check live official documentation before implementing details: [Claude Code settings](https://code.claude.com/docs/en/settings), [project memory](https://code.claude.com/docs/en/memory), [GitHub protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches), [Vercel Git deployments](https://vercel.com/docs/git), [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [Stripe webhooks](https://docs.stripe.com/webhooks), and [Stripe Connect](https://docs.stripe.com/connect).
