# Build state

Updated 2026-09-27. Facts only; each line says how it was checked.

| Item | State | Checked by |
|---|---|---|
| Repo | `EthanLofgrem/lofgren-enterprise`, private | `git ls-remote`, clone |
| `main` head at start | `301b4b4f60d0a54e7d152ccd23ee2d627db6550e` | `git ls-remote` |
| Branch | `le-001-baseline`, code commit `b89e86f1d454c7d237610a246f48c879c5b3480e` | `git rev-parse` |
| Local gates | lint, typecheck, unit 6/6, build, e2e 24/24 pass | `ops/evidence/latest/LE-001.json` |
| CI | workflow `ci` added; first run pending | - |
| Branch protection | not enforced on this plan; owner-only merge by practice | PROVIDER-GATES.md |
| `gh` CLI | not logged in; git push uses saved credentials | `gh auth status` |
| Vercel | no Lofgren project | PROVIDER-GATES.md (not re-checked) |
| Supabase | no Lofgren project | PROVIDER-GATES.md (not re-checked) |
| Stripe | no Lofgren account; Lofora account excluded | PROVIDER-GATES.md |
| Local toolchain | Node 24.14.1 (official zip, SHA-256 verified) at `%LOCALAPPDATA%\Programs\node-v24.14.1`; pnpm 10.18.0 via corepack | command output |

## Open gates (owner)
1. Import repo into a new Vercel project `lofgren-enterprise`; enable Deployment Protection. Then Claude verifies Preview and health SHA.
2. Choose Supabase org/region and approve cost (unblocks LE-002).
3. Create dedicated Lofgren Stripe account (unblocks LE-005).
4. Optional: `gh auth login` so Claude can open PRs and read CI.
