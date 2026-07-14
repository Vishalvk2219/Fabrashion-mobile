# Feature: `checkout` (planned — backend Phase 4)

Turns the cart into a paid order via PhonePe.

## Flow (per `plans/00-system-design.md` §4.1)
1. `POST /checkout { addressId }` → creates a `PENDING` order, **reserves stock**, returns a payment intent. Idempotent.
2. Launch the PhonePe SDK checkout sheet (native module — needs a **dev build**, not Expo Go).
3. App polls `GET /payments/:orderId/status`; the backend also reconciles via the S2S webhook. Both converge on `markOrderPaid`.
4. Success → `checkout/success`; failure/timeout → reservation released.

## Status
Not implemented yet — needs backend Phase 4 endpoints and the PhonePe RN SDK + EAS dev build. Screens (`app/checkout/*`) land with that phase.
