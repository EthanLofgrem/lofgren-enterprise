-- Website: accounts for any member, not only producers and partners.
--
-- Additive only. Adds a 'member' value to application_kind so the public
-- "Create account" form can use the existing submit_application() path, with
-- its rate limit, idempotency, consent capture, and event trail unchanged.
--
-- For kind = 'member' rows, existing columns are used as follows:
--   summary   what the member brings (skills, talents, resources)
--   gaps      contribution category slugs the member selected (max 12),
--             e.g. 'visual-arts', 'capital' (see src/lib/content.ts)
--   capacity  time and resources the member can commit
--   goals     kinds of businesses and people the member is interested in
--   timeline  when the member could start
--
-- ALTER TYPE ... ADD VALUE must not be used in the same transaction that adds
-- it, so this migration contains nothing else.

alter type public.application_kind add value if not exists 'member';
