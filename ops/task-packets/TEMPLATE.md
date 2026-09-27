# LE-XXX: <title>

Risk: low | moderate | high   Class: ui | api | migration | rls | stripe | ci | preview
Branch: le-xxx-<slug>   Base: main

## Objective
One sentence.

## Allowed paths
- 

## Load
- `CLAUDE.md`
- `ops/rules/<one>.md`
- `ops/verified-state/<one>.md`

## Non-goals
- No production deploy, live Stripe, remote migration, or unrelated refactor.

## Acceptance
- [ ] 
- [ ] `pnpm lint && pnpm typecheck && pnpm test && pnpm build` pass
- [ ] Evidence and handoff written

## Stop and ask if
- Production access, a secret, a paid resource, or a destructive migration is needed
- Scope grows beyond allowed paths
