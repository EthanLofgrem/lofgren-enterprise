# Venture operations (product contract)

Status: **draft for Ethan's approval**, 2026-09-28. Governed by `docs/product/CLAUDE-MISSION.md`. Engineering boundaries are in `docs/architecture/invariants.md` (branch `le/docs-invariants`). Anything not marked **Built** below is planned and must be described as planned.

## 1. Lifecycle

Applications and ventures move through seven stages. Every move is a recorded decision by an authorized person; nothing advances automatically.

| # | Stage | Purpose | Evidence to leave the stage | Decision owner | Exits |
|---|---|---|---|---|---|
| 1 | Qualify | Is this a real opportunity we can help with? | Complete application; screening notes; fit against current criteria | Operator (owner on appeal) | Decline, nurture, advance |
| 2 | Discover | Understand the asset, people, and goals | Discovery call notes; identified gaps; confidentiality in place before partner details are shared | Owner | Decline, pause, advance |
| 3 | Diligence | Verify what we were told | Ownership/rights evidence; capacity evidence; demand signal; known licenses and constraints | Owner | Pause, resolve evidence, advance |
| 4 | Blueprint | Write the plan | Shared blueprint version: roles, partners per gap, costs, price, margin, timeline, proposed terms marked draft, downside case | Owner; producer accepts or comments | Revise, pause, advance |
| 5 | Assemble | Put the people and agreements in place | Consented introductions; agreements executed outside the platform by the parties with their own advisers, recorded as evidence | Owner; each party for its own agreement | Pause, advance |
| 6 | Pilot | Small, bounded test | Pilot plan with spend ceiling and success thresholds; results against thresholds | Owner with venture members | Redesign, stop, advance |
| 7 | Operate | Run and improve | Periodic review against plan; open risks and decisions current | Owner with venture members | Scale, pause, exit |

Rules:

- Advancing requires: required evidence complete, no unresolved critical risk, and a recorded decision (actor, reason, time, version).
- A critical risk can be overridden only by an **owner exception** with a reason, mitigation, and review date. The exception is itself a recorded decision.
- A decline, pause, or stop is a normal outcome, not a failure state. Each has a recorded reason and can be revisited only by a new decision.
- Public wording follows the mission file's status language.

## 2. Roles

| Role | Can | Cannot |
|---|---|---|
| Visitor | Read public pages; submit an application through the site | Read any application or venture data |
| Applicant | (After LE-003) see own application status | See other applicants or partner identities |
| Operator | Triage and screen within granted scope; request evidence; propose decisions | Grant roles; override critical risks; approve terms |
| Owner (Ethan, exactly one active) | Everything an operator can; record stage decisions and exceptions; grant/revoke operators | Bypass the audit trail; act without a recorded reason |
| Venture member | See only ventures where membership is active | See other ventures; change roles |
| Invited professional (attorney, CPA) | Time-limited, venture- and document-scoped access | Anything outside that scope |
| Automation / AI | Draft, summarize, flag, remind; output labeled "Draft" | Approve, change status, move money, create roles |

Access is enforced by database RLS and server checks, never by hidden UI. Owner bootstrap is a documented manual procedure; public signup stays off.

## 3. Blueprint workflow

- A blueprint is a versioned record per venture. Drafts are editable; a version becomes **frozen** when shared with venture members.
- Changes after sharing create a new version linked to the previous one, with a change note.
- Every number is labeled as an assumption, estimate, or sourced figure. Ownership, fees, revenue share, and equity appear only as **draft proposals** until executed agreements are recorded as evidence.
- Producer response (accept, comment, decline) is recorded per version.

## 4. Risk register

Each risk: title, category, likelihood (1-3), impact (1-3), severity (derived), evidence level, owner, mitigation, due date, status, related stage.

- Severity critical = likelihood × impact ≥ 6, or marked critical by the owner.
- An open critical risk blocks stage advancement unless an owner exception exists.
- An overdue mitigation is flagged on the console; flags never change status on their own.

## 5. Metrics

Every metric has a definition, source query, and timestamp. Missing data shows `Unavailable`. No composite health score hides a hard stop.

Operator home (first version): new and aging applications; median time to first response; applications by status; information requests open; overdue decisions and tasks; ventures by stage; open critical risks and overdue mitigations.

Venture detail: days in stage; next decision and owner; evidence completeness for the current stage; open blockers and the oldest one's age; risks by severity; milestones on time vs. late; pilot results against declared thresholds; spend against approved ceiling (only from recorded figures).

Commercial metrics (sales, margin, revenue share) wait until sales imports and reconciliation exist.

## 6. Upload boundaries

- The public application accepts **no files**. It asks applicants not to include confidential documents.
- The dev project has a private quarantine bucket with no client access. It stays closed until the document slice delivers: opaque server-generated keys, venture- and class-scoped authorization, short-lived signed upload and download links, type allow-list plus file-signature check, size and quota limits, malware scan before promotion to a separate clean bucket, fresh authorization on every read, audit of uploads and downloads, and a retention and restore procedure.
- An uploaded agreement is evidence of a document, never proof of execution.

## 7. Planned vs. built

| Capability | State | Where |
|---|---|---|
| Public pages (home, process, producers, partners, fees, contact, draft privacy/terms) | Built, locally tested; not merged | PR #1 `le-001-baseline` |
| Intake schema, RLS, audited status transitions, one-owner rule | Built, locally tested; applied to dev Supabase | PR #3 `le-002-intake` |
| Server-only intake submit function | Built, tested; applied to dev | PR #3 |
| Apply form, server action, DB rate limit, noindex confirmation | Built, locally tested; rate limit applied to dev; no hosted end-to-end run yet | `le-002b-intake-form` |
| Rate limit counts only valid submissions | Planned (Gate 0 Step C) | |
| Synthetic hosted intake journey | Planned (Gate 1) | |
| Owner sign-in, work queue, screening, notes, evidence requests | Planned (Gate 2) | |
| Design system and redesigned public site | Planned (Gate 3) | `DESIGN-DIRECTION.md` |
| Venture workspace: stages, blueprint, risks, decision ledger | Planned (Gate 4) | |
| Documents, metrics, sales imports, calculations, Stripe setup fee, AI drafts | Later, by new instruction only | |
