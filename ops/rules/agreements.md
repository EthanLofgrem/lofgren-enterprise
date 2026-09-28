# Agreement rules
Technical behavior only; this does not interpret contracts or give legal advice.
- States are distinct: draft, in_review, sent_for_signature, signed, executed, superseded, expired, terminated, voided. Do not merge signed and executed unless an approved workflow says so.
- `executed` requires verified e-signature provider evidence or a separately verified, audited human record. No browser action sets it.
- Executed versions are immutable. Amendments, renewals, and corrections are new versions linked to the prior one.
- Provider callbacks: verify authenticity, store the event ID with a unique constraint before acting, duplicates are no-ops, conflicting status goes to human review.
- Documents are venture-scoped: private storage, short-lived signed URLs, membership checked per download, downloads audited. No public or predictable paths.
- Retention and deletion decisions are recorded with actor, reason, and time.
- Tests: member allowed; other venture, anonymous, and outsider denied; client cannot set executed; duplicate callback harmless; executed version cannot be overwritten.
