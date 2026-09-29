# Deployment state
Updated 2026-09-29. Facts only, each with how it was checked.

## GitHub
- `EthanLofgrem/lofgren-enterprise` is public; `main` is still `301b4b4` (docs only). Checked with the GitHub API.
- CI (`verify`, `secret-scan`) runs on pull requests; passed on PR #3 at `62b83a0` (run 36506165997).
- Branch protection: not set yet. Control is owner-only merges.

## Vercel
Checked from GitHub deployment records (created by `vercel[bot]`) and logged-out requests; no Vercel account access from this machine.
- Project `lofgren-enterprise` under `ethans-projects-a7eaa281`, connected to the repo; every pushed branch gets a Preview.
- Previews for app branches build successfully (latest: `5156e40`). Branches without the app (`le-production-runbook`, `le/product-contract`, based on docs-only `main`) fail to build; expected until PR #1 merges.
- A deployment of `085e488` (LE-001) is marked **Production**. It came from a manual deploy, not from `main`.
- Deployment Protection is on for previews, the Production deployment, and the project address `lofgren-enterprise-ethans-projects-a7eaa281.vercel.app`: logged-out requests to `/`, `/api/health`, and `/join` get `302` to `vercel.com/sso-api`, with `X-Robots-Tag: noindex`. Checked with curl and `tests/e2e/deployed.spec.ts` (desktop and mobile) on 2026-09-29.
- Not verified (needs Vercel access): environment variables per environment, the production branch setting, and the function region in use.
