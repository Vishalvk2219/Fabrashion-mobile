/** Wire types for the staff (Store Ops) APIs â€” mirror `fabrashion-backend/src/modules/staff`. */
import type { Paginated } from '@/features/catalog/schema';

export type StaffStage = 'TO_PACK' | 'TRY_AT_HOME' | 'READY' | 'HANDED_OVER';

export type StaffStoreInfo = { id: string; name: string; code: string };

export type StaffSummary = {
  store: StaffStoreInfo;
  toPack: number;
  ready: number;
  tryAtHome: number;
  lowStock: number;
  updatedToday: number;
  packedToday: number;
};

/** One inventory row at the staff member's store. Buckets are server-authoritative. */
export type StaffInventoryRow = {
  variantId: string;
  sku: string;
  name: string;
  brand: string | null;
  size: string;
  colorName: string;
  colorHex: string | null;
  pricePaise: number;
  floor: number;
  counter: number;
  reserved: number;
  version: number;
  updatedAt: string;
};

/** Bucket deltas for `PATCH /staff/inventory/:variantId` (never absolute values). */
export type StockDeltas = { floor?: number; counter?: number; reserved?: number };

/** One queued (or in-flight) adjustment. `eventId` makes server replays idempotent. */
export type QueuedAdjustment = {
  variantId: string;
  deltas: StockDeltas;
  eventId: string;
  queuedAt: number;
};

export type StaffOrder = {
  id: string;
  stage: StaffStage;
  status: string;
  customer: string;
  firstItemName: string;
  itemCount: number;
  totalPaise: number;
  placedAt: string | null;
};

/** A trial booking on the store's Try-at-Home board. */
export type StaffTrial = {
  id: string;
  status: 'REQUESTED' | 'CONFIRMED' | 'OUT_FOR_TRIAL' | 'IN_TRIAL' | 'COMPLETED' | 'CANCELLED';
  customer: string;
  firstItemName: string;
  itemCount: number;
  valuePaise: number;
  /** Charge captured? Staff can only Confirm paid bookings. */
  paid: boolean;
  slotStart: string;
  slotEnd: string;
  trialEndsAt: string | null;
};

export type PaginatedInventory = Paginated<StaffInventoryRow>;
export type PaginatedStaffOrders = Paginated<StaffOrder>;
export type PaginatedStaffTrials = Paginated<StaffTrial>;
