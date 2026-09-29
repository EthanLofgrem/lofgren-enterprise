-- Owner access procedures. NOT a migration: run each block by hand in the
-- Supabase SQL editor (as the project owner) when needed. See docs/OWNER-ACCESS.md.
-- Replace OWNER_EMAIL / OPERATOR_EMAIL before running. Never commit real emails.

-- 1. Grant the first owner. Does nothing if an active owner already exists or
--    the account hasn't confirmed its email.
insert into public.operator_grants (user_id, role, reason)
select u.id, 'owner', 'Owner bootstrap'
from auth.users u
where u.email = lower('OWNER_EMAIL')
  and u.email_confirmed_at is not null
  and not exists (select 1 from public.operator_grants g where g.role = 'owner' and g.revoked_at is null)
returning id, user_id, role, granted_at;

-- 2. Grant an operator (someone who can review applications but is not the owner).
insert into public.operator_grants (user_id, role, reason, granted_by)
select u.id, 'operator', 'Granted by owner', (select g.user_id from public.operator_grants g where g.role = 'owner' and g.revoked_at is null)
from auth.users u
where u.email = lower('OPERATOR_EMAIL') and u.email_confirmed_at is not null
returning id, user_id, role, granted_at;

-- 3. Revoke someone's console access. Takes effect on their next request.
--    The grant row is kept for the audit trail.
update public.operator_grants g
set revoked_at = now()
from auth.users u
where u.id = g.user_id and u.email = lower('OPERATOR_EMAIL') and g.revoked_at is null
returning g.id, g.role, g.revoked_at;

-- 4. Check who has access right now.
select g.role, u.email, g.granted_at
from public.operator_grants g join auth.users u on u.id = g.user_id
where g.revoked_at is null
order by g.role, g.granted_at;
