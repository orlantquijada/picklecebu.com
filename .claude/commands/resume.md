Continue PickleCebu MVP work. Read in order:

1. `PRD.md` — the spec (context, sequencing, decisions, open questions).
2. `PROGRESS.md` — live state, checklist, session log.

Then complete the next unchecked **section** in `PROGRESS.md` (e.g. all of Phase 0, then stop; next invocation does Phase 1a, etc.):

- For each item: do the work, then verify. `bun run --filter '*' typecheck` must pass.
- For UI work: run both dev servers and walk the affected flow in a browser. If you can't verify a step end-to-end, say so explicitly — don't claim success.
- Tick each box in `PROGRESS.md` as you finish it.
- After the section is complete, append one line to the Session log:
  `YYYY-MM-DD — <section> — <one-sentence summary> — <any new follow-up>`.
- Stop. Don't continue to the next section without explicit go-ahead.

Working agreements (don't violate):

- Bun workspace. Use `bun`, never npm/pnpm.
- Drizzle migrations for schema changes; never hand-edit SQL.
- TanStack Query for data fetching; don't introduce a new state lib.
- Out of scope: `apps/mobile`, owner dashboard, lead-capture form, static pages.

If `PROGRESS.md` is missing or every section is checked, stop and report — don't bootstrap or extend silently.
