# Feature: `cart`

The active cart with server-computed totals.

## Screens
- `app/(tabs)/(cart)/index.tsx` — cart contents + totals.

## Pieces
| File | Purpose |
|------|---------|
| `schema.ts` | `Cart`, `CartItem`, `AddCartItemInput` types. |
| `api.ts` | `fetchCart`, `addCartItem`, `updateCartItem`, `removeCartItem`. |
| `hooks.ts` | `useCart`, `useCartCount` (tab badge), `useAddToCart`, `useUpdateCartItem`, `useRemoveCartItem`. |

## Endpoints (backend Phase 4 — not live yet)
`GET /cart`, `POST /cart/items`, `PATCH /cart/items/:id`, `DELETE /cart/items/:id`.

## Notes
- **Server is authoritative on totals** — the app never sums money. Mutations return the full recomputed cart, written straight into the query cache.
