# Feature: `orders`

Order history + detail, backed by the server (`fabrashion-backend/src/modules/checkout`). No local
store â€” the React Query cache holds orders.

## Screens
- `app/orders.tsx` â€” My Orders: tabs (Active / Delivered / Cancelled / Try at Home), server order
  cards, empty states. Status â†’ group map: PENDING/PAID/FULFILLING/SHIPPED â†’ Active,
  DELIVERED â†’ Delivered, CANCELLED/REFUNDED â†’ Cancelled.
- `app/order-tracking.tsx` â€” presentational map + delivery-partner card + status timeline; header
  shows the real order id (from the `id` param). Real live tracking is future work.

## Pieces
| File | Purpose |
|------|---------|
| `schema.ts` | `Order`, `OrderItem`, `OrderStatus`, `PaginatedOrders` â€” mirror the backend DTO. |
| `api.ts` | `fetchOrders`, `fetchOrder`, `cancelOrder`. |
| `hooks.ts` | `useOrders`, `useOrder`, `useCancelOrder`. |

## Notes
- Orders are created by checkout (`features/checkout`); `payment-success` navigates here with the
  order id. The profile "Orders" stat reads `useOrders().data.meta.total`.
- The "Try at Home" tab still reads the `trial` feature store (trials are a later phase).
- Money is paise; format via `lib/money`. Endpoints: `orders.*` in `api/endpoints.ts`.
