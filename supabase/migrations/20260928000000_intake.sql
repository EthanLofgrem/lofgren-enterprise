-- LE-002 intake: applications, status events, operator grants.
-- Anonymous intake goes only through submit_application(); status changes only
-- through transition_application(). No client role gets direct write access.

create type public.application_kind as enum ('producer', 'partner');
create type public.application_status as enum ('submitted', 'triage', 'info_requested', 'qualified', 'declined');
create type public.operator_role as enum ('owner', 'operator');

-- Operator grants ------------------------------------------------------------
create table public.operator_grants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  role public.operator_role not null,
  granted_by uuid references auth.users (id),
  granted_at timestamptz not null default now(),
  revoked_at timestamptz,
  reason text not null check (char_length(reason) between 3 and 500)
);
create unique index operator_grants_one_active_per_user on public.operator_grants (user_id) where revoked_at is null;
create unique index operator_grants_one_active_owner on public.operator_grants (role) where role = 'owner' and revoked_at is null;

-- Applications ---------------------------------------------------------------
create table public.applications (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique default ('LE-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))),
  kind public.application_kind not null,
  status public.application_status not null default 'submitted',
  version integer not null default 1,
  applicant_user_id uuid references auth.users (id) on delete set null,
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) <= 254 and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' and email = lower(email)),
  organization text check (char_length(organization) <= 160),
  location text not null check (char_length(location) between 2 and 160),
  summary text not null check (char_length(summary) between 20 and 4000),
  capacity text check (char_length(capacity) <= 2000),
  gaps text[] not null default '{}' check (cardinality(gaps) <= 12),
  goals text check (char_length(goals) <= 2000),
  timeline text check (char_length(timeline) <= 200),
  consent_version text not null check (char_length(consent_version) between 1 and 40),
  consented_at timestamptz not null,
  idempotency_key uuid not null unique,
  source text not null default 'web' check (source in ('web', 'operator')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index applications_status_created on public.applications (status, created_at);

create table public.application_events (
  id bigint generated always as identity primary key,
  application_id uuid not null references public.applications (id) on delete cascade,
  actor_id uuid references auth.users (id),
  from_status public.application_status,
  to_status public.application_status not null,
  reason text check (char_length(reason) <= 2000),
  created_at timestamptz not null default now()
);
create index application_events_app on public.application_events (application_id, created_at);

create table public.application_transitions (
  from_status public.application_status not null,
  to_status public.application_status not null,
  requires_reason boolean not null default false,
  primary key (from_status, to_status)
);
insert into public.application_transitions (from_status, to_status, requires_reason) values
  ('submitted', 'triage', false),
  ('submitted', 'declined', true),
  ('triage', 'info_requested', true),
  ('triage', 'qualified', false),
  ('triage', 'declined', true),
  ('info_requested', 'triage', false),
  ('info_requested', 'declined', true);

-- Authorization helper -------------------------------------------------------
create function public.is_operator() returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.operator_grants g
    where g.user_id = auth.uid() and g.revoked_at is null
  );
$$;

-- RLS: enabled everywhere; only reads are granted to clients ------------------
alter table public.operator_grants enable row level security;
alter table public.applications enable row level security;
alter table public.application_events enable row level security;
alter table public.application_transitions enable row level security;

revoke all on public.operator_grants, public.applications, public.application_events, public.application_transitions from anon, authenticated;
grant select on public.operator_grants, public.applications, public.application_events, public.application_transitions to authenticated;

create policy operator_grants_select_own on public.operator_grants
  for select to authenticated using (user_id = auth.uid() or public.is_operator());

create policy applications_select on public.applications
  for select to authenticated using (applicant_user_id = auth.uid() or public.is_operator());

create policy application_events_select_operator on public.application_events
  for select to authenticated using (public.is_operator());

create policy application_transitions_select on public.application_transitions
  for select to authenticated using (true); -- static reference data, not tenant data

-- Intake: the only write path for anonymous visitors --------------------------
create function public.submit_application(
  p_idempotency_key uuid,
  p_kind public.application_kind,
  p_name text,
  p_email text,
  p_location text,
  p_summary text,
  p_consent_version text,
  p_organization text default null,
  p_capacity text default null,
  p_gaps text[] default '{}',
  p_goals text default null,
  p_timeline text default null
) returns text
language plpgsql security definer set search_path = ''
as $$
declare
  v_ref text;
  v_id uuid;
begin
  select a.reference into v_ref from public.applications a where a.idempotency_key = p_idempotency_key;
  if found then
    return v_ref; -- repeat submit: same reference, no new row
  end if;

  insert into public.applications (
    idempotency_key, kind, name, email, location, summary, consent_version, consented_at,
    organization, capacity, gaps, goals, timeline
  ) values (
    p_idempotency_key, p_kind, btrim(p_name), lower(btrim(p_email)), btrim(p_location), btrim(p_summary),
    p_consent_version, now(), nullif(btrim(p_organization), ''), nullif(btrim(p_capacity), ''),
    coalesce(p_gaps, '{}'), nullif(btrim(p_goals), ''), nullif(btrim(p_timeline), '')
  )
  on conflict (idempotency_key) do nothing
  returning id, reference into v_id, v_ref;

  if v_id is null then -- lost a concurrent race on the same key
    select a.reference into v_ref from public.applications a where a.idempotency_key = p_idempotency_key;
    return v_ref;
  end if;

  insert into public.application_events (application_id, actor_id, from_status, to_status)
  values (v_id, auth.uid(), null, 'submitted');
  return v_ref;
end;
$$;

-- Operator status change with allowed transitions and optimistic locking ------
create function public.transition_application(
  p_application_id uuid,
  p_to public.application_status,
  p_expected_version integer,
  p_reason text default null
) returns integer
language plpgsql security definer set search_path = ''
as $$
declare
  v_from public.application_status;
  v_version integer;
  v_requires_reason boolean;
begin
  if not public.is_operator() then
    raise exception 'not authorized' using errcode = '42501';
  end if;

  select a.status, a.version into v_from, v_version
  from public.applications a where a.id = p_application_id for update;
  if not found then
    raise exception 'application not found' using errcode = 'P0002';
  end if;
  if v_version <> p_expected_version then
    raise exception 'stale version' using errcode = '40001';
  end if;

  select t.requires_reason into v_requires_reason
  from public.application_transitions t where t.from_status = v_from and t.to_status = p_to;
  if not found then
    raise exception 'transition % -> % not allowed', v_from, p_to using errcode = '22023';
  end if;
  if v_requires_reason and char_length(coalesce(btrim(p_reason), '')) < 3 then
    raise exception 'reason required' using errcode = '22023';
  end if;

  update public.applications
  set status = p_to, version = version + 1, updated_at = now()
  where id = p_application_id;

  insert into public.application_events (application_id, actor_id, from_status, to_status, reason)
  values (p_application_id, auth.uid(), v_from, p_to, nullif(btrim(p_reason), ''));

  return v_version + 1;
end;
$$;

revoke all on function public.is_operator() from public, anon, authenticated;
revoke all on function public.submit_application(uuid, public.application_kind, text, text, text, text, text, text, text, text[], text, text) from public, anon, authenticated;
revoke all on function public.transition_application(uuid, public.application_status, integer, text) from public, anon, authenticated;
grant execute on function public.is_operator() to authenticated;
grant execute on function public.submit_application(uuid, public.application_kind, text, text, text, text, text, text, text, text[], text, text) to anon, authenticated;
grant execute on function public.transition_application(uuid, public.application_status, integer, text) to authenticated;
