-- LE-003 owner console: private operator notes, plus fixes for the Supabase
-- performance advisor on the LE-002 schema (applied migrations are not edited).

-- Operator notes ---------------------------------------------------------------
-- Append-only: a correction is a new note, never an edit.
create table public.application_notes (
  id bigint generated always as identity primary key,
  application_id uuid not null references public.applications (id) on delete cascade,
  author_id uuid not null references auth.users (id),
  body text not null check (char_length(btrim(body)) between 1 and 4000),
  created_at timestamptz not null default now()
);
create index application_notes_app on public.application_notes (application_id, created_at);
create index application_notes_author on public.application_notes (author_id);

alter table public.application_notes enable row level security;
revoke all on public.application_notes from anon, authenticated;
grant select, insert on public.application_notes to authenticated;
grant usage on sequence public.application_notes_id_seq to authenticated;

create policy application_notes_select_operator on public.application_notes
  for select to authenticated using ((select public.is_operator()));

-- An operator can only write notes as themselves; applicants never see notes.
create policy application_notes_insert_operator on public.application_notes
  for insert to authenticated
  with check ((select public.is_operator()) and author_id = (select auth.uid()));

-- Advisor: index foreign keys used in joins and cascades ------------------------
create index applications_applicant_user on public.applications (applicant_user_id);
create index application_events_actor on public.application_events (actor_id);
create index operator_grants_granted_by on public.operator_grants (granted_by);

-- Advisor: evaluate auth.uid() and is_operator() once per query, not per row --
drop policy operator_grants_select_own on public.operator_grants;
create policy operator_grants_select_own on public.operator_grants
  for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_operator()));

drop policy applications_select on public.applications;
create policy applications_select on public.applications
  for select to authenticated
  using (applicant_user_id = (select auth.uid()) or (select public.is_operator()));

drop policy application_events_select_operator on public.application_events;
create policy application_events_select_operator on public.application_events
  for select to authenticated using ((select public.is_operator()));

-- is_operator() stays callable by authenticated users on purpose: it answers
-- only "is the caller an active operator?" and the console uses it to decide
-- whether to show anything. It reveals nothing about other users.
