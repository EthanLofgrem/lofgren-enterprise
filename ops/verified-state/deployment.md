# Deployment state
Updated 2026-09-29. Facts only, each with how it was checked.

## GitHub
- `EthanLofgrem/lofgren-enterprise` is public; `main` is still `301b4b4` (docs only). Checked with the GitHub API.
- CI (`verify`, `secret-scan`) runs on pull requests; passed on PR #3 at `62b83a0` (run 36506165997).
- Branch protection: not set yet. Control is owner-only merges.

## Vercel
Read-only review on 2026-09-29 with the Vercel CLI 61.0.0 (signed in as the owner) plus logged-out curl. Nothing was changed. Environment variables were listed by name only.
- Team `ethans-projects-a7eaa281`, **Hobby** plan. The team also holds unrelated projects and a domain; none are attached to this project.
- Project `lofgren-enterprise` (`prj_W1PC6dLFEvAuWBscSrrL8ijruZj3`): Next.js preset, default build/install/output commands, Node 24.x, linked to GitHub `EthanLofgrem/lofgren-enterprise`, **production branch `main`**.
- Deployment Protection: Vercel Authentication on **all** deployments (`ssoProtection.deploymentType = all`); Git Fork Protection on; directory listing off. Logged-out requests to the production URL, its `robots.txt`, and the latest preview all get `302` to `vercel.com/sso-api`.
- **Protection Bypass for Automation: none exists**, so `preview-smoke` fails by design on every deployment.
- **Environment variables: none, in any environment.** Intake is therefore off and the console reports "not configured" on every deployment.
- Production target: `085e488` from `le-001-baseline` (2026-09-28), region `iad1`. It was the project's first deployment, which Vercel makes Production automatically. It predates `vercel.json`. Production address: `project-r5r1u.vercel.app` (only domain; no custom domain).
- Latest preview: `6dae175` on `le/website-screenshot-fixes`, Ready, region `sfo1` (from `vercel.json`). The project's dashboard default function region is still `iad1`; `vercel.json` overrides it per deployment.
- Last 20 deployments: 16 Ready, 1 Canceled, 3 Error. The errors are docs-only branches without `package.json` (`le-production-runbook`, `le/product-contract`), 2026-09-28; they expire under the 30-day retention (10 kept).
- No cron jobs, no deploy hooks. PR comments on; Web Analytics and Speed Insights have IDs but are not collecting.
