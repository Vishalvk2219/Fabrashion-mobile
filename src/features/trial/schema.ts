/** Wire types for the at-home trial APIs â€” mirror `fabrashion-backend/src/modules/trial`. */
import type { Paginated } from '@/features/catalog/schema';

export type TrialStatus =
  | 'REQUESTED'
  | 'CONFIRMED'
  | 'OUT_FOR_TRIAL'
  | 'IN_TRIAL'
  | 'COMPLETED'
  | 'CANCELLED';

export type TrialOutcome = 'PENDING' | 'KEPT' | 'RETURNED';

export type TrialItem = {
  trialItemId: string;
  variantId: string;
  productId: string;
  name: string;
  brand: string | null;
  size: string;
  colorName: string;
  colorHex: string | null;
  imageUrl: string | null;
  quantity: number;
  unitPricePaise: number;
  outcome: TrialOutcome;
};

export type Trial = {
  id: string;
  status: TrialStatus;
  store: { id: string; name: string; code: string } | null;
  address: unknown;
  note: string | null;
  slotStart: string;
  slotEnd: string;
  /** Full basket value held for the trial (Strategy A â€” refunded for returns). */
  authAmountPaise: number;
  paid: boolean;
  refundPaise: number;
  /** Keep/return deadline once delivered; undecided pieces auto-return after it. */
  trialEndsAt: string | null;
  conversionOrderId: string | null;
  itemCount: number;
  items: TrialItem[];
  createdAt: string;
};

export type TrialSlotWindow = { slotStart: string; slotEnd: string; available: boolean };

export type TrialEligibility = {
  addressServiceable: boolean;
  store: { id: string; name: string; code: string } | null;
  items: {
    variantId: string;
    eligible: boolean;
    reason: string | null;
    name: string;
    size: string;
    colorName: string;
    pricePaise: number;
  }[];
  slots: { date: string; windows: TrialSlotWindow[] }[];
  limits: { maxItems: number; maxValuePaise: number };
};

export type CreateTrialInput = {
  items: { variantId: string; qty: number }[];
  addressId: string;
  slotStart: string;
  note?: string;
};

export type OutcomeInput = { items: { trialItemId: string; outcome: 'KEPT' | 'RETURNED' }[] };

export type PaginatedTrials = Paginated<Trial>;
