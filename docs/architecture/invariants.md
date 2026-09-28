# Platform invariants

Engineering and operating boundaries every feature must preserve. They are not legal, tax, accounting, or financial advice. Each line names the test that proves it, or `planned` until the feature exists.

| # | Invariant | Proof |
|---|---|---|
| 1 | Every private record has one explicit scope: user, organization, venture, or internal Lofgren. Hidden UI is never the boundary. | `tests/db/intake.test.ts` (applications scoped to applicant or operator) |
| 2 | Venture access requires current membership or a scoped internal role, enforced by server checks and RLS. Revocation takes effect immediately. | intake: "revoked operator loses access"; ventures: planned (LE-003/004) |
| 3 | Ventures stay isolated from each other even when their members or partners overlap. | planned (LE-004 cross-venture matrix) |
| 4 | Agreements move through distinct states (draft, review, sent, signed, executed, superseded, expired, terminated). Executed versions are immutable; amendments are new linked versions. | planned; see `ops/rules/agreements.md` |
| 5 | Every financial calculation keeps its source rows, agreement/rule version, period, currency, rounding rule, adjustments, and software version. | planned; see `ops/rules/revenue-calculation.md` |
| 6 | Calculations are proposals until an authorized person approves them. Approval is not payment. | planned (LE-006) |
| 7 | Clients never write webhook, audit, reconciliation, executed-agreement, or payout-decision records. | intake: status history and grants are not client-writable |
| 8 | External events and imports survive retries and duplicates through durable identifiers. | intake: idempotency key test; Stripe/imports planned |
| 9 | Privileged actions record actor, scope, reason, time, and outcome. | intake: transition audit trail test |
| 10 | Venture admission, binding terms, legal execution, ownership, and live money movement need founder, legal, or finance authority. Claude Code and automation may build, test, and propose only. | process rule; enforced by owner-only merge and provider roles |
