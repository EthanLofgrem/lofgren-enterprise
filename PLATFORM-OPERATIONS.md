# Lofgren Enterprise remote construction control plane

## Verified baseline — 2026-09-27
- Private GitHub repository: `EthanLofgrem/lofgren-enterprise`, handoff commit `55229f8a63f6468488403c73bcb311269eefd049`.
- No Lofgren Enterprise Vercel or Supabase project was present at inventory. Existing projects are LPIS/Lofora/FoundFunds and are outside this scope.
- Connected Stripe context `acct_1SgoSAADUI0ZNppc` is named Lofora Autoscale A.I.; never use it for Lofgren Enterprise without an explicit account-owner decision.
- This file is a configuration design, not proof of a working deployment, Stripe account, or database.

## Authority and service map
| Service | System of record | Claude may do | Owner/provider gate |
|---|---|---|---|
| GitHub | Code, review, CI evidence | Feature branches, PRs, source tests | Sensitive merge, access changes, release decision |
| Vercel | Immutable build and deployment | Protected Preview and smoke checks | Public production, domain/DNS, paid plan |
| Supabase | Auth, tenant data, RLS, documents | Local migrations, isolated test project/branch | Project cost, production migration, restore |
| Stripe | Lofgren service fee payments | Test-mode Checkout, webhook and reconciliation tests | Dedicated Stripe business account, live enablement, Connect funds flow |
| Claude Code | Proposed changes and evidence | Read scoped context, implement, test, summarize | Cannot self-approve an unverified claim or spend/transfer money |

## Product intelligence
Use `BUILD-BRIEF.md` as product scope. One bounded task per branch. Each task packet states user journey, tenant boundary, changed paths, acceptance evidence, risks, and stop conditions. Operator approval is a stored event, never a boolean controlled by the browser. Partner matching is an advisory suggestion until Ethan approves disclosure and introductions. Blueprints show assumptions, source, units, and sensitivity; draft legal and ownership terms stay visibly draft.

## Change intelligence
Use `feature/<task-id>-<summary>` branches and PRs. Start with a single protected `main` and a separate staging configuration. Do not require a second human reviewer until one exists; a one-owner repository can deadlock on mandatory external review. Require CI checks only after the workflow emits stable names. Add CODEOWNERS for payment, auth, RLS, migrations, workflows, and infrastructure; owner review and deployment approval are separate gates. Avoid broad persistent automation tokens. GitHub connector access is not automatically granted to newly created private repositories; verify the installation scope before relying on it.

## Deployment intelligence
A Vercel project named `lofgren-enterprise` should import this exact private repository after a buildable app exists. Local, Preview, staging, and production have separately scoped variables. Preview points only to a Lofgren test database and Stripe test mode, with deployment protection if private deal workflows or test data exist. Production promotion requires exact SHA, CI, deploy ID, schema compatibility, browser journey, and owner approval. `/api/health` reports app identity, commit SHA, and non-secret dependencies; it never reveals keys.

## Data intelligence
Model organizations, members, ventures, applications, partners, introductions, consent, blueprints, documents, tasks, service orders, sales provenance, proposed share calculations, statements, payment events, and audit events. Enable RLS on every exposed table, explicit ownership/membership predicates, narrow storage policies, and outsider negative tests. Do not derive authorization from user-editable metadata. Version SQL migrations and prove full replay before remote application. Track a migration's irreversible side effects and forward repair.

## Financial intelligence
First Stripe flow: Lofgren-owned setup fee with hosted Checkout in test mode. Verify raw webhook signature; dedupe event IDs; update an internal ledger transactionally; reconcile refunds/disputes. Success URL is informational, not proof of payment. Proposed venture revenue shares from imported sales are calculations only. Connect collection or transfer requires verified contracts, merchant-of-record determination, supported account capabilities, payout liability assessment, and controlled test-to-live evidence. Generic subscription entitlements in the attached notes are examples, not a Lofgren Enterprise requirement.

## Observation and recovery
Emit structured redacted logs with request ID, actor, organization, venture, commit, deployment ID, and event ID. Collect CI run URLs and summarized pass/fail receipts without PII. Monitor failed intake, auth denial spikes, webhook backlog, reconciliation exceptions, and deployment errors. Keep backup and restore runbooks; test database restore in disposable scope. Roll back app by known-good deployment; repair database with a reviewed forward migration.

## Claude context and token budget
Root `CLAUDE.md` stays concise. Read one task packet, relevant ADRs, diff, and exact-head evidence; avoid feeding all historical discussions into every session. A task packet must name allowed files and success conditions. Store verified receipts in `ops/verified-state/`; put hypotheses in issues/PRs, not verified-state. Summarize each session with commit SHA, tests, provider IDs without secrets, outstanding gates, and next smallest task. Do not install unverified hook/permissions examples from generic notes as if their syntax and semantics are proven; test against the installed Claude Code version and enforce hard boundaries at GitHub/provider permissions.

## Missing setup inputs and decisions
1. Choose whether Lofgren Enterprise gets distinct **logins/business accounts** at each provider or separate projects inside Ethan's current owner accounts. The former requires new email identities, signups, terms, billing, and access grants; the latter is faster and still isolates projects/data.
2. Supabase: choose the owning organization, region, and confirm the current quoted project cost before creation. Never use LPIS databases.
3. Stripe: establish the actual Lofgren legal entity, country, business details, ownership, bank/tax information, and dedicated Stripe account; identity and terms must be completed by owner. Do not route Lofgren charges through the Lofora account by default.
4. Vercel: choose owner team and plan, create a buildable app, import the repo, configure isolated Preview environment, then verify protection. A blank docs-only repo is not a working deployment.
5. GitHub: ensure Claude Code's GitHub credential/installation has scoped access to this new private repository. Add a backup owner or recovery method before important customer data exists.
6. Product: decide pilot niche, geographic service area, pricing of setup fee, intake fields, support address, data retention, legal copy, and whether first pilot is invitation-only. Attorney reviews NDA/non-circumvention, compensation terms, e-signature process, and regulated niche claims.

## Gates by business outcome
| Claim | Required evidence |
|---|---|
| Ready for Claude | Private repo, instructions, scoped access, task packet |
| Preview live | Buildable SHA, Vercel deployment ID, protection check, browser smoke |
| Intake operational | Isolated database, RLS tests, actual submit/review, abuse controls |
| Setup fees tested | Dedicated Stripe test context, signed webhook, replay/refund lifecycle |
| Accepting real fees | Owner-approved service terms/prices, live account and controlled reconciliation |
| Automated venture shares | Signed agreements, verified source sales, Connect/payment-flow approval, reconciliation |
