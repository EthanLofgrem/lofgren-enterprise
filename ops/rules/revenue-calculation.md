# Revenue calculation rules
Technical behavior only; this does not decide contractual rights, tax, or accounting treatment.
- Results are proposals until an authorized reviewer approves them. Approval never moves money; there are no automatic payouts.
- Money is integer minor units plus ISO currency. No floating point for amounts. Percentages use exact decimals with a named, tested rounding rule.
- Every run references venture, period boundaries (with timezone), source import IDs or row set, agreement/rule version, currency, rounding rule, and code version (commit SHA).
- Refunds, chargebacks, discounts, and adjustments are explicit linked entries. Tax and shipping are included or excluded only as the agreement states.
- A term the approved agreement does not define is `unresolved` and blocks the run. Never invent a default percentage.
- Currency conversion only with a recorded rate source; otherwise mismatches go to the discrepancy queue.
- Never overwrite a completed run; corrections supersede it with a reason. Issued statements are kept.
- Where configured, the preparer cannot approve their own run.
- Tests: reproducible from stored inputs; refunds, zero and negative values, period edges, rounding, currency mismatch, duplicate import; other ventures cannot read; clients cannot approve.
