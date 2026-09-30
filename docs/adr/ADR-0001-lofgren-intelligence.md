# ADR-0001: Lofgren Intelligence as the research and verification engine

- **Status:** Proposed
- **Date:** 2026-09-30
- **Owner:** Ethan Lofgren

## Context

Lofgren Enterprise builds ventures through seven stages: Qualify, Discover, Diligence, Blueprint, Assemble, Pilot, Operate. `PLATFORM-OPERATIONS.md` requires that Blueprints "show assumptions, source, units, and sensitivity" and that partner matching stays advisory until Ethan approves it. Those stages need evidence, not assertions.

Lofgren Intelligence is a separate Lofgren Enterprise project: an open-source (Apache-2.0) Python engine that compiles an objective into an Outcome Contract, gathers evidence from documents, web pages, open satellite data and authorized sensors, cross-checks it across independent sources, records contradictions, and reports calibrated confidence. Its `venture` mode answers each of the seven Lofgren stages directly.

## Decision

1. Lofgren Intelligence lives in its **own repository** (`lofgren-intelligence`), not in this one. This repository keeps its Next.js / Supabase / Stripe scope from `BUILD-BRIEF.md`.
2. The platform will consume it later through its **MCP server or a service API**, as an adapter behind an interface, the same way email and e-signature are kept behind adapters.
3. Intelligence output is **advisory evidence**. It may populate a Blueprint's assumptions and sources; it never approves an introduction, sets terms, or marks anything verified in this platform's records without an operator approval event.
4. **No customer or partner PII** is sent to the intelligence engine without recorded consent and purpose.
5. Lofgren Intelligence's own subscription pricing applies to that product only. It does **not** add subscriptions or entitlement gating to this platform (see `CLAUDE-CODE-PRO-MASTER-BUILD-PACK.md` §5).

## Consequences

- A future task packet (after LE-004) can add an "Evidence" panel to the Blueprint view, fed by an intelligence adapter, with tests showing that evidence alone cannot change a deal's status.
- The two codebases version and release independently.

## Integration gate

Enable only when: the intelligence service has a stable API version, a data-processing note covers what is sent, and a Blueprint journey passes with synthetic data on an exact commit SHA.
