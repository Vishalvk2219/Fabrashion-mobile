import { apiClient, apiGet } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import type {
  PaginatedInventory,
  PaginatedStaffOrders,
  PaginatedStaffTrials,
  StaffInventoryRow,
  StaffStage,
  StaffSummary,
  StaffTrial,
  StockDeltas,
} from './schema';

export function fetchStaffSummary(): Promise<StaffSummary> {
  return apiGet<StaffSummary>(endpoints.staff.summary);
}

/** The whole store board in one page — a boutique carries dozens of SKUs, not thousands. */
export function fetchStaffInventory(): Promise<PaginatedInventory> {
  return apiGet<PaginatedInventory>(`${endpoints.staff.inventory}?limit=100`);
}

export async function adjustStock(
  variantId: string,
  deltas: StockDeltas,
  eventId: string,
): Promise<StaffInventoryRow> {
  const { data } = await apiClient.patch<StaffInventoryRow>(endpoints.staff.adjust(variantId), {
    deltas,
    eventId,
  });
  return data;
}

export function fetchStaffOrders(stage?: StaffStage): Promise<PaginatedStaffOrders> {
  const qs = stage ? `?stage=${stage}&limit=50` : '?limit=50';
  return apiGet<PaginatedStaffOrders>(`${endpoints.staff.orders}${qs}`);
}

export async function advanceOrder(id: string) {
  const { data } = await apiClient.post(endpoints.staff.advance(id));
  return data;
}

export function fetchStaffTrials(): Promise<PaginatedStaffTrials> {
  return apiGet<PaginatedStaffTrials>(`${endpoints.staff.trials}?limit=50`);
}

export async function advanceTrial(id: string): Promise<StaffTrial> {
  const { data } = await apiClient.post<StaffTrial>(endpoints.staff.advanceTrial(id));
  return data;
}
