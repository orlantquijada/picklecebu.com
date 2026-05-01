# PickleCebu — Next-Phase PRD

## Context

Frontend is a polished UI shell with hardcoded data (`apps/web/src/lib/constants.ts`, `apps/web/src/lib/search.ts`). Backend (`apps/api`, Hono + SQLite + Drizzle) is a fully-implemented booking API with PayMongo PaymentIntent flow, JWT cookie auth, Resend email, webhook → status update — and is **never called by the web app**. `apiFetch` is defined in `apps/web/src/lib/api.ts` but invoked nowhere; TanStack Query is wired with zero queries; "Book Now" and "List Your Court" are inert; PayMongo + Resend creds are placeholders.

The product loop (find → book → pay → confirm) does not run end-to-end. Backend is closer to done than `STATUS.md` suggests; the missing pieces are wiring + a checkout/confirm page + a few schema gaps.

This PRD picks the shortest path to a real paid booking, then sequences the rest.

---

## Critical contract gaps surfaced during exploration

These shape every decision below — resolve in Phase 0.

| # | Gap | Frontend assumes | Backend has | Fix path |
|---|-----|------------------|-------------|----------|
| 1 | Venue vs Court | venue contains N courts (e.g. Volley Hub Banilad: 5 indoor courts) | flat `courts` table; 1 row = 1 bookable | **Treat 1 court = 1 venue for MVP.** No new `venues` table. |
| 2 | Photo gallery | multi-image gallery on detail page | single `coverImageUrl` | Add `gallery_image_urls` (JSON array) to `courts`. Fall back to cover. |
| 3 | Rich venue copy | rules, cancellation policy, operating hours, max guests | only `description`, `address`, `locationArea` | Add columns: `operating_hours`, `cancellation_policy`, `rules` (JSON). |
| 4 | Duration | 1h / 1.5h / 2h | `numHours` is `z.int().min(1).max(6)` — **1.5 not representable** | Drop 1.5h from frontend picker. |
| 5 | Route convention | `/venues/$slug` | PayMongo `returnUrl` uses `/courts/${slug}/confirm` (`apps/api/src/routes/bookings.ts:62`) | Align on `/venues/$slug`; patch backend `returnUrl`. |
| 6 | Pending-booking expiry | n/a | none — abandoned form leaves slot blocked indefinitely | Background sweep: cancel `pending` older than 15 min. |
| 7 | Search filters | client-side filter over fetched list (area/price/type/duration) | `GET /api/courts` returns all active courts, no params | Client-side filter is fine for MVP — no backend change. |

---

## Sequencing (rationale: cut to a real booking ASAP, defer everything not on the critical path)

### Phase 0 — Schema + contract reconciliation · 1 day
Land migrations and route alignment first; everything downstream depends on this.
- Drizzle migration: add `operating_hours`, `cancellation_policy`, `rules`, `gallery_image_urls` to `courts`.
- Update seed (`apps/api/src/db/seed.ts`) to populate the new columns from existing frontend `VENUE_DETAILS` data so dev parity holds.
- Patch `apps/api/src/routes/bookings.ts:62` `returnUrl` to `/venues/${slug}/confirm`.
- Drop 1.5h from `DURATIONS` in `apps/web/src/lib/constants.ts`.

### Phase 1 — Wire frontend to backend · 3–5 days · highest priority
This converts the shell into a real product. End of Phase 1 = a real booking goes through.

**1a. Court data plumbing**
- Add typed helpers in `apps/web/src/lib/api.ts`: `getCourts()`, `getCourt(slug)`, `getAvailability(slug, date)`.
- New `apps/web/src/lib/queries.ts` with `useCourtsQuery`, `useCourtQuery`, `useAvailabilityQuery`.
- Replace `FEATURED_VENUES` consumers in `_layout.index.tsx` (featured grid) and `_layout.search.tsx` (results).
- Replace `VENUE_DETAILS[slug]` in `_layout.venues.$slug.tsx`.
- Replace `generateSlots()` calls (`apps/web/src/lib/search.ts`) with availability query.
- Keep `AREAS`, `ADVANTAGES`, `STEPS`, `QUICK_PICKS`, `COURT_TYPES` hardcoded — copy, not data.
- Loading + empty + error states.

**1b. Booking checkout** *(only genuinely new route)*
- New full-page route `apps/web/src/routes/_layout.venues.$slug.book.tsx` (full page, not modal — better mobile Safari + shareable URL).
- New `apps/web/src/components/booking/CheckoutForm.tsx`.
- Form: name, email, phone (default `+63`), payment method (GCash / Maya — hide Card for MVP).
- Slot summary panel: court, date, start–end time, subtotal + ₱50 convenience fee + total (mirror `hourlyRate * numHours + 5000`).
- Submit → `POST /api/bookings` → `window.location.href = checkoutUrl`.
- Inline 409 ("slot just taken — pick another time"); toast on 500.
- Update venue-detail "Book now" CTA → `navigate({ to: '/venues/$slug/book', search: { date, start, duration } })`.

**1c. Confirmation page**
- New `apps/web/src/routes/_layout.venues.$slug.confirm.tsx`.
- Reads `?booking_id=` from query.
- Polls `GET /api/bookings/:id/status` every 2s, max 30s, via TanStack Query `refetchInterval`.
- States: `pending` (spinner + "Confirming — don't close this page"), `confirmed` (success card with ref, court, date, slot, total + "email sent to ..."), `failed` (retry CTA → venue), `cancelled`/404 (error fallback).
- Stretch: client-side `.ics` download.

### Phase 2 — Production credentials + deploy · 1–2 days
- Real PayMongo test keys → live keys (live needs business docs; **start application early**).
- Resend domain auth (SPF/DKIM); otherwise owner notification emails go to spam.
- Webhook URL configured in PayMongo dashboard pointing at deployed `/api/webhooks/paymongo`.
- Deploy targets TBD (Vercel for web, Railway/Fly for API + SQLite — or migrate DB).
- Smoke-test with a real low-amount booking.

### Phase 3 — Owner onboarding · 3–5 days · post-launch
**Recommend: lead-capture form, not self-service registration.** Real onboarding needs verification (does this court exist? who owns it?) that's hard to automate without trust signals.
- New `_layout.list-your-court.tsx`.
- Fields: court name, area, contact name, email, phone, # courts, message.
- Submit → email admin via Resend (thin `POST /api/leads` handler, or reuse Resend client).
- Replace dead "List Your Court" buttons (header + `for-court-owners.tsx`).
- Admin onboards via existing `/api/admin` endpoints.

If self-service is later required: refactor admin owner-create to public `POST /api/owners/register` + email verification + admin approval gate.

### Phase 4 — Owner dashboard UI · 1 week
Backend already implemented at `/api/dashboard`. Build:
- `_layout.dashboard.login.tsx` (existing JWT cookie flow at `/api/auth/login`).
- `_layout.dashboard.index.tsx` — bookings table (today / upcoming / past, status badges).
- `_layout.dashboard.availability.tsx` — block/unblock slots (`blocked_slots` table).
- `_layout.dashboard.settings.tsx` — `notifyOnBooking` toggle.
- Auth guard via `beforeLoad` calling `/api/auth/me` (or whatever the existing identity endpoint is).

### Phase 5 — Static pages + SEO · 2–3 days
About, FAQ, Contact, **Privacy, Terms**. Privacy + Terms are typically required by PayMongo for live-mode approval — write before go-live.

---

## Per-feature detail

### F1 — Real court data (Phase 1a)
**Problem**: Players see fake venues; backend has different IDs, so any booking would fail.
**Story**: As a player, I see real Cebu courts with live pricing and availability.
**Acceptance**:
- Featured grid pulls top N from `GET /api/courts`.
- Search lists every `isActive=1` court; filters apply client-side over fetched list.
- Venue detail uses `GET /api/courts/:slug` + `/availability?date=YYYY-MM-DD`.
- Loading skeletons match existing card shapes; empty state if 0 results.
- Disable booking button if all slots unavailable for selected date.

### F2 — Booking checkout (Phase 1b)
**Problem**: "Book Now" is inert — there is no checkout.
**Story**: After picking court/date/time, I enter contact info, choose GCash/Maya, get redirected to e-wallet, return to a confirmation page, receive email.
**Acceptance**:
- Validation matches backend Zod (`apps/api/src/routes/bookings.ts:18-27`): name 2–100, RFC email, phone 7–20, `numHours` int 1–6, `startHour` 7–19.
- Race-safe: 409 from backend rendered inline ("just taken — pick another").
- Pricing displayed exactly matches backend math.
- Submitting button disabled while in-flight; redirect happens on success.
- Mobile-first layout matching existing booking sidebar style.

### F3 — Confirmation + status polling (Phase 1c)
**Problem**: PayMongo redirects user back before webhook may have fired — UI must handle the lag.
**Story**: After paying, I see a clear "Booking confirmed" page with ref, court, date, slot, total.
**Acceptance**:
- Poll backoff: 2s × up to 15 attempts.
- All 4 status states handled.
- Booking reference (`bk_…`) visible.
- Success card shows "email sent to {playerEmail}".

### F4 — PayMongo go-live (Phase 2)
**Acceptance**:
- Test booking: `pending → confirmed` within ~30s of payment.
- Cancelled GCash flow: status → `failed`.
- Bad webhook signature → 401, no DB write, logged.

### F5 — Lead capture (Phase 3)
**Story**: Owner submits court name + contact; PickleCebu reaches out within 24h.
**Acceptance**: form persists or emails admin, "List Your Court" buttons live, confirmation message visible.

### F6 — Owner dashboard (Phase 4)
**Story**: Owner logs in, sees bookings, blocks unavailable slots, toggles notifications.

### F7 — Static pages (Phase 5)
**Acceptance**: every footer link reaches a real page; Privacy + Terms reviewed against PayMongo live-mode requirements.

---

## Risks

1. **Pending-booking lock**: form abandonment after `POST /api/bookings` leaves the slot blocked until manual intervention. **Backend gap not flagged in `STATUS.md`** — needs a sweep job (cron or on-read) before launch. ~1h of work.
2. **PayMongo live onboarding**: business docs review can take days. Start before code is ready, not after.
3. **Resend domain auth**: without SPF/DKIM the owner-notification emails land in spam — owners think the system is broken.
4. **GCash on desktop**: PayMongo falls back to QR; UX is rough. Test on real mobile before launch.
5. **Time zone**: SQLite `datetime('now')` is UTC; all user dates are Asia/Manila (+08:00). Verify `bookingDate` / `startHour` round-trips and that "Tonight" / "Tomorrow" quick-picks compute against PH local time.
6. **No rate limit on `POST /api/bookings`**: bad actor could DOS slots with many `pending` bookings (combines with risk #1). Acceptable pre-launch given small audience; add before any marketing push.
7. **Confirmation-page authorization**: anyone with a `booking_id` can read status. IDs are `bk_<timestamp>_<5char>` — not secret, but not enumerable in practice. The exposed fields (`status`, `bookingDate`, `startHour`, `endHour`, `playerName`, `courtId`, `totalAmount`) are minimal. Acceptable for MVP, revisit if PII expands.
8. **Mobile app (`apps/mobile`)**: exists but is out of scope for this phase. Risk = it diverges further from web. Recommend freezing it until web MVP ships.

---

## Open questions

1. **Venue model**: 1 court = 1 venue (recommended, fastest), or commit to `venues → courts` parent now (future-proof, ~3× the work)?
2. **Route convention**: align on `/venues/$slug` (recommended — frontend already uses it) or `/courts/$slug` (backend's current `returnUrl`)?
3. **Duration**: drop 1.5h (recommended, pickleball usually 1h blocks) or expand backend to fractional `numHours`?
4. **List Your Court**: lead-capture form (recommended) or self-service registration with admin approval gate?
5. **Pending-booking expiry job**: implement before launch, or accept the lock risk and ship?
6. **Photo gallery**: add `gallery_image_urls` JSON column (recommended), or render `coverImageUrl` repeatedly?
7. **Mobile app status**: freeze until after web MVP, or maintain in parallel?
8. **Hosting**: Vercel for web is obvious; SQLite for API forces a single-VM host (Railway/Fly) or a migration to Turso/Postgres. Decide before Phase 2.

---

## Critical files to modify

**Backend (Phase 0)**
- `apps/api/src/db/schema.ts` — add 4 columns to `courts`.
- `apps/api/src/db/seed.ts` — populate new columns.
- `apps/api/src/routes/courts.ts` — return new columns from `GET /api/courts/:slug`.
- `apps/api/src/routes/bookings.ts:62` — patch `returnUrl` to `/venues/`.

**Frontend (Phase 1)**
- `apps/web/src/lib/api.ts` — add `getCourts`, `getCourt`, `getAvailability`.
- `apps/web/src/lib/queries.ts` *(new)* — TanStack Query hooks.
- `apps/web/src/lib/search.ts` — replace `generateSlots` consumers.
- `apps/web/src/lib/constants.ts` — drop `FEATURED_VENUES`, `VENUE_DETAILS`, drop "1.5 hours" from `DURATIONS`.
- `apps/web/src/routes/_layout.index.tsx` — query for featured.
- `apps/web/src/routes/_layout.search.tsx` — query for list.
- `apps/web/src/routes/_layout.venues.$slug.tsx` — query for detail + availability; rewire CTA.
- `apps/web/src/routes/_layout.venues.$slug.book.tsx` *(new)* — checkout.
- `apps/web/src/routes/_layout.venues.$slug.confirm.tsx` *(new)* — confirmation polling.
- `apps/web/src/components/booking/CheckoutForm.tsx` *(new)*.

**Phase 3**
- `apps/web/src/routes/_layout.list-your-court.tsx` *(new)*.
- `apps/api/src/routes/leads.ts` *(new, optional — could just send via Resend from a web-side handler)*.

---

## Verification

End-to-end smoke (run after Phase 1 + Phase 2 done):

1. `bun run --filter '*' dev` from repo root.
2. Open `http://localhost:3000` — featured courts come from API. Kill API → see error/empty state, not stale hardcoded data.
3. Click a court → real availability for tomorrow renders.
4. Pick a slot → "Book now" → land on `/venues/$slug/book` with form.
5. Submit form with PayMongo test creds → redirected to PayMongo sandbox.
6. Complete test GCash flow.
7. Land on `/venues/$slug/confirm?booking_id=...` — status flips `pending → confirmed` within 30s.
8. Player + owner emails visible in Resend dashboard.
9. `bun run --filter '*' typecheck` clean.
10. Repeat with cancelled-payment path; status → `failed`.
