import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  advanceOrder,
  advanceTrial,
  fetchStaffInventory,
  fetchStaffOrders,
  fetchStaffSummary,
  fetchStaffTrials,
} from './api';
import type { InventoryView } from './model';
import type { QueuedAdjustment, StaffStage } from './schema';
import { staffKeys, useStaffStore } from './store';

export function useStaffSummary() {
  return useQuery({ queryKey: staffKeys.summary, queryFn: fetchStaffSummary });
}

export function useStaffInventory() {
  return useQuery({ queryKey: staffKeys.inventory, queryFn: fetchStaffInventory });
}

/** Fold queued (not yet flushed) deltas onto the server rows. */
function applyQueue(rows: InventoryView[], queue: QueuedAdjustment[]): InventoryView[] {
  if (queue.length === 0) return rows;
  const byVariant = new Map(rows.map((r) => [r.variantId, r]));
  for (const op of queue) {
    const row = byVariant.get(op.variantId);
    if (!row) continue;
    byVariant.set(op.variantId, {
      ...row,
      floor: Math.max(0, row.floor + (op.deltas.floor ?? 0)),
      counter: Math.max(0, row.counter + (op.deltas.counter ?? 0)),
      reserved: Math.max(0, row.reserved + (op.deltas.reserved ?? 0)),
      synced: false,
    });
  }
  return rows.map((r) => byVariant.get(r.variantId) ?? r);
}

/**
 * The board the screens render: server truth + optimistic overlay of the offline
 * queue. `synced: false` marks rows with pending local changes ("Pending" dot).
 */
export function useStaffInventoryView() {
  const query = useStaffInventory();
  const queue = useStaffStore((s) => s.queue);
  const rows = useMemo<InventoryView[]>(() => {
    const base = (query.data?.data ?? []).map((r) => ({ ...r, synced: true }));
    return applyQueue(base, queue);
  }, [query.data, queue]);
  return { ...query, rows };
}

export function useStaffOrders(stage?: StaffStage) {
  return useQuery({
    queryKey: staffKeys.orders(stage ?? 'ALL'),
    queryFn: () => fetchStaffOrders(stage),
  });
}

export function useAdvanceOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => advanceOrder(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: staffKeys.ordersRoot });
      void qc.invalidateQueries({ queryKey: staffKeys.summary });
    },
  });
}

/** The store's Try-at-Home board (active trial bookings it fulfils). */
export function useStaffTrials() {
  return useQuery({ queryKey: staffKeys.trials, queryFn: fetchStaffTrials });
}

export function useAdvanceTrial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => advanceTrial(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: staffKeys.trials });
      void qc.invalidateQueries({ queryKey: staffKeys.summary });
    },
  });
}
