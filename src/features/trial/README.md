# Feature: `trial` (planned — backend Phase 6)

At-Home Trial: try items at home, keep some, return the rest, pay only for what's kept.

## Screens (planned)
- `app/(tabs)/(trials)/index.tsx` — my trials (list). *(placeholder in the shell)*
- `app/trial/book.tsx` — choose eligible items + slot + address.
- `app/trial/[id].tsx` — trial detail; mark each item keep/return.

## Endpoints (backend Phase 6)
`GET /trials/eligibility`, `POST /trials`, `GET /trials`, `GET /trials/:id`, `POST /trials/:id/outcome`, `POST /trials/:id/cancel`.

## Status
Not implemented yet — depends on backend Phases 3–4 then 6. See `plans/07-home-trial.md`. Booking holds stock and charges the trial value; kept items convert to an order, returns release the hold + refund.
