# Feature: `catalog`

Product browsing — Home rails, categories, listing, search, product detail (ANDRÓ redesign, plan 13).

## Screens
- `app/(tabs)/(home)/index.tsx` — Home (hero, category rail, New Arrivals, Atelier banner, Trending, Recommended, Recently Viewed).
- `app/(tabs)/(categories)/index.tsx` — Categories grid.
- `app/(tabs)/(categories)/listing.tsx` — product listing + filter chips (keeps the bottom nav).
- `app/search.tsx` — search (root route, no nav): suggestions + live client-side filtering.
- `app/product/[id].tsx` — product detail (root route, no nav): gallery, colours/sizes, delivery/store, reviews summary, similar, action bar.

## Pieces
| File | Purpose |
|------|---------|
| `schema.ts` | `Product`, `ProductVariant`, `Category`, `Paginated<T>`, `ProductFilters` (mirror Prisma). |
| `model.ts` | **`CatalogItem`** display view-model + `toCatalogItem(Product)` mapper, `toneFor`, `offerPct`, `CategoryTile`. Screens render `CatalogItem`, not raw `Product`. |
| `preview.ts` | ⚠️ **Labelled sample catalog** (the ANDRÓ demo content). Renders only when the live API returns nothing; delete once the catalog backend + seed exist. |
| `api.ts` | `fetchProducts`, `fetchProduct`, `fetchCategories`. |
| `hooks.ts` | `useProducts`/`useProduct`/`useCategories` (raw) + **`useCatalog`**/**`useCatalogItem`**/**`useCategoryTiles`** (display items, live-or-preview via `isPreview`). |

## Endpoints (backend Phase 2 — not live yet)
`GET /products` (paginated/filter/sort/search), `GET /products/:id`, `GET /categories`.

## Notes
- Prices are integer **paise**; format via `lib/money.ts` (`formatPaiseCompact` on cards). Server owns all totals.
- Product imagery uses `expo-image` when a URL exists, else the warm `tone` placeholder from the design.
- **Preview mode:** with no backend, `useCatalog().isPreview` is true and the screens show the sample catalog so the design is fully reviewable — never fabricated data posing as a real API response.
- Wishlist hearts read the `wishlist` feature store.
