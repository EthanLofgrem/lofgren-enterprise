# RLS rules
- RLS enabled on every table in an exposed schema; separate SELECT/INSERT/UPDATE/DELETE policies.
- UPDATE policies need both USING and WITH CHECK.
- Authorization comes from membership tables, never user-editable JWT metadata or email domain.
- SECURITY DEFINER helpers: `set search_path = ''`, schema-qualified names, narrow purpose.
- No `using (true)` on tenant data. Billing/ledger writes are server-only.
- Tests per table: owner allow, anonymous deny, wrong-user deny, cross-tenant deny, client-write deny.
