# Owner access to the console

The console at `/console` is for Lofgren Enterprise operators only. Access needs two things: a Supabase Auth account (created by the owner; public signup is off) and an active row in `operator_grants`. Exactly one active owner is allowed by the database. The SQL for every step is in `supabase/snippets/owner-access.sql`; run it yourself in the Supabase SQL editor. Never put real email addresses in the repository.

## One-time setup (owner does this)

1. **Supabase Auth settings** (dev project, Authentication):
   - Sign-ups stay **disabled**.
   - URL Configuration → Redirect URLs: add `https://*-ethans-projects-a7eaa281.vercel.app/console/auth/callback` (previews) and `http://localhost:3000/console/auth/callback` (local). Add the production domain's callback only at launch.
2. **Vercel Preview variables:** `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (publishable, not the secret key). The console never uses the secret key.
3. **Create your account:** Supabase → Authentication → Users → Add user → Create new user, with your email and **Auto Confirm User** on. Set a long random password; you won't use it.
4. **Grant yourself owner:** run block 1 of the snippet with your email. It returns one row. Then check with block 4.
5. **Sign in:** open `/console/sign-in` on a preview, enter your email, and click the link in the email.

## Everyday

- **Email delivery:** Supabase's built-in email only delivers to addresses on your Supabase team, a few per hour. That covers your own sign-in. Before adding other operators, set up a custom SMTP provider (Authentication → Emails → SMTP Settings).
- **Add an operator:** create their account (step 3), then run block 2 with their email.
- **Remove access:** run block 3. Their next page load shows "no console access"; the grant stays in the table as a record.

## Recovery

- **Lost access to your email:** in Supabase → Authentication → Users, change the email on your account to one you control, then sign in with a new link. Your grant follows the account, not the address.
- **Owner grant revoked by mistake:** block 1 works again once no active owner exists.
- **Transferring ownership:** revoke the current owner (block 3 with that email), then run block 1 for the new owner. Only one active owner can exist at a time.

## What the console does today

Work queue (New, Aging, In review, Waiting on applicant, Closed), application detail with the full submission, status history, allowed status changes with reasons, and private notes. Every decision is recorded with who made it, when, the reason, and a version number; two people can't overwrite each other's change. Requesting more information records the request but does not email the applicant yet.
