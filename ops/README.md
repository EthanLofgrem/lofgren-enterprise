# Token Machine

One task per session. Keeps each Claude Code session small and its results verifiable.

Load order: `CLAUDE.md` -> active task packet -> the one or two `ops/rules/*.md` it names -> the `ops/verified-state/*.md` it names -> only the source files it lists. Do not load the long planning docs (`CLAUDE-CODE-PRO-MASTER-BUILD-PACK.md`, `BUILD-BRIEF.md`, `PLATFORM-OPERATIONS.md`) unless the packet cites a section.

| Folder | Holds | Rule |
|---|---|---|
| `task-packets/active/` | The one task being worked | Copy `TEMPLATE.md`. One subsystem per packet. |
| `rules/` | Short subsystem rules (RLS, migration, Stripe webhook, Vercel preview) | Stable. Change only from a verified lesson. |
| `verified-state/` | Facts proven by a command, CI run, or owner, each with SHA/date | No guesses. Unverified items go in the PR. |
| `evidence/latest/` | `<task>.json` from `EVIDENCE-TEMPLATE.json` | Summaries, not raw logs. |
| `handoffs/` | `<task>.md`, 200 words max | Next session starts from this. |

Finish: run checks -> write evidence + handoff -> update one verified-state file -> PR -> `/clear`.

Stop and split if: more than 8 production files, more than one subsystem, more than one migration, or a new provider permission is needed.
