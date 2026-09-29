# Stripe webhook rules
- Test mode only. Lofgren's own Stripe account only; never the Lofora account.
- Read raw body, verify `stripe-signature`, check livemode and account match the environment.
- Store event ID with a unique constraint; a duplicate is a 2xx no-op.
- State changes and ledger writes in one transaction. Redirects are never proof of payment.
- Tests: valid, invalid signature, duplicate, out-of-order, processing failure retries, refund, dispute.
