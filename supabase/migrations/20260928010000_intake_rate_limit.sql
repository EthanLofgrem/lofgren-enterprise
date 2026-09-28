-- LE-002b: database-backed rate limit for intake, shared across serverless instances.
-- The server passes a salted hash of the client address; no raw IP is stored.

create table public.intake_attempts (
  id bigint generated always as identity primary key,
  client_key text not null check (char_length(client_key) between 16 and 128),
  created_at timestamptz not null default now()
);
create index intake_attempts_key_time on public.intake_attempts (client_key, created_at);

alter table public.intake_attempts enable row level security;
revoke all on public.intake_attempts from anon, authenticated;
-- No policies: only the security definer function below touches this table.

-- Returns true and records the attempt when under the limit; false otherwise.
create function public.record_intake_attempt(
  p_client_key text,
  p_limit integer default 5,
  p_window interval default interval '1 hour'
) returns boolean
language plpgsql security definer set search_path = ''
as $$
declare
  v_count integer;
begin
  if p_limit < 1 or p_limit > 100 or p_window > interval '1 day' then
    raise exception 'invalid limit' using errcode = '22023';
  end if;

  -- Serialize attempts per key so concurrent requests cannot both pass.
  perform pg_advisory_xact_lock(hashtext('intake:' || p_client_key));

  delete from public.intake_attempts where created_at < now() - interval '1 day';

  select count(*) into v_count from public.intake_attempts
  where client_key = p_client_key and created_at > now() - p_window;
  if v_count >= p_limit then
    return false;
  end if;

  insert into public.intake_attempts (client_key) values (p_client_key);
  return true;
end;
$$;

revoke all on function public.record_intake_attempt(text, integer, interval) from public, anon, authenticated;
grant execute on function public.record_intake_attempt(text, integer, interval) to service_role;
