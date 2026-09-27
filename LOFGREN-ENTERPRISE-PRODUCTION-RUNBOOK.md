# Lofgren Enterprise: production, growth, and seven-worker runbook

Owner: Ethan Lofgren. Canonical source: `EthanLofgrem/lofgren-enterprise`. Read `CLAUDE.md`, `ops/README.md`, `docs/BUILD-STATE.md`, `PROVIDER-GATES.md`, `CLAUDE-CODE-PRO-MASTER-BUILD-PACK.md`, and open PRs before acting. This runbook complements the master pack; the repository and verified provider state take precedence over guesses in this document.

## Starting state and the next instruction to Claude Code Pro

As of 2026-09-27, LE-001 exists on `le-001-baseline` at `085e488f24125b1192c82510b7bd61aa41bad10d` and draft PR #1 is open. Claude reported a local build, lint, types, six unit tests and 24 browser tests; recheck the evidence file and rerun checks against the exact SHA before using those numbers. GitHub Actions for PR #1 did not start because of an account billing or spending-limit annotation. Treat this as an infrastructure gate, not a passing CI run or a source defect. The protected Vercel preview, isolated Supabase project, and dedicated Lofgren Stripe account have not been verified. Do not publish, accept real applicants, or process real payments yet.

Claude: start by `git fetch`, inspect branch/PR heads and file ownership, rerun existing checks, and post an exact-head handoff. Add only the next bounded implementation slice on a distinct branch; do not overwrite another worker's branch or push to `main`. Record commands, results, screenshots where applicable, migration replay and negative permission tests in `docs/evidence/`. Use a PR for every slice. Keep LPIS resources and Lofora Stripe isolated.

## Product and business language

Working positioning, subject to Ethan's confirmation: “Lofgren Enterprise helps producers shape business opportunities, coordinate qualified partners, and move approved ventures through a clear process.” Call an opportunity a *proposal* until reviewed, an introduction *requested* until both sides consent, and a financial figure an *estimate* until sourced and approved. Do not promise funding, investment returns, guaranteed revenue, ownership percentages, legal representation, or a specific service outcome. Never invent customers, testimonials, deal volume, staff biographies, certifications, pricing, or an operating footprint.

Use these page messages as a starting copy contract, then edit with Ethan's verified facts:

| Page | Visitor question | Primary message | Action |
| --- | --- | --- | --- |
| Home | What is this? | Business development and venture coordination for producers and partners. | Explore how it works |
| How it works | What happens next? | Submit a proposal, receive review, agree the scope, and work in a private space if approved. | See the process |
| For producers | Is my idea suitable? | Explain your opportunity and what help you need; submission does not guarantee acceptance. | Start an application when open |
| For partners | How do I participate? | Describe your capabilities; introductions require review and consent. | Register interest when open |
| Fees | What will I pay? | Display only approved fee types and concrete terms; state when fees are negotiated per written order. | Request a scope discussion |
| Contact | How do I reach the team? | Give a monitored channel, response expectation only if verified, and a privacy explanation. | Send a message when intake is live |

Draft Privacy and Terms pages must remain visibly draft and nonindexable until reviewed and published by the owner. Do not collect submissions through a disabled or unreviewed form. If intake opens, present data categories, purpose, retention, consent version, deletion/contact route and abuse controls before submission.

## Website, SEO, and marketing workstream

Build an accessible responsive site with semantic headings, readable contrast, keyboard and screen-reader flows, lightweight assets, mobile navigation, form error recovery and consistent calls to action. Use a distinct title and description for each indexable page, one canonical production origin, human-readable URLs, a sitemap of approved public routes, robots rules that exclude private and draft routes, and appropriate Open Graph images. Check rendered server HTML, 404, redirect behavior and production metadata. Keep preview and staging `noindex`; do not add a production domain to Search Console until the domain and canonical are verified.

Initial search-intent map (research and validate with real queries before treating as rankings): “venture development support” on Home; “business proposal process” on How it works; “producer venture support” on For producers; “venture partnership opportunities” on For partners; and branded “Lofgren Enterprise” on Home/About. Write for visitors first; do not stuff keywords or create thin doorway pages. Organization/LocalBusiness structured data must include only verified organization name, contact, logo, address and social profiles. Do not use review, rating or FAQ markup without matching eligible visible content.

Marketing launch sequence: (1) agree target audiences, scope, geography, lawful claims, offer and contact address; (2) publish truthful service and process pages with conversion events; (3) connect verified domain and Search Console, submit sitemap and inspect index coverage; (4) create two or three genuinely useful explainers from actual customer questions; (5) run a small invitation-only pilot, capture consented feedback and objections; (6) revise copy based on observed journeys. Track source/medium, landing page, qualified enquiry, reviewed application and approved opportunity, without storing private proposal content in analytics. Use privacy choices and consent where required. Establish who may approve public statements.

## Platform journeys and acceptance tests

The journey is anonymous visit → consented producer or partner application → server validation and spam/rate checks → operator triage → request for information or rejection/approval → invitation → authenticated private workspace → scoped blueprint and tasks → consented partner introduction → versioned service order → Stripe test Checkout and signed webhook → ledger reconciliation → source-backed statement → closure and export/deletion handling. Implement in increments from the master pack. Each transition must have actor, timestamp, prior/new state, and authorization. Never let browser-provided role, tenant, fee or status determine authority.

Test desktop and phone; keyboard and screen reader landmarks; empty/invalid/duplicate submissions; expired invites and revoked roles; direct URL attacks; cross-venture reads/writes; draft and private file URLs; owner versus operator access; retries and partial outages; consent withdrawal; payment duplicate/out-of-order events; refund and statement adjustments. Use synthetic users and data. Save a matrix with expected/actual result, URL or route, commit SHA, environment ID, timestamp and screenshot/log reference. RLS tests must prove denial from a real restricted client, not merely inspect policies.

## CEO and admin control plane

Bootstrap Ethan as owner with verified identity and server-side role assignment, with a separate break-glass recovery procedure. Provide owner dashboard for applications, ventures, partner eligibility, introductions, service orders, payment/reconciliation exceptions, statements, consent versions, data requests, incidents, deployments and audit history. Operators may triage and propose actions within scoped permissions; only owner can grant/revoke elevated roles, approve external publication, finalize sensitive commercial terms, release production, or authorize live financial changes. Record who acted, what changed, why, affected entity, timestamp and immutable event ID. Add two-person review for consequential payouts or future ownership changes if that feature is introduced. Never put service-role keys in the browser; use least-privilege server paths, protected secrets and noneditable role claims or membership tables. Provide revocation and session invalidation tests.

## Provider and release topology

GitHub: one private canonical Lofgren repo, protected `main`, PR review and required checks after the billing gate is repaired; feature branches per slice, CODEOWNERS/ownership, secret scanning and dependencies. Vercel: separate Lofgren project, Git integration, protected previews, environment-scoped secrets and distinct Preview/Production domains. Supabase: separate Lofgren project and approved region/cost, migrations under version control, RLS on exposed tables, private Storage, tested backup/restore and connection separation. Stripe: dedicated Lofgren account, test first, restricted keys, signed webhook endpoint with durable event deduplication, audit and reconciliation; owner alone authorizes live mode after a service order and legal review. Record provider IDs and URLs in an access-controlled state file, not credentials in Git.

Release gate: exact source SHA and green local plus GitHub CI; protected preview on that SHA; full synthetic user journey and negative access tests; approved privacy/terms and truthful public copy; owner review of fees and support contact; recovery rehearsal and monitoring; production deployment and smoke tests; then controlled public indexing/intake. Roll back to a known deployment on failed production checks and pause intake until the incident is resolved. Do not claim launch readiness from a local build alone.

## Seven-worker coordination

There are seven roles, not seven always-running processes. ChatGPT owns sequencing, provider review and reconciliation; five scheduled tasks make bounded asynchronous attempts and report results; Claude Code Pro builds and tests in its own local environment. A run request is not evidence of completion. Coordinate through GitHub PRs and a single `docs/BUILD-STATE.md` ledger with exact branch/SHA, task owner, open gate, last verified date and next action. Do not rely on shared conversational memory.

| Role | File/area ownership | Acceptance evidence |
| --- | --- | --- |
| ChatGPT orchestrator | Priorities, provider gates, cross-PR conflicts, truthful status | Consolidated exact-head gate ledger |
| Task 1 website/SEO | Public pages, metadata, accessibility, search map | Mobile/desktop checks, rendered SEO output |
| Task 2 journeys | Intake, partner application, private flows | Synthetic end-to-end and abuse cases |
| Task 3 data/security/admin | Migrations, RLS, roles, CEO controls | Migration replay, allow/deny audit |
| Task 4 commerce | Lofgren Stripe test integration and statements | Signed webhook/replay/refund/reconcile tests |
| Task 5 release/operations | CI, previews, incidents, recovery, readiness | Exact SHA evidence and gate decisions |
| Claude Code Pro | Implementation slices agreed in PR/task packet | Source commits, tests, handoff and PR |

At the start of each shift: read current branches, PRs and `BUILD-STATE`; claim one bounded issue or task packet with touched paths; check for concurrent claims; implement on a new branch; run focused tests; open a draft PR; update the evidence and handoff. If no GitHub access, produce a patch/task packet and state the access gate rather than invent a commit. Do not have two workers edit the same migration or policy concurrently. Weekly, reconcile open PRs, provider spending, incidents, search coverage and user feedback; each metric needs a source and timestamp.

## Immediate prioritized queue

1. Claude verifies PR #1 and commits any fixes to its branch. ChatGPT and Task 5 isolate and resolve GitHub Actions billing/spending gate; only then treat CI as a valid release signal.
2. Owner chooses Lofgren Supabase organization, region and budget, and creates/authorizes a dedicated Stripe business account. Keep Lofora and LPIS untouched.
3. Import the Lofgren repo into a separate Vercel project and verify protected preview from the exact PR SHA before connecting a public domain.
4. Task 3 and Claude build migration/RLS/admin foundation; Task 2 builds isolated intake on top; Task 4 builds Stripe test workflow after account identity is verified; Task 1 completes SEO and copy when legal/business facts are confirmed.
5. Task 5 assembles the invitation-only pilot gate, then a separate public launch gate with owner signoff.

## Repository cleanup boundary

`lofgren-enterprise` already exists; do not create a second repository. Preserve `EthanLofgrem-LPIS-2` as paused LPIS. `LPIS-Platform` may hold different history; compare references, deployment dependencies and unique content before any consolidation. Preserve other distinct business/source histories until inventoried and backed up. `fortishell-platform` appears to contain one README commit and is an explicitly named deletion candidate. Tillvex was not visible among the owner's ten repositories on 2026-09-27; locate its exact owner/repo before attempting deletion. Removing a repository is not necessary to make room for Lofgren Enterprise.
