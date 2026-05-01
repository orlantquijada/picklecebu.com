# PickleCebu — Implemented Features

Status key: **Done** · **Partial** · **Backend only** · **UI only** · **Missing**

---

## 1. Homepage

| Section | Status | Notes |
|---|---|---|
| Hero + headline | Done | Static copy |
| Booking search bar | Done | See §5 for filter detail |
| Trust badges (No signup, Instant, GCash & Maya, Cebu only) | Done | Static |
| Quick pick chips (Tonight, Tomorrow, Weekend, Indoor, Under ₱400) | Done | Wired to search filters |
| Browse by area | Partial | Shows areas + court counts; clicking does nothing |
| Featured venues | UI only | Hardcoded mock data, not from DB |
| Why PickleCebu section | Done | Static copy |
| How it works section | Done | Static copy |
| Court owner CTA | UI only | "List Your Court" button has no destination |
| Footer links (About, FAQ, Contact, Privacy, Terms) | Missing | All point to `#` |

**MVP improvements:** Wire "Browse by area" chips to search with pre-filled area filter. Connect featured venues to the real DB.

---

## 2. Search / Results Page

| Feature | Status | Notes |
|---|---|---|
| Venue list with cards | Done | Shows name, area, type, courts, price, amenities |
| Time slot chips per venue | Done | Shows first 5 available slots per card |
| "View details" link per card | Done | Routes to `/venues/:slug` |
| Filter: Court type | Done | Any / Indoor / Outdoor / Covered |
| Filter: Duration | Done | 1h / 1.5h / 2h (updates total price shown) |
| Filter: Max price | Done | 5 price tiers via popover |
| Filter: Amenities | Done | 4 checkboxes via popover |
| Filter: Where (area) | Done | 12 areas + All Cebu |
| Filter: Time | Done | Any time / 6am–7pm hourly |
| Filter: Date | Partial | Label shows but no real date picker — only quick picks set dates |
| Sort (best match, lowest price, earliest) | Done | Client-side sort, works correctly |
| Share button | Done | Copies current URL |
| Result count label | Done | "6 venues available today" |
| Filters active badge | Done | Shows count of active filters on Filters button |
| Real availability from backend | Missing | Availability is deterministically generated client-side, not fetched from API |

**MVP improvements:** Add a proper date picker (currently blocked without one). Wire availability to the real backend API so slot data reflects actual bookings.

---

## 3. Venue Detail Page

| Feature | Status | Notes |
|---|---|---|
| Breadcrumb + venue header | Done | Name, area, court count, price/hr |
| Share button | Done | Copies URL to clipboard |
| Photo gallery | UI only | Component exists but no images |
| About / description | UI only | Hardcoded text per venue in constants |
| Courts list | UI only | Hardcoded per venue |
| Amenities | UI only | Hardcoded per venue |
| Location / address | UI only | Hardcoded per venue |
| House rules / cancellation policy | UI only | Hardcoded per venue |
| Booking sidebar | Partial | Shows selected date/time, price, "Book now" button — button does nothing |
| Availability time grid | Missing | No calendar or slot grid on this page |
| Mobile sticky booking bar | Partial | Shows price and "Check availability" — button does nothing |

**MVP improvements:** The booking sidebar is the most critical page on the site and nothing works. Minimum: add a date picker + available slots, connect "Book now" to the booking flow.

---

## 4. Booking Flow

| Step | Status | Notes |
|---|---|---|
| Select date + time | Partial | Carried in URL params from search, no picker on venue page |
| Player info form (name, email, phone) | Missing | No UI anywhere |
| Payment method selection (GCash / Maya / Card) | Missing | No UI anywhere |
| Create booking + payment intent | Backend only | POST `/api/bookings` — fully implemented |
| Redirect to PayMongo checkout | Missing | Backend returns checkout URL, frontend never uses it |
| Return from payment / confirmation page | Missing | No page exists |
| Booking status polling | Backend only | GET `/api/bookings/:id/status` exists, never called |
| Webhook → confirm booking in DB | Done | Fully functional |
| Confirmation email to player | Done | Sent on payment success via Resend |
| Notification email to owner | Done | Sent on booking if owner opted in |

**MVP improvements:** This is the core product loop and it's entirely missing on the frontend. Minimum viable path: modal with player info form → payment method choice → redirect to PayMongo → simple confirmation page on return.

---

## 5. Search Bar Filters (Detail)

All filters update the URL and trigger a client-side re-filter. The backend has a real availability API but the frontend doesn't call it.

| Filter | Works | Missing |
|---|---|---|
| Court type | Yes | — |
| Duration | Yes | — |
| Max price | Yes | — |
| Amenities | Yes | — |
| Where (area) | Yes | — |
| Time | Yes | — |
| Date | No real picker | Date picker — only quick picks (Tonight / Tomorrow / Weekend) write to the date param |

**MVP improvement:** A real date picker is the most obvious gap in the search bar. Without it, users can't book for a specific day beyond "today" and "tomorrow."

---

## 6. Backend API

All routes are implemented and functional. The frontend doesn't call most of them.

| Route group | Status | Frontend wired? |
|---|---|---|
| `GET /api/courts` — list courts | Done | No |
| `GET /api/courts/:slug` — venue detail | Done | No |
| `GET /api/courts/:slug/availability` — time slots for a date | Done | No |
| `POST /api/bookings` — create booking + payment intent | Done | No |
| `GET /api/bookings/:id/status` — check booking status | Done | No |
| `POST /api/webhooks/paymongo` — payment confirmation | Done | N/A (external) |
| `POST /api/auth/login` | Done | No |
| `GET /api/auth/me` | Done | No |
| `POST /api/auth/logout` | Done | No |
| `GET /api/dashboard/courts` — owner's courts | Done | No UI |
| `GET /api/dashboard/courts/:id/bookings` — owner's bookings | Done | No UI |
| `GET /api/dashboard/bookings/summary` — revenue summary | Done | No UI |
| `POST /api/dashboard/courts/:id/block` — block a slot | Done | No UI |
| `DELETE /api/dashboard/courts/:id/block` — unblock a slot | Done | No UI |
| `PATCH /api/dashboard/courts/:id/settings` — update rate | Done | No UI |
| `POST /api/admin/courts` — create owner + court | Done | No UI |
| `GET /api/admin/bookings` — all bookings | Done | No UI |
| `PATCH /api/admin/bookings/:id/cancel` — cancel booking | Done | No UI |

---

## 7. Payment Integration (PayMongo)

| Feature | Status |
|---|---|
| Create payment intent | Done |
| Create payment method (GCash / Maya / Card) | Done |
| Attach method to intent → returns checkout URL | Done |
| Webhook signature verification | Done |
| Handle `payment.paid` → confirm booking | Done |
| Handle `payment.failed` → mark failed | Done |
| Real PayMongo credentials | Missing — placeholders in `.env` |
| Refund logic | Missing |

**MVP note:** Swap placeholder keys for real PayMongo test credentials and the payment flow works end-to-end once the frontend is wired up.

---

## 8. Authentication

| Feature | Status |
|---|---|
| Court owner login (email + password) | Backend only |
| Admin login | Backend only |
| JWT with httpOnly cookies | Backend only |
| Role-based route guards (owner / admin) | Backend only |
| Frontend login page | Missing |
| Frontend session management | Missing |
| Password reset flow | Missing |

---

## 9. Email Notifications

| Email | Status |
|---|---|
| Booking confirmation to player | Done |
| New booking notification to owner | Done (if opted in) |
| Cancellation email | Missing |
| Owner onboarding / welcome email | Missing |
| Booking reminders | Missing (not MVP) |

---

## 10. Court Owner Onboarding & Dashboard

| Feature | Status |
|---|---|
| Backend: create court + owner (admin API) | Done |
| Backend: owner login | Done |
| Backend: view own bookings | Done |
| Backend: view revenue summary | Done |
| Backend: block/unblock slots | Done |
| Backend: update hourly rate | Done |
| Frontend: owner signup / onboarding form | Missing |
| Frontend: owner login page | Missing |
| Frontend: owner dashboard (bookings, availability) | Missing |

**MVP note:** For a first launch, a minimal owner dashboard (view upcoming bookings, block slots) is sufficient. Self-service signup can come after — initial courts can be manually onboarded via the admin API.

---

## 11. Data

All venue data visible to users is hardcoded in the frontend. The database exists and is structured correctly, but the frontend doesn't fetch from it.

| Data | Source | Should be |
|---|---|---|
| Venue list | Hardcoded constants | DB |
| Venue details (description, courts, amenities, rules) | Hardcoded constants | DB |
| Time slot availability | Deterministically generated (fake) | Real DB availability API |
| Pricing | Hardcoded constants | DB |
| Booking data | Not shown anywhere | DB |

---

## Summary

The frontend looks polished but operates entirely on fake data with no real actions. The backend is more complete than it appears — the full booking and payment stack is implemented and just needs to be connected. The single most important thing missing is the booking flow frontend: a player info form, payment method selection, and a confirmation page. Everything else unblocks from there.
