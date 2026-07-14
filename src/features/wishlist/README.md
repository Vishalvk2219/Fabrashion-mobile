# Feature: `wishlist`

Saved products. Local-only for now — the wishlist API is a pending backend delta (plan 13).

## Pieces
| File | Purpose |
|------|---------|
| `store.ts` | Zustand set of saved product ids, persisted in `lib/storage` (`wishlist.ids`). `toggle`, `clear`, and the `useIsWished(id)` selector. |

## Used by
- `components/product/WishButton` — the heart on product cards + the PDP.
- `app/(tabs)/(wishlist)/index.tsx` — the Wishlist tab (built out in the account phase; reads these ids).

## Backend status (⚠ pending)
No endpoints yet. When they land, sync `store.ids` with `GET/POST/DELETE /wishlist` and keep the local
set as an optimistic cache.
