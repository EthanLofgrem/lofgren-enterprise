# Vercel setup (owner checklist)

Project: `lofgren-enterprise` (team `ethans-projects-a7eaa281`). These are settings only the account owner can change. Type secret values into Vercel and GitHub yourself; never paste them into chat, issues, or commits. Verified facts are in `ops/verified-state/deployment.md`.

## Now

1. **Keep Deployment Protection on** (Settings → Deployment Protection → Vercel Authentication) for all deployments, including Production, until public launch is approved. Leave **Git Fork Protection** on.
2. **Automated preview checks.** Settings → Deployment Protection → Protection Bypass for Automation → create a secret. Then in GitHub: repo Settings → Secrets and variables → Actions → New repository secret named `VERCEL_AUTOMATION_BYPASS_SECRET` with that value. The `preview-smoke` workflow then tests every successful preview, confirms `/api/health` reports the deployed commit, and confirms logged-out visitors are refused.
3. **Production branch** is already `main` (verified 2026-09-29). The current Production deployment (`085e488`) was the project's first deployment; once the stack merges, `main` deploys become Production (still protected). Do not promote a preview.
3a. **Optional tidy-up:** Settings → Functions → Function Region = `sfo1` so the dashboard matches `vercel.json` (every deployment already uses `sfo1`).
4. **Environment variables** (Settings → Environment Variables). Scope each to **Preview** only for now; leave **Production** empty until launch:

| Name | Value source | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Dev project `kaddnaknuhptcleppspj` API URL | Not secret |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Dev project publishable key | Not secret; used by the console sign-in (see `docs/OWNER-ACCESS.md`) |
| `SUPABASE_SECRET_KEY` | Dev project secret key | Server only; never `NEXT_PUBLIC_` |
| `INTAKE_HASH_SALT` | A new random value, 32+ characters | Server only |
| `INTAKE_ENABLED` | `false` | Set `true` only during the supervised Gate 1 test, then back to `false` |

## Code-side settings (in the repo)

- `vercel.json` sets the function region to `sfo1` (San Francisco), next to the dev Supabase project in `us-west-1`.
- `vercel.json` `ignoreCommand` skips a deployment when a commit changes only `docs/`, `ops/`, or Markdown files. Vercel shows these as skipped/canceled; that is expected.
- `package.json` pins Node `24.x`, matching CI. Leave the project's Node.js Version setting on 24.x (or default) so the two agree.
- Search indexing stays off unless `SITE_INDEXING=true` on **Production**; canonical and share URLs use the production address (`NEXT_PUBLIC_APP_URL`, else Vercel's production URL) even on previews.
- Every page sends `noindex`; Vercel also adds `X-Robots-Tag: noindex` to previews.

## Before public launch (owner decisions, in order)

1. **Plan.** The Hobby plan is for personal, non-commercial use. Move the team (or a new team just for Lofgren Enterprise) to **Pro** before the site takes real applications. Cost decision: owner.
2. **Domain.** Buy or choose a domain, add it to this project only, and set `NEXT_PUBLIC_APP_URL` for Production to `https://<domain>`. Canonical links, the sitemap, and share cards use it.
3. **Production Supabase.** A separate production project with its own keys; migrations applied by the owner. Production variables use those values, never the dev project.
4. **Legal review.** Privacy notice and terms approved by counsel; bracketed items filled in; `CONSENT_VERSION` bumped.
5. **Protection.** After the above, turn off Vercel Authentication for **Production only** (keep it on previews), then set `SITE_INDEXING=true` on Production and redeploy. Only `/`, `/how-it-works`, `/who-can-join` and `/examples` become indexable.
6. **Analytics (optional).** Enable Web Analytics or Speed Insights only after the privacy notice mentions them.

The other launch gates are in `docs/product/CLAUDE-MISSION.md`.
