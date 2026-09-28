# Lofgren Enterprise: Claude Code Mission

Owner: Ethan Lofgren · Repo: EthanLofgrem/lofgren-enterprise · Effective: 2026-09-28

This file is the single current plan. It replaces the master build pack, the production order, and the production runbook wherever they disagree. Read this file, `CLAUDE.md`, and the handoff for the active task. Read other documents only when a task names them.

## 1. Mission

Build and prove, in this order:

1. A working, protected producer and partner intake journey
2. The owner's sign-in and review console (LE-003)
3. A truthful, well-designed public website
4. One synthetic venture workspace

Everything else waits until real ventures need it.

## 2. How to work

- One task per session, one branch per task, one PR per branch. Branch name: `le/<task-id>-<topic>`.
- Never push to `main`. Only Ethan merges.
- Stop and report at the end of each gate. Don't start the next gate without Ethan's go-ahead.
- Inspect before changing. When a task starts with inspection, report findings before editing files.
- Don't restart the repo, rename LE task IDs, restructure folders, add CI workflows beyond what a task needs, or write new planning documents unless a task asks for one.
- Evidence over claims. Never say something passes, works, or is deployed without command output or a browser receipt from this session.

## 3. Hard boundaries

Never:

- Read, print, commit, or paste secrets (`.env*`, keys, tokens). Ethan types secrets into Vercel and Supabase himself.
- Run `supabase db push`, `vercel --prod`, or anything against production. Give Ethan the exact command instead.
- Edit a migration that has already been applied. Add a new migration.
- Enable public Auth signup, or guess anyone's email address.
- Connect live Stripe, or build Stripe Connect, payouts, transfers, refunds, ownership records, or agreement execution.
- Put applicant, venture, or financial data in public routes, page metadata, browser bundles, logs, screenshots, or chat.
- Use unprotected previews for testing with data.
- Open public intake. Leave `INTAKE_ENABLED=false` except during a supervised synthetic test.
- Show sample or invented numbers in the console. Missing data shows `Unavailable`.
- Put business strategy, partner names, deal terms, or other private business details in this repository. It is public.

Stop and ask Ethan when a task needs an account owner action, a cost decision, legal review, a production setting, or a destructive change.

## 4. Product facts

Venture stages (use exactly these names everywhere):

| # | Stage | Exits |
|---|---|---|
| 1 | Qualify | Decline, nurture, advance |
| 2 | Discover | Decline, pause, advance |
| 3 | Diligence | Pause, resolve evidence, advance |
| 4 | Blueprint | Revise, pause, advance |
| 5 | Assemble | Pause, advance |
| 6 | Pilot | Redesign, stop, advance |
| 7 | Operate | Scale, pause, exit |

A venture advances only when the required evidence is complete, critical blockers are resolved, and an authorized person records the decision. Overriding a critical risk requires a documented owner exception with a reason and a review date.

Status language:

- Use: "Submitted for review," "Potential fit," "Pilot under consideration," "Subject to review, agreements, and owner decision."
- Never use: "Approved venture," "Guaranteed," "Passive income," "Invest now," "Automatic payouts."

Authority: AI and automation can draft, summarize, flag, and remind. Only people approve applications, stage changes, roles, agreements, calculations, or payments.

## 5. Gates

### Gate 0: Integration (current)

**Step A: product contract (docs only).** On branch `le/product-contract`:

1. Add this file as `docs/product/CLAUDE-MISSION.md`.
2. Draft `docs/product/VENTURE-OPERATIONS.md`: the stages above, roles and decision owners, blueprint and risk workflow, metrics, upload boundaries, and a table of what's planned versus built.
3. Save the visual design direction as `docs/product/DESIGN-DIRECTION.md`, using the tokens in section 6.
4. At the top of the master build pack, production order, and runbook, add: "Superseded by docs/product/CLAUDE-MISSION.md."
5. Open a PR. Stop for Ethan's review.

**Step B: inspection only.** No code changes.

1. List branches, open PRs, exact SHAs, and CI status.
2. Confirm PR targets: `le/docs-invariants` → `main`; `le-002b-intake-form` → `le-002-intake`.
3. Give the exact reason PR #1's CI failed, from the run annotations.
4. List the exact commands the `verify` and `secret-scan` checks run.
5. Compare both repo migration files byte for byte with the SQL applied to the dev Supabase project (applied versions `20260928144903_le_002_intake` and `20260928151117_le_002b_intake_rate_limit`). Propose the least-risky reconciliation.
6. Replay all migrations in a disposable local database. No remote push.
7. Confirm whether a submission that fails validation uses up a rate-limit attempt, and propose the smallest fix.

Report and stop.

**Step C: after Ethan approves.** One PR each:

1. Open the missing PRs. Merge PR #1, then #2, then #3, and the others in dependency order, with Ethan merging.
2. Apply the migration reconciliation. Give Ethan any remote command to run himself.
3. Fix the rate limit so only validated submissions count, with tests.
4. After CI has run on `main`, give Ethan the exact branch-protection settings: require a PR plus the `verify` and `secret-scan` checks.

### Gate 1: Synthetic intake journey

Protected Vercel preview plus the dev Supabase project only.

1. Confirm these are set in the Preview environment only, without printing values: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `INTAKE_HASH_SALT` (32+ characters), and `INTAKE_ENABLED=true` for the test window.
2. Through the real web forms, submit one synthetic producer and one synthetic partner.
3. Verify and record:
   - The confirmation shows a reference only, and no route looks up an application by reference.
   - Exactly one application row and one event per unique submission.
   - Duplicate submission, validation errors, and the spam trap each behave as designed.
   - Five valid attempts succeed and the sixth is refused.
   - A database outage makes the form fail closed.
   - Anonymous and signed-in browser clients can't call the server-only functions.
   - Public signup is off, and the quarantine bucket isn't accessible from the browser.
   - Desktop and phone runs, keyboard navigation, labels, and error messages all work.
   - No secrets appear in logs, artifacts, or the browser bundle.
4. Set `INTAKE_ENABLED=false` again. Report and stop.

### Gate 2: LE-003 owner console

1. Ask Ethan for his owner email. Invite that account only, with one owner grant. Signup stays off. Document how to bootstrap, recover, and revoke the owner.
2. Protected `/console` with sign-in; work queue (new, aging, assigned, blocked); application detail with a chronological event history; structured screening and internal notes; evidence requests; allowed status changes only.
3. Every decision records the actor, reason, evidence, time, and version. A change of mind is a new event, never an edit.
4. Enforce access in the database (RLS) and on the server, not just by hiding UI.
5. Test signed out, unrelated user, revoked operator, owner, version conflict, and the audit record. Report and stop.

### Gate 3: Public website

Separate PRs, in this order:

1. Design tokens, fonts, layout, and accessibility basics
2. Navigation and home page
3. Producer and partner criteria, fit check, and the multi-step form
4. How It Works with the seven-stage timeline, including exits

Use real Lofgren content only: no invented testimonials, logos, results, or venture photos. Support reduced motion. Each PR includes desktop and phone screenshots, a keyboard check, a contrast check, and loading, empty, and error states.

### Gate 4: One synthetic venture workspace

Convert one synthetic qualified application into a venture. Build stage tracking, a stage owner, the next decision, tasks and milestones, a versioned blueprint (frozen once shared), a risk register, and a decision ledger. Test cross-venture isolation, an overdue risk, blocked advancement, and the owner-exception path.

### Later (don't start without a new instruction from Ethan)

Secure document uploads (quarantine, scanning, signed short-lived links), metrics, sales imports, calculation proposals, Stripe Checkout for Lofgren's own setup fee, and AI drafting features.

## 6. Design tokens

Text-safe shades, each meeting 4.5:1 contrast on both light backgrounds:

| Token | Hex | Use |
|---|---|---|
| graphite | `#10161A` | Main text, dark navigation |
| forest | `#183A32` | Brand, dark sections |
| sand | `#F2EBDD` | Page background |
| cloud | `#FAF8F3` | Cards, forms |
| copper | `#985A31` | Links, primary buttons (white text) |
| stone | `#676A65` | Secondary text |
| status-green | `#277655` | Verified or complete only |
| status-amber | `#8E5F1A` | Needs attention |
| status-red | `#B14646` | Blocked or critical |

The lighter brand shades (copper `#B86D3C`, amber `#C98625`) may be used only for large decorative accents, never for text. Status colors always carry a text label, never color alone.

## 7. Report format (end of every task)

- Task / outcome:
- Branch / PR / exact SHA:
- Changed files (and migration head, if any):
- Commands run, with pass/fail/skip counts:
- Browser receipts (desktop, phone) and negative-access results:
- CI run URL and whether the jobs actually ran:
- Preview URL and protection state:
- Risks, open gates, and exactly what Ethan must do next:

Keep the report under 200 words.
