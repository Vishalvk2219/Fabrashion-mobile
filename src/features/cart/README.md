# Feature: `cart`

The **server cart** â€” auth-required, server-authoritative on totals and stock. The React Query cache
**is** the cart; there is no local store. Backend: `fabrashion-backend/src/modules/cart`.

## Pieces
| File | Purpose |
|------|---------|
| `schema.ts` | `Cart { id, lines, totals }`, `CartLine`, `CartTotals` â€” mirror the backend DTO. |
| `api.ts` | `fetchCart`, `addCartItem`, `updateCartItem`, `removeCartItem` (each returns the whole cart). |
| `hooks.ts` | `useCart`, `useCartCount` (badge), `useAddToCart`, `useUpdateCartItem`, `useRemoveCartItem`. Mutations write the returned cart back into the cache. |

## Flow
- **PDP** (`app/product/[id]`) resolves the selected size+colour to a `variantId` (from
  `CatalogItem.variants`) and calls `useAddToCart` â€” disabled for preview items / out of stock.
- **Cart screen** (`app/(tabs)/(cart)`) renders server `lines` + server `totals`; qty steppers hit
  `useUpdateCartItem` (0 removes), delete hits `useRemoveCartItem`.
- **Wishlist** "Move to Bag" resolves a variant and adds.

## Notes
Prices are integer **paise**, formatted via `lib/money`. Totals (GST broken out, flat/free shipping)
are computed by the server â€” never client-side. `availableQty` on each line caps the qty stepper.
Endpoints in `api/endpoints.ts` (`cart.*`). `GET /cart`, `POST /cart/items`, `PATCH`/`DELETE /cart/items/:id`.
