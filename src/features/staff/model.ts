/**
 * Staff (Store Ops) domain model — derivations + display maps over the server data
 * (`schema.ts`). The server is authoritative on stock; status is always DERIVED from the
 * buckets, never stored (the design's `recalc`). Queued offline deltas overlay the server
 * rows in `hooks.ts`.
 */
import { colors } from '@/theme/colors';
import type { StaffInventoryRow, StaffStage, StaffTrial } from './schema';

type StaffTrialStatus = StaffTrial['status'];

export type InventoryStatus = 'In Stock' | 'Low Stock' | 'On Counter' | 'Out of Stock';

/** A server row with queued local deltas applied; `synced` = nothing pending for it. */
export type InventoryView = StaffInventoryRow & { synced: boolean };

type Buckets = Pick<StaffInventoryRow, 'floor' | 'counter' | 'reserved'>;

/** Status is derived from stock, never stored (mirrors the backend's low-stock count). */
export function deriveStatus(it: Buckets): InventoryStatus {
  const total = it.floor + it.counter + it.reserved;
  if (total === 0) return 'Out of Stock';
  if (it.counter > 0) return 'On Counter';
  if (total <= 2) return 'Low Stock';
  return 'In Stock';
}

export const totalUnits = (it: Buckets): number => it.floor + it.counter + it.reserved;

/** Soft-bg / saturated-fg pill pair per status. */
export const STATUS_PILL: Record<InventoryStatus, { bg: string; fg: string }> = {
  'In Stock': { bg: colors.okBg, fg: colors.okFg },
  'Low Stock': { bg: colors.warnBg, fg: colors.warnFg },
  'On Counter': { bg: colors.accentSoft, fg: colors.accent },
  'Out of Stock': { bg: colors.dangerBg, fg: colors.dangerFg },
};

export const INVENTORY_FILTERS: (InventoryStatus | 'All')[] = ['All', 'On Counter', 'Low Stock', 'Out of Stock'];

// ── Fulfilment ────────────────────────────────────────────────────────────────
/** Per-stage label + pill colours + the action that advances out of it. */
export const STAGE_META: Record<StaffStage, { label: string; bg: string; fg: string; action: string }> = {
  TO_PACK: { label: 'To Pack', bg: colors.accentSoft, fg: colors.accent, action: 'Packed' },
  TRY_AT_HOME: { label: 'Try-at-Home', bg: colors.okBg, fg: colors.okFg, action: 'Prepared' },
  READY: { label: 'Ready', bg: colors.infoBg, fg: colors.infoFg, action: 'Handed Over' },
  HANDED_OVER: { label: 'Handed Over', bg: colors.neutralBg, fg: colors.neutralFg, action: 'Complete' },
};

export const FULFIL_STAGES: StaffStage[] = ['TO_PACK', 'TRY_AT_HOME', 'READY', 'HANDED_OVER'];

/** "Silk Wrap Dress, +1 item" summary line from the wire fields. */
export function orderItemsLine(firstItemName: string, itemCount: number): string {
  if (!firstItemName) return `${itemCount} items`;
  return itemCount > 1 ? `${firstItemName}, +${itemCount - 1} item${itemCount > 2 ? 's' : ''}` : firstItemName;
}

/** Ops metadata per trial status: pill + the action that advances the logistics. */
export const TRIAL_OPS_META: Record<
  StaffTrialStatus,
  { label: string; bg: string; fg: string; action: string | null }
> = {
  REQUESTED: { label: 'Requested', bg: colors.accentSoft, fg: colors.accent, action: 'Confirm' },
  CONFIRMED: { label: 'Confirmed', bg: colors.infoBg, fg: colors.infoFg, action: 'Dispatch' },
  OUT_FOR_TRIAL: { label: 'On its way', bg: colors.accentSoft, fg: colors.accent, action: 'Mark Delivered' },
  IN_TRIAL: { label: 'In trial', bg: colors.okBg, fg: colors.okFg, action: null },
  COMPLETED: { label: 'Completed', bg: colors.neutralBg, fg: colors.neutralFg, action: null },
  CANCELLED: { label: 'Cancelled', bg: colors.dangerBg, fg: colors.dangerFg, action: null },
};
