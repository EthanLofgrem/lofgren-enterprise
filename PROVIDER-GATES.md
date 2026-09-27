# Provider setup gates — Lofgren Enterprise

Verified on 2026-09-27. This is an operational ledger, not a claim that provider services are connected.

| Provider | Observed state | Next concrete action | Blocker |
|---|---|---|---|
| GitHub | Private `EthanLofgrem/lofgren-enterprise`, current baseline `b555db181849e3e461031808168180d0d56dae40`; docs and Claude instructions committed | Give Claude Code access to this repo; add buildable app and CI; use PRs | GitHub connector returned 404 for newly created private repo, likely installation scope. GitHub UI says private personal repository branch rules are **not enforced** until GitHub Team/Enterprise organization account; do not present un-enforced rules as protection. |
| Vercel | Existing team `Ethan's projects` has no Lofgren project; existing projects belong to other ventures | Import Lofgren repo after buildable app exists; new `lofgren-enterprise` project; test-only Preview env and deployment protection | Need owner team/plan and buildable SHA. Never bind existing LPIS project. |
| Supabase | Only organization `Ethan's projects` appears, with LPIS projects; no Lofgren project | Choose organization, region, request actual cost quote, confirm cost, create isolated Lofgren project | Supabase project tool requires user to choose organization and confirm cost. Never reuse LPIS DB. |
| Stripe | Available account named `Lofora Autoscale A.I.`; no dedicated Lofgren account exposed | Owner creates/adds Lofgren Enterprise business account, completes identity/terms, grants scoped connector access, then obtain test context | Do not use the Lofora account for Lofgren charges. Owner banking, tax, business identity and ToS are required. |

## Account strategy decision
The user's phrase "create these accounts custom to Lofgren Enterprise" may mean either: (A) new provider login/organization/business account for each service, or (B) distinct project/repository/Stripe business account under existing Ethan logins. Current GitHub repo follows B. For operational simplicity choose B unless owner requires separate legal/account ownership. A requires new login email, MFA, account terms, billing, cross-account OAuth/app installations, and possible GitHub repository transfer. Never silently create a second account or transfer the repo.

## Immediate answer needed from Ethan
- Confirm A or B above.
- For Supabase, explicitly choose `Ethan's projects` or name a new organization; select region and approve the quoted cost after it is retrieved.
- For Stripe, establish legal business name, country and status, and complete separate Stripe account onboarding via provider Dashboard. Do not send identity, bank, or tax details through chat.
- For Vercel, confirm whether the current `Ethan's projects` team is the owner or whether a separate team is required; any plan upgrade/charges need owner action.

## Claude handoff
Claude can start TASK-001 immediately using GitHub credentials authorized for the new repo. Provider setup must not be faked with placeholders or old-business secrets. On each successful provider setup, update this ledger with non-secret ID and exact verification receipt. Do not store secret values in git.
