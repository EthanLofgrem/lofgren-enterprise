# VOS-001 steps 1–7: public claims, navigation, application journey

Work pack LE-PROD-VOS-001, first slice. Branch `le/vos-001-public-truth`, starting from `6dae175` (`le/website-screenshot-fixes`).

Owner decision (2026-09-29): **Lofgren Enterprise is a service provider with no ownership stake by default.** Any stake would be negotiated separately with counsel. Public copy must not promise legal documents, filings, signing services, or ownership.

## Baseline (before changes, at `6dae175`)

| Check | Command | Result |
|---|---|---|
| Install | `pnpm install --frozen-lockfile` | pass |
| Lint | `pnpm lint` | pass |
| Types | `pnpm typecheck` | pass |
| Unit + DB (PGlite) | `pnpm test` | 107 passed |
| Build | `pnpm build` | pass |
| Browser (desktop + Pixel 7) | `pnpm test:e2e` | 101 passed, 7 skipped |

No pre-existing failures. `preview-smoke` fails on every deployment because no Vercel bypass key exists (owner gate, see `docs/VERCEL-SETUP.md`).

## Claim inventory and corrections

Classification: **U** = unsupported public promise, **F** = future capability shown as current, **OK** = accurate.

| Claim (before) | Where | Class | Now |
|---|---|---|---|
| Lofgren "may become a member of the new LLC or receive a fee for organizing it" | `/fees`, FAQ, home "Our role" | U | Paid only for services chosen, under written terms; no automatic ownership |
| Stage 5 "Sign and form your LLC"; "We help coordinate the attorney, the signing, and the LLC filing" | `content.ts` STEPS | U | "Decide whether to make it official": the team uses its own professionals; we organize information only |
| "An operating agreement … prepared with an attorney"; "Agreements are prepared with a licensed attorney" | FAQ, `/how-it-works` | U | The team's own attorney prepares or reviews; Lofgren doesn't prepare legal documents |
| "Electronic signing (we plan to use DocuSign)" | `/how-it-works` | F | Removed; signing described without a provider |
| "When a team is ready: an attorney-prepared agreement everyone signs, and a new LLC" | home | U | "We keep it moving": pilot and optional operating support |
| "Each team gets its own LLC"; "A team that goes ahead forms its own LLC" | FAQ, PROMISES | U | Only teams that choose to formalize; members own it; Lofgren doesn't automatically |
| Stage 7 "Lofgren stays on … as described in your agreement" | STEPS, FAQ | U | Optional support under a separate written service agreement the business can end |
| "State filing fees and attorney costs … the team agrees how they are covered" | `/fees` | OK→clarified | Paid directly to the team's own providers, no markup |
| "Creating an account" | `/fees`, `/contact` | U | "Applying" (applying creates no account) |
| Capital only on terms "an attorney has confirmed" | `/capital-partners`, FAQ | OK | Kept; general legal-review statement |
| Core lines and the seven stage names | site-wide | OK | Unchanged |

Regression guard: `tests/e2e/site-quality.spec.ts` now rejects these phrases on every public page (e.g. "form your llc", "attorney-prepared", "through docusign", "profits interest", "create an account"). Update the list only with evidence that a capability exists.

## Navigation inventory

Covered by automated tests on desktop and phone:

- Every internal link on all 11 public pages returns < 400 (header, mobile menu, footer, cards, inline links, CTAs).
- Mobile menu opens and navigates; header "Apply" and hero "Apply to join" reach `/join`; browser Back returns home.
- Legacy paths `/apply` and `/producers` redirect to `/join` and `/who-can-join`.
- Unknown paths return a 404 page with links home.

No broken routes, placeholder links, or anchors found.

## Application journey

Applications are closed (`INTAKE_ENABLED` unset/false), so the journey must end in an explicit closed state.

| Before | After |
|---|---|
| Walk four steps, then a greyed-out "Send my application" button | Final step shows "End of the preview. Applications aren't open yet, so there is nothing to send." No submit button renders while closed |
| Top notice "Applications open soon…" | "Applications aren't open yet. You can preview the questions below, but you can't send an application" |
| `/contact` showed a disabled fake form with a "Send message" button | Replaced with "Messages aren't open yet." and links to the FAQ and the seven steps; no form |

New tests in `tests/e2e/journey.spec.ts` (desktop and Pixel 7):

- Keyboard only: Tab/Enter/Space through all four steps; focus moves to each step heading; the "choose at least one" error focuses the group; ends in the closed state.
- Invalid email blocks Continue and focuses the field.
- Refresh clears the form (nothing stored).
- Home CTA → `/join` → browser Back → home.
- No sideways scrolling on a phone for nine key pages.

Existing coverage kept: axe WCAG 2.1 A/AA in light and dark mode on all public pages, server-side validation and rate limiting (unit), submission idempotency (DB tests).

## Not in this slice

Steps 8 onward (lifecycle, consent, readiness, decision log, Blueprint, Pilot, owner console exceptions, tenant isolation) follow in separate PRs. Supabase migrations need the owner to run `supabase db push`; nothing here touches the database.
