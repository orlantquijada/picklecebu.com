# PickleCebu MVP — Product Status

## What's Working (UI Only)

- **Homepage** — hero, booking search bar, featured venue cards, "Why PickleCebu", "How it Works", court owner CTA, footer
- **Search/results page** — venue list with available time slots, filters (area, duration, indoor/outdoor, price)
- **Venue detail page** — court info, amenities, availability slots, booking sidebar

All data is hardcoded. None of it talks to the backend yet.

---

## What's Built in the Backend (Not Yet Exposed to Users)

- Database with real tables: courts, bookings, blocked slots, court owners
- PayMongo integration (GCash + Maya) — code is production-ready, credentials are placeholders
- JWT-based auth for owners and admins
- Email confirmation flow (player + owner notifications via Resend)
- Full API: list courts, get availability, create booking, check booking status, payment webhook

None of this is wired to the frontend.

---

## What's Missing (Critical Path to MVP)

### 1. Booking Flow — Highest Priority
The "Book Now" button on the venue page does nothing. No checkout page, no player info form (name, email, phone), no payment redirect to GCash/Maya, no confirmation page.

### 2. Frontend → Backend Connection
Venues are hardcoded in the frontend. The DB and API exist but aren't being called. Real bookings can't be made until this is connected.

### 3. Real PayMongo Credentials
The integration code is ready. Just needs real test/live keys from PayMongo.

### 4. Court Owner Onboarding
"List Your Court" button does nothing. No form, no submission flow. Courts can only be added manually via a backend admin endpoint.

### 5. Owner Dashboard
Backend APIs exist for owners to manage availability and view bookings. No frontend UI at all.

### 6. Static Pages
About, FAQ, Contact, Privacy Policy, Terms — all footer links go nowhere.

---

## Summary

The shell looks complete. The homepage and search flow look polished and functional. But the core product loop — find a court → book it → pay — is not connected end to end. The backend is more ready than it appears; the gap is wiring it up and building the checkout flow.

**Rough priority order:**
1. Connect frontend to backend API (real court data)
2. Build booking checkout page + player info form
3. Wire up PayMongo with real credentials
4. Build owner onboarding form
5. Owner dashboard
6. Static pages (About, FAQ, etc.)
