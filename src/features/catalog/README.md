# Feature: `catalog`

Product browsing — categories, product list/search, product detail.

## Screens
- `app/(tabs)/(home)/index.tsx` — catalog list (Home).
- `app/(tabs)/(search)/index.tsx` — search.
- `app/(tabs)/(home)/product/[id].tsx` — product detail.

## Pieces
| File | Purpose |
|------|---------|
| `schema.ts` | `Product`, `ProductVariant`, `Category`, `Paginated<T>`, `ProductFilters` types (mirror Prisma). |
| `api.ts` | `fetchProducts`, `fetchProduct`, `fetchCategories`. |
| `hooks.ts` | `useProducts`, `useProduct`, `useCategories` + `catalogKeys`. |

## Endpoints (backend Phase 2 — not live yet)
`GET /products` (paginated/filter/sort/search), `GET /products/:id`, `GET /categories`.

## Notes
- Prices are integer **paise**; format via `lib/money.ts`. Stock label comes from `variant.availableQty`.
- Until Phase 2 lists ship, screens render `Loader` / `EmptyState`.
