# Feature: `orders` (planned — backend Phase 4)

Order history and detail/tracking.

## Screens (planned)
- `app/orders/[id].tsx` — order detail + status timeline.
- Order list surfaced from the Account tab.

## Endpoints (backend Phase 4)
`GET /orders` (paginated), `GET /orders/:id`, `POST /orders/:id/cancel`.

## Status
Not implemented yet — lands with backend Phase 4. Statuses: `PENDING → PAID → FULFILLING → SHIPPED → DELIVERED` (or `CANCELLED`/`REFUNDED`).
