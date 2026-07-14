# feature: staff (Store Ops)

The **staff shell** â€” the app experience for accounts whose role is `STAFF`. Routing lives in
`src/app/(staff)/` (a 4-tab shell: Dashboard Â· Inventory Â· Orders Â· Profile); this feature holds the
wire types, API calls, hooks, and the offline sync queue. Plans: `../../../plans/14-staff-shell.md`
(UI) + `../../../plans/18-back-office-apis.md` (live data). **Server-backed** since plan 18 â€” the
design fixtures are gone.

## Files
- `schema.ts` â€” wire types mirroring `fabrashion-backend/src/modules/staff` (summary, inventory
  rows with `floor`/`counter`/`reserved` buckets, fulfilment orders, trial bookings, queued
  adjustments).
- `api.ts` â€” `GET /staff/summary` Â· `GET /staff/inventory` Â· `PATCH /staff/inventory/:variantId`
  Â· `GET /staff/orders` Â· `POST /staff/orders/:id/advance` Â· `GET /staff/trials` Â·
  `POST /staff/trials/:id/advance`.
- `hooks.ts` â€” React Query: `useStaffSummary`, `useStaffInventory`, `useStaffOrders`,
  `useAdvanceOrder`, and **`useStaffInventoryView`** (server rows + the queue overlay; rows with
  pending local deltas render `synced: false`).
- `store.ts` â€” zustand: UI selections (filter, active variant, order stage) + the **offline queue**
  (persisted via `lib/storage`) with `enqueueAdjust` / `flush`.
- `model.ts` â€” derivations + display maps: `deriveStatus` (status is computed from buckets, never
  stored), `STATUS_PILL`, `STAGE_META` (wire stages â†’ labels/pills/actions), `orderItemsLine`.

## The offline queue (real, not a preview)
Every stock edit becomes `{ variantId, deltas, eventId }` in a persisted queue, applied to the UI
optimistically and flushed to the server immediately. If the network is down the ops wait
(amber banner, `online: false`); "Sync Now" (or reopening the shell) retries. The server applies
each `eventId` **at most once** (sync-log unique constraint), so retrying after a lost response is
safe. If the server rejects an op (409 â€” the local view was stale), the op is dropped and the board
refetches truth. Stages: To Pack=PAID â†’ Ready=FULFILLING â†’ Handed Over=SHIPPED/DELIVERED;
**Try-at-Home is live since plan 19** â€” the stage lists the boutique's trial bookings with the
logistics action per status (Confirm â†’ Dispatch â†’ Mark Delivered; confirming is blocked until the
trial charge is captured), driven by `useStaffTrials` / `useAdvanceTrial` (`TRIAL_OPS_META` in
`model.ts`).

## Remaining previews
Staff **Add Item** is presentational (product creation is the admin's `POST /admin/products`;
store-level "receive stock of a new SKU" is a follow-up). Profile menu rows
(shifts/notifications/help) are non-navigating until those screens exist.
