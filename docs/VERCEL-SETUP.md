# Vercel setup (owner checklist)

Project: `lofgren-enterprise` (team `ethans-projects-a7eaa281`). These are settings only the account owner can change. Type secret values into Vercel and GitHub yourself; never paste them into chat, issues, or commits. Verified facts are in `ops/verified-state/deployment.md`.

## Now

1. **Keep Deployment Protection on** (Settings → Deployment Protection → Vercel Authentication) for all deployments, including Production, until public launch is approved. Leave **Git Fork Protection** on.
2. **Automated preview checks.** Settings → Deployment Protection → Protection Bypass for Automation → create a secret. Then in GitHub: repo Settings → Secrets and variables → Actions → New repository secret named `VERCEL_AUTOMATION_BYPASS_SECRET` with that value. The `preview-smoke` workflow then tests every successful preview, confirms `/api/health` reports the deployed commit, and confirms logged-out visitors are refused.
3. **Production branch:** Settings → Git → Production Branch = `main`. The current Production deployment (`085e488`) came from a manual deploy; after PR #1 merges, `main` deploys become Production (still protected).
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
- Every page sends `noindex`; Vercel also adds `X-Robots-Tag: noindex` to previews.

## Before public launch (not now)

Separate production Supabase project and variables, a custom domain, turning off protection for Production only, removing site-wide `noindex`, and the other launch gates in `docs/product/CLAUDE-MISSION.md`.
