## Package Manager

This project uses **Bun**. Always use `bun` instead of other package managers.

## Project Status

This project is greenfield and in active development with no users. Expect frequent, significant changes across all apps. Do not treat any part of the codebase as stable or production-critical.

## Plan Mode

- Make plans extremely concise. Sacrifice grammar for brevity.
- End each plan with unresolved questions, if any.

## UI/Design Work

When implementing UI redesigns, present a brief visual description or mockup outline BEFORE writing code. Confirm the direction matches expectations before proceeding with implementation.

Before implementing, describe the proposed layout: component hierarchy, spacing values, and visual flow. I'll confirm before you write code.

## Code Quality

Always run type checking (`tsc --noEmit` or equivalent) after TypeScript changes before considering a task complete.

## Runtime Validation

Use Zod schemas for all API response types. Parse at the fetch boundary (in the `getCourts`/`getCourt`-style fetcher), not inside mappers. Mappers receive already-validated data and work with typed values only. Define schemas first, infer TypeScript types from them via `z.infer`.
