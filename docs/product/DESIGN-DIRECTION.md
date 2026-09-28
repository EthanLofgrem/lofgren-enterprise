# Design direction

Status: reference for Gate 3. Tokens are defined in `docs/product/CLAUDE-MISSION.md` section 6 and must meet 4.5:1 text contrast; the contrast check is part of the tokens PR.

## Intent

A careful venture-building firm with a modern operating platform. Impression comes from clarity, craft, and real depth, not effects or claims. A producer should feel respected, a partner should see an organized process, and an adviser should see discipline.

| | Public site | Operator console |
|---|---|---|
| Feel | Editorial, grounded, spacious | Calm, dense, evidence-first |
| Goal | Understand the process, check fit, apply | Decide, assign, record |
| Primary actions | Apply as producer / partner | Review, request evidence, decide |
| Layout | Stories, process, forms | Sidebar, work surface, sticky decision context |
| Mobile | First-class | Usable for review; desktop-first for dense work |

## Brand

Confident not arrogant, premium not flashy, ambitious not speculative, clear not vague.

- Type: an editorial serif for headings, a legible sans-serif for body and UI, tabular numerals for data. Body 16-18px.
- Color: use the section 6 tokens. Copper is emphasis; status colors mean status only and always carry a text label. Lighter copper and amber are for large decorative accents only.

## Public site patterns

- **Home hero:** headline, one-line explanation, two actions (Apply as a producer, Become a partner), and a diagram of how a venture is assembled (asset → blueprint → brand, production, sales → pilot → operating venture). The diagram may draw in on scroll; with reduced motion it renders complete and static.
- **Seven stages:** horizontal timeline on desktop, vertical on phone, using the mission file's stage names, with exits shown at each stage so the process never reads as a guaranteed path to launch.
- **Pathway examples:** only if labeled "Illustrative"; no invented results, testimonials, logos, or venture photos.
- **Forms:** short steps (about you, the asset or capability, current reality, goals and constraints, acknowledgment), a progress indicator, inline accessible errors, no uploads. The finish page shows a reference, what happens next, and a truthful response window.

## Console patterns

- Dark sidebar, light work surface, sticky right panel with status, owner, next action, blockers, and approval requirement.
- Tables for queues; cards only for summaries; timelines for events.
- Per-dimension status (demand, delivery, reporting, risk), never a single health score.
- No sample numbers: anything without real data shows `Unavailable`.

## Interaction rules

- Every interactive element has default, hover, visible focus, disabled, loading, success, validation error, server error, empty, no-access, and unavailable states as they apply.
- Motion is small and purposeful; respect `prefers-reduced-motion`; never animate financial numbers.
- Keyboard reachable, semantic landmarks and headings, no hover-only content, no layout shift.

## Build sequence

Build components only when a PR needs them. Gate 3 order: tokens and layout basics → navigation and home → criteria, fit check, multi-step form → How It Works timeline. Console styling follows the Gate 2 and Gate 4 features that need it. Each PR includes desktop and phone screenshots, a keyboard check, a contrast check, and its loading, empty, and error states.
