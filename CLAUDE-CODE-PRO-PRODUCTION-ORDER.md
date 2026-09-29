> **Superseded by docs/product/CLAUDE-MISSION.md.** Kept for reference; where they disagree, the mission file wins.

# Claude Code Pro production order — Lofgren Enterprise

**Owner:** Ethan Lofgren, CEO and founder. **Canonical repository:** `EthanLofgrem/lofgren-enterprise`. **Status:** build and pilot preparation; no verified public production release. **Companion documents:** `CLAUDE-CODE-PRO-MASTER-BUILD-PACK.md`, `LOFGREN-ENTERPRISE-PRODUCTION-RUNBOOK.md`, `CLAUDE.md`, `PROVIDER-GATES.md`, `ops/README.md`, and `docs/BUILD-STATE.md`. This order converts the architecture into an executable sequence. Do not claim a requirement is satisfied merely because it appears here.

## 1. The mission and first fifteen minutes

Build a professional public website and an operator-led venture platform that can accept producer and partner applications, review opportunities, invite approved people into isolated workspaces, manage blueprints and introductions, collect Lofgren's own agreed setup fee through a dedicated Stripe account, and produce auditable pilot statements. Ethan must be able to operate the entire workflow from a founder/admin control plane. Deliver an invitation-only pilot first, then a separately gated public launch.

Start every session in `Documents\lofgren-enterprise` on Ethan's PC:

```bash
git remote -v
git status --short --branch
git fetch origin --prune
git branch -avv
git log -5 --oneline --decorate
```

Read the six companion documents and open PRs. Preserve uncommitted work. PR #1 (`le-001-baseline`, last reported head `085e488f24125b1192c82510b7bd61aa41bad10d`) is the initial source baseline. PR #2 (`le-production-runbook`) holds the operational guide. Reverify both heads and any new task PRs before coding. Do not blindly rebase another worker's branch or push to `main`. GitHub Actions on PR #1 was blocked before jobs started by GitHub's billing/spending-limit annotation; a locally passing suite is still useful, but does not replace remote CI.

Produce an opening handoff containing repo identity, exact SHA, PRs, local install/build/test state, Vercel/Supabase/Stripe project identity if verified, and a single bounded task to implement. If private repo access fails, state the exact access error and prepare a patch/task packet; do not improvise another repository.

## 2. Source of truth and seven roles

The seven roles are ChatGPT, five scheduled ChatGPT tasks, and Claude Code Pro. Scheduled task runs are asynchronous checkpoints, not persistent processes or a seven-agent shared terminal. The source of coordination is a GitHub issue/task packet, one feature branch per bounded result, a draft PR, and `docs/BUILD-STATE.md`. No role may claim another role completed work until the evidence is inspected.

| Role | Scope | Evidence handed to next role |
| --- | --- | --- |
| ChatGPT | Cross-provider inventory, priority, conflicts, gate reconciliation, CEO report | Exact SHA and provider IDs/status, next critical path |
| Task 1 | Website, UX, accessibility, copy and SEO | Rendered metadata, route and mobile/keyboard results |
| Task 2 | Intake, applications and producer/partner journeys | E2E receipts and abuse/denial cases |
| Task 3 | Supabase schema, identity, RLS and CEO controls | Migration replay, role matrix, audit results |
| Task 4 | Lofgren Stripe test commerce and statement math | Signed webhook, replay/refund and reconciliation evidence |
| Task 5 | CI, Vercel preview, monitoring, restore and release gates | Exact-head deployment, incident and release ledger |
| Claude Code Pro | Vertical implementation slices and local verification | Commit, PR, changed files, tests, deployment and open gates |

At start: inspect claims and PRs, declare task ID and paths you own in a task packet, then work on `le/<task-id>-<topic>`. At finish: publish branch/PR, exact commit and environment, test commands and pass/fail/skips, affected migration head, browser receipts, risks and next task. If branches overlap, coordinate in PR comments or ask ChatGPT to sequence; never silently overwrite. Keep the current business state in `docs/BUILD-STATE.md` with evidence links and timestamps; use a short `CLAUDE.md` to point to it. Pause LPIS production work and use no LPIS or Lofora provider resources, data, code, domain, secrets, brand or Stripe account.

## 3. Product contract and order of build

Lofgren Enterprise coordinates business opportunities led by producers and supported by qualified partners. An application is an expression of interest, not acceptance, funding or a contract. Ethan approves invitations, identity disclosures, commercial terms and public release. The initial system can stop at a reviewed blueprint if legal or provider gates are open; do not falsely mark an incomplete journey paid or launched.

Build these vertical slices, each with a separate PR and acceptance evidence:

1. **LE-001 public baseline:** verify existing Home, How it works, For producers, For partners, Fees, Contact, draft legal pages and health endpoint. Fix observed errors only. Make preview protected and CI executable after account gate.
2. **LE-002 intake:** separate producer and partner forms; server validation, request rate/size limits, consent version, confirmation ID, duplicate handling, secure attachments only when storage and malware workflow are ready, operator review queue. Use local test DB first; create an isolated Lofgren Supabase project after organization, region and budget are decided.
3. **LE-003 identity:** email verification and invite-only access, callback allowlist, organization/venture membership, private Storage and document access, Ethan owner bootstrap, scoped operator access, revocation and audit events. Prove negative RLS with real restricted clients.
4. **LE-004 venture operations:** application decisions, partner capability and conflicts, proposed matches, both-side consent before identity disclosure, venture workspace, versioned blueprint and assumptions, tasks, external document status, immutable audit trail. Keep legal execution external until an approved provider/process exists.
5. **LE-005 fee collection:** versioned owner-approved service order, test Checkout in dedicated Lofgren Stripe account, raw-body signed webhook, durable event inbox and idempotent processor, ledger, refund/dispute exception queue and reconciliation. The browser success URL does not set `paid`.
6. **LE-006 statement pilot:** import sourced sales lines and agreement version, deterministic minor-unit math, explicit refund/tax/shipping treatment, exception review, owner approval and export. Label output proposed unless verified agreement and sales source support final status. No automatic transfer.
7. **LE-007 invitation-only pilot:** fixed test cohort, privacy/legal review, provider identity check, full synthetic E2E, restore rehearsal, incident monitoring and founder release decision. Only after this should LE-008 public indexing and intake be separately approved and executed.

The order is constrained by provider gates: Vercel preview can follow LE-001; local data architecture can progress without cloud DB; Stripe source and simulator tests can progress without dedicated account, but Stripe integration/live mode cannot be claimed. Work on independently testable slices while a gate is pending.

## 4. Website and words

Use this exact tone: direct, credible, precise and respectful of a producer's work. Avoid vague superlatives, hype, investment language, fabricated social proof and false deadlines. Working value proposition: **“Lofgren Enterprise helps producers develop business opportunities, coordinate qualified partners, and manage approved ventures through a clear, accountable process.”** This is positioning copy, not a verified historical performance claim. Ethan must confirm legal entity name, geography, exact services, fee policy, support channel and founder bio before publication.

| URL | H1 | Suggested title | Suggested meta description | Main action |
| --- | --- | --- | --- | --- |
| `/` | Develop an opportunity with a clear path forward | Lofgren Enterprise — Venture Development and Partner Coordination | Explore how Lofgren Enterprise helps producers shape opportunities, coordinate partners and move approved ventures through a structured process. | See how it works |
| `/how-it-works` | A practical process from proposal to pilot | How It Works — Lofgren Enterprise | Learn how a proposal is reviewed, scoped and, when approved, developed with a private workspace and qualified partners. | Explore producer path |
| `/for-producers` | Support for producers building a venture | For Producers — Lofgren Enterprise | Bring an opportunity, explain the support you need and learn how Lofgren Enterprise reviews and develops producer-led proposals. | Apply when intake opens |
| `/for-partners` | Contribute your expertise to approved opportunities | For Partners — Lofgren Enterprise | Learn how qualified partners may be considered for reviewed opportunities, with introductions made only after approval and consent. | Register interest when open |
| `/fees` | Clear terms before work begins | Fees and Engagement — Lofgren Enterprise | Understand how Lofgren Enterprise scopes services and presents fees in a written order before paid work begins. | Discuss scope |
| `/contact` | Contact Lofgren Enterprise | Contact — Lofgren Enterprise | Ask about producer opportunities, partnerships or the Lofgren Enterprise process through the available contact channel. | Contact team |

Copy rules: “application received” rather than “accepted”; “proposal under review” rather than “investment opportunity”; “qualified partner” only when eligibility criteria actually exist and are applied; “estimated” for forecasts. Fee page must disclose only approved fee types and terms. Contact form remains visibly disabled until privacy, spam protection, delivery and monitored inbox are ready. Draft Privacy and Terms remain labeled draft and blocked from indexing. Add an About page only with Ethan-approved professional background and verified business facts; CEO role alone does not imply a team or decades of operating history.

Make the site usable on 320px wide screens and desktop, with visible focus, semantic landmarks, one H1 per page, descriptive links, readable contrast, form labels and accessible validation. Verify keyboard navigation, reduced motion, empty/error/loading/success states, and content at zoom. Use an actual contact route before CTA says “Contact us.” No dead-end button.

## 5. SEO and marketing operations

The goal is discoverability for accurate branded and service queries, not a guarantee of search ranking. Map one primary visitor question to each page. Research real search terms and competing descriptions when a public domain is chosen. Avoid repeating the same keyword across thin duplicate pages. On production only, emit distinct titles/descriptions, canonical URLs on verified domain, `robots.txt`, sitemap of approved public URLs, Open Graph and favicon; exclude private, admin, draft legal and preview routes from indexing. Check the server-rendered HTML and HTTP headers, redirect/canonical behavior, sitemap URLs and noindex on preview. Add structured Organization data only for verified name, URL, logo, contact and social profiles; omit unavailable fields and fabricated ratings. Set Search Console ownership and submit sitemap after DNS/domain verification. Track index coverage and branded queries, not rankings as a proxy for business success.

Marketing plan: clarify two audiences (producer and partner), offer and qualification criteria; publish pages that answer real questions; create three useful articles from verified expertise (how proposals are reviewed, how consented introductions work, what a venture blueprint includes); invite a small pilot cohort; gather consented feedback and anonymized objections; improve landing pages and calls to action. Measure visits by source, CTA clicks, completed consented applications, qualified applications, approved opportunities and pilot outcomes. Use aggregated or pseudonymous analytics; never ship proposal text, email, documents or payment data as analytics properties. Any outreach, ad budget, claim or public announcement needs Ethan's explicit approval and a monitored response process.

## 6. Architecture and data rules

Use the existing Next.js/TypeScript/pnpm baseline. A server-only configuration module fails closed on missing environment variables and rejects live Stripe credentials outside production. Keep adapters for GitHub, Vercel, Supabase and Stripe separate from business state transitions. Never put service-role or Stripe secret keys in a `NEXT_PUBLIC_` variable or client bundle. Keep local, protected Preview and production resources distinctly named and scoped; record project IDs and URL in an access-controlled inventory, never key values in Git.

Minimal data model: profile, organization, membership, application, application event and consent; partner capability, introduction and approvals; venture membership, blueprint version, document access, task and audit event; service order, checkout attempt, webhook inbox, payment adjustment and reconciliation exception; later sales source, import line, agreement rule, calculation run and statement. Every sensitive row has actor, scope, timestamps and source. Use opaque IDs, constrained state transitions, version checks and immutable audit events. Money is integer minor units plus ISO currency and specified rounding. Migrations are append-only after application; replay from empty DB and test rollback/forward repair in disposable data.

For each exposed table and private bucket, implement RLS or server-side authorization and prove allow/deny for anonymous, applicant A, applicant B, partner, venture member A/B, invited professional, operator and Ethan owner. Cover list, direct ID, search/count side channels, mutation, download URL, expired invitation and revoked role. Never trust user-editable metadata or hidden UI controls for authority. Service-role calls require a preceding actor authorization check and logged operation. Owner bootstrap is an explicit controlled procedure; public signup can never produce an owner.

## 7. Ethan's CEO/admin control plane

The founder dashboard must let Ethan see a sourced operating picture: intake queue with status and age; partner review and capability evidence; venture pipeline and stage; proposed introductions and consent; blueprint versions and tasks; service orders, Stripe test/live context, webhook exceptions, refunds/disputes and daily reconciliation; proposed statements; privacy/deletion requests; incidents, deployment SHA, backup/restore state, pending approvals and audit trail. Every number has a query/source and timestamp. Unknown is `Unavailable`, not zero.

Owner actions: approve/reject applications, approve disclosure after both sides consent, grant/revoke scoped operator access, approve service terms and price, release statements, publish content, authorize production deployment and live commercial state. Operators can triage and prepare proposals only as explicitly delegated. Implement deliberate confirmation for risky actions, server-side authorization, reason entry and immutable audit record; no universal “impersonate customer” bypass. Use least-privilege session, MFA if supported and configured, a separate recovery route, and tests for exactly one active founder owner and role revocation. A production capability is gated on Ethan's review, not on a database flag supplied by the browser.

## 8. End-to-end certification matrix

For each test, record exact commit, environment/project ID, synthetic identity, expected and observed result, timestamp and artifact. Required happy paths:

1. Anonymous visitor sees truthful public page and can find process/fees/contact, but cannot read private route.
2. Producer submits consented test application; sees reference; duplicate retry has one record; operator sees triage; applicant sees own status after invitation.
3. Partner submits capabilities; operator reviews; neither side sees the other's identity before recorded consent; approved invitation grants only scoped venture data.
4. Ethan creates blueprint with sourced assumptions; producer reviews permitted version; an outsider's direct link, API call and file download fail.
5. Test service order goes to hosted Checkout; signed webhook confirms payment and ledger; duplicate event leaves one payment; refund changes ledger and statement proposal.
6. Source-backed sales import generates reproducible proposed statement; correction creates a new traceable version, not a silent overwrite.

Required failure paths: empty/malformed/oversize form, spam/replay/rate limit, invalid callback, expired invite, revoked role, cross-tenant list/direct URL/download, operator attempting owner action, failed migration, missing config, wrong Stripe account/mode/signature, out-of-order webhook, DB outage and provider retry, refund/dispute, currency mismatch, negative/zero/rounding, lost deployment, restore into disposable DB, missing privacy version and missing contact delivery. Test real browser at desktop and phone, keyboard, accessibility, route headers and noindex on protected previews. Mock tests are useful unit evidence; mark them as mock, and do not represent them as provider integration.

## 9. CI, provider gates, rollout and rollback

PR gate: lockfile install, lint, TypeScript, focused unit/integration, clean migration replay, security tests, build, browser tests for changed routes, secret scan and dependency checks. On the exact PR head, GitHub Actions must actually run and pass; current billing/spending failure is an unresolved external gate. A personal private repo's branch-rule UI may not enforce required checks on its current plan, so verify actual enforcement before claiming protected `main`.

Preview gate: GitHub SHA equals Vercel deployment SHA and `/api/health` reported app identity; deployment is login protected from logged-out visitor; Preview points only to isolated Lofgren test Supabase and Stripe test mode; no private data in logs; run synthetic journeys. Production gate: owner-approved legal/copy/fees/contact, exact SHA and all checks, backup and restore rehearsal, monitored error alerts, protected secrets, deployed route/browser/authorization/commerce smoke, staged traffic, and explicit owner release record. Public indexing, public applications and live charges are three separate switches; enable each only with its own evidence. On failed smoke, disable intake/charges as appropriate, roll back Vercel to known-good deployment, preserve event inbox and audit, and report incident facts.

Provider setup requests to Ethan should be concrete: desired GitHub billing remedy or spending cap; Vercel team/project ownership and deployment protection; Supabase organization, region and monthly budget; separate Lofgren Stripe account and business verification; canonical domain, contact inbox and legal entity/copy approvals. Do all source/local prep before requesting a missing owner decision. Never reuse an LPIS/Lofora/FoundFunds project or secret to unblock a gate.

## 10. Claude's next work packet

**Task:** Certify and repair LE-001, then prepare LE-002 without depending on cloud provider setup. Fetch latest branches; review PR #1's actual files and logs; confirm local pnpm version and lockfile; run `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, and browser suite using package scripts as actually defined. If a script differs, record the real script and command instead of inventing it. Fix real defects on `le-001-baseline` and record new SHA. Leave PR #2 documentation separate. Inspect GitHub Actions annotation; do not label it code failure. Design LE-002 schema and form acceptance matrix on a fresh branch and disposable local database; write negative tests. If a protected Preview can be configured with existing permissions and cost approval, deploy exact SHA and prove logged-out denial; otherwise report the exact provider action needed. Return the handoff template below.

```text
Task ID / outcome:
Repo / branch / PR / exact SHA:
Changed files and migration head:
Commands, pass/fail/skipped counts, relevant logs:
Browser journey, viewport, accessibility and negative access receipts:
GitHub CI URL/status and whether jobs actually ran:
Vercel project/deployment ID, URL, source SHA and protection result:
Supabase project ref/environment and RLS replay result:
Stripe account context, mode and event/reconciliation result:
Business copy/legal/privacy status:
Risks, blockers, responsible party and next bounded task:
```
