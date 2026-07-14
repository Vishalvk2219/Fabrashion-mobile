# Feature: `checkout`

Turns the server cart into an order. Backend: `fabrashion-backend/src/modules/checkout`.

## Pieces
| File | Purpose |
|------|---------|
| `api.ts` | `placeOrder(addressId)` â†’ `POST /checkout`; `confirmOrderDev(id)` â†’ `POST /orders/:id/confirm-dev`. |
| `hooks.ts` | `useCheckout` (invalidates cart + orders on success), `useConfirmOrderDev`. |

## Flow (`app/checkout.tsx`)
1. Pick the default saved address (`features/address` â†’ `useDefaultAddress`; "Change" â†’ `/addresses`).
2. `useCheckout(address.id)` â†’ the server reserves stock, creates a **PENDING** order, converts the cart.
3. **DEV:** `useConfirmOrderDev(order.id)` stands in for the PhonePe capture â†’ **PAID**. Then
   `payment-success?orderId=â€¦`.
4. **Prod (phase 4c):** step 3 becomes the PhonePe SDK sheet + the server's verified capture webhook â€”
   both hit the same idempotent `markOrderPaid`. Needs merchant creds + an EAS dev build (not Expo Go).

## Notes
Totals shown are the server cart totals (`features/cart` â†’ `useCart`); the client never sums money.
Payment-method chips are presentational until 4c. Endpoints: `checkout`, `orders.confirmDev`.
