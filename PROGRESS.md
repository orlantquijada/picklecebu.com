# PickleCebu MVP — Progress

Live state tracker for the scope in `PRD.md`. Each session: read this file, complete the next unchecked **section**, tick its boxes, append to the Session log, then stop.

## Decisions ratified (do not reopen)

- 1 court = 1 venue. No `venues` table.
- Routes align on `/venues/$slug`. Backend `returnUrl` patched to match.
- Drop 1.5h from frontend `DURATIONS`. Backend stays integer-hours.
- New `courts` columns: `gallery_image_urls` (JSON), `operating_hours`, `cancellation_policy`, `rules` (JSON).
- Pending-booking expiry sweep is a Phase 2 launch blocker; out of scope this run.

## Phase 0 — Schema + contract reconciliation

- [x] Drizzle migration: add `gallery_image_urls`, `operating_hours`, `cancellation_policy`, `rules` columns to `courts`. Apply locally and verify.
- [x] Update `apps/api/src/db/seed.ts` to populate new columns (mine the values from `apps/web/src/lib/constants.ts` `VENUE_DETAILS` so dev parity holds).
- [x] Update `apps/api/src/routes/courts.ts` `GET /:slug` (and `/` if useful) to return new columns.
- [x] Patch `apps/api/src/routes/bookings.ts:62` `returnUrl` to `/venues/${slug}/confirm`.
- [x] Drop `"1.5 hours"` from `DURATIONS` in `apps/web/src/lib/constants.ts`.

## Phase 1a — Court data plumbing

- [x] Add typed helpers to `apps/web/src/lib/api.ts`: `getCourts()`, `getCourt(slug)`, `getAvailability(slug, date)`.
- [x] New `apps/web/src/lib/queries.ts` with TanStack Query hooks: `useCourtsQuery`, `useCourtQuery`, `useAvailabilityQuery`.
- [x] Wire homepage `_layout.index.tsx`: replace `FEATURED_VENUES` with query result. Loading skeleton + empty state.
- [x] Wire search `_layout.search.tsx`: replace `FEATURED_VENUES` + `generateSlots`. Filters stay client-side.
- [x] Wire venue detail `_layout.venues.$slug.tsx`: replace `VENUE_DETAILS[slug]` + `generateSlots` with queries.
- [x] Remove now-unused `FEATURED_VENUES` and `VENUE_DETAILS` from `apps/web/src/lib/constants.ts`.

## Phase 1b — Booking checkout

- [ ] New `apps/web/src/components/booking/CheckoutForm.tsx`: name, email, phone (default `+63`), payment method (GCash, Maya).
- [ ] New full-page route `apps/web/src/routes/_layout.venues.$slug.book.tsx` reading `?date=&start=&duration=`.
- [ ] Slot summary panel with subtotal + ₱50 convenience fee + total (mirror backend math: `hourlyRate * numHours + 5000`).
- [ ] Submit handler: `POST /api/bookings`, render 409 inline, toast on 500, `window.location.href = checkoutUrl` on 200.
- [ ] Rewire venue-detail "Book now" CTA to navigate to `/venues/$slug/book` with the selected slot params.

## Phase 1c — Confirmation page

- [ ] New `apps/web/src/routes/_layout.venues.$slug.confirm.tsx`. Read `?booking_id=` from search params.
- [ ] Poll `GET /api/bookings/:id/status` via TanStack Query `refetchInterval: 2000`, capped at 15 attempts.
- [ ] Render the four states: `pending`, `confirmed`, `failed`, `cancelled` / 404. Match the existing booking-sidebar visual language.

## Phase 1 wrap

- [ ] `bun run --filter '*' typecheck` clean across both apps.
- [ ] End-to-end smoke per `PRD.md` § Verification, steps 1–7. If PayMongo creds are still placeholder, stop at the redirect URL and verify the `bookings` row was created with `status=pending`.

## Follow-ups (deferred — do not address this run)

- Pending-booking expiry sweep (~1h backend job; launch blocker for Phase 2).
- Rate limit on `POST /api/bookings`.
- Asia/Manila timezone audit on `bookingDate` / `startHour` round-trips.
- Resend domain auth (SPF/DKIM) before any real-email send.
- `apps/mobile` frozen until web MVP ships.

## Session log

_Append one line per session: `YYYY-MM-DD — <section> — <one-sentence summary> — <any new follow-up>`._

2026-05-01 — Phase 0 — Added 4 schema columns + migration, replaced seed with 6 VENUE_DETAILS courts, patched bookings returnUrl to /venues/, dropped 1.5h, fixed 2 pre-existing typecheck errors (auth.ts JWTPayload cast, search route validateSearch schema passthrough). — Old placeholder courts (sm-seaside, ayala-center) remain in DB with null new columns; harmless but could be cleaned up before launch.
2026-05-01 — Phase 1a — Wired frontend to real API: ApiCourt type + adapters in api.ts, queries.ts with 4 TanStack Query hooks, refactored searchVenues to pure function, replaced FEATURED_VENUES/VENUE_DETAILS with live data across homepage/search/venue-detail, updated migrate.ts to include new columns. — migrate.ts uses CREATE TABLE IF NOT EXISTS (no ALTER TABLE); dev reset requires dropping DB + re-running migrate+seed.
