# Vercel preview rules
- Previews use Lofgren test Supabase and Stripe test keys only; Production variables stay empty until launch gates.
- Deployment Protection on; verify an unauthenticated request is refused.
- Record deployment ID, URL, and commit SHA (from `/api/health`) in evidence.
- No `vercel --prod`, no domain/DNS changes without owner approval.
