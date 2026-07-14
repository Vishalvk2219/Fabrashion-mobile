# feature: admin

The **admin shell** â€” the app experience for accounts whose role is `ADMIN`. Routing lives in
`src/app/(admin)/` (a 4-tab shell: Overview Â· Catalog Â· Staff Â· Orders). **Server-backed** since
plan 18 (`../../../plans/18-back-office-apis.md`) â€” the design fixtures are gone.

## Files
- `schema.ts` â€” wire types mirroring `fabrashion-backend/src/modules/admin` (overview KPIs with
  basis-point deltas, staff members, catalog rows, orders, create inputs).
- `api.ts` â€” `GET /admin/overview | /admin/staff | /admin/catalog | /admin/orders`,
  `POST /admin/staff`, `POST /admin/products`.
- `hooks.ts` â€” React Query: `useAdminOverview`, `useAdminStaff` + `useCreateStaff`,
  `useAdminCatalog` + `useCreateProduct` (also invalidates the public product cache â€” new
  products are live in the shop immediately), `useAdminOrders` (server-side status filter).
- `model.ts` â€” display maps: staff status (Active/Invited) and order status pills/labels,
  `catalogStatus` derivation, role labels, `initials`.
- `store.ts` â€” zustand: list tab filters only (forms keep local state).

## Live behaviour
- **Overview**: KPIs/7-day revenue/channel split are computed server-side from real orders
  (paise + bps; formatted via `lib/money.ts` â€” `formatPaiseLakhs`, `formatBps`). Physical-store
  rows honestly show 0 until POS sale ingestion lands.
- **Add Staff persists**: creates the account (status *Invited*); the person signs in with the
  same phone-OTP flow, lands in their shell (role from account), and flips to *Active*.
  Permission toggles are stored server-side but not yet enforced (role-based auth for now).
- **New Product persists**: category/department/price/sizes/colour â†’ variants; goes live in the
  customer catalogue immediately, stocked at the warehouse. Duplicate phones and invalid input
  surface inline from the server error envelope.

## Role model (important)
The **role is stored on the account and set by the admin** in Add Staff â€” it is never chosen at
login. A created phone signs in through the same OTP flow and the backend returns its role;
`src/app/_layout.tsx` branches on it.
