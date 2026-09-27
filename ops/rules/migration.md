# Migration rules
- Schema changes only as files in `supabase/migrations`. Never edit an applied migration; write a forward repair.
- Prove with a fresh local replay (`supabase db reset`) and `supabase test db`.
- Regenerate types after schema changes.
- Claude never runs `supabase db push` or any remote/production migration.
