import { create } from 'zustand';

import { ApiError } from '@/api/client';
import { queryClient } from '@/api/queryClient';
import { storage } from '@/lib/storage';
import { uuidv4 } from '@/lib/uuid';
import { adjustStock } from './api';
import type { InventoryStatus } from './model';
import type { PaginatedInventory, QueuedAdjustment, StaffStage, StockDeltas } from './schema';

const QUEUE_KEY = 'staff.syncQueue';

/** Query keys live here (not hooks.ts) so the flush loop can touch the cache without a cycle. */
export const staffKeys = {
  summary: ['staff', 'summary'] as const,
  inventory: ['staff', 'inventory'] as const,
  orders: (stage: StaffStage | 'ALL') => ['staff', 'orders', stage] as const,
  ordersRoot: ['staff', 'orders'] as const,
  trials: ['staff', 'trials'] as const,
};

type InvFilter = InventoryStatus | 'All';

/**
 * Client state for the staff shell: UI selections + the REAL offline queue.
 * Server data stays in the React Query cache; the queue holds stock deltas that
 * haven't reached the server yet. Every op carries a client `eventId`, and the
 * server applies each eventId at most once — so flushing is safe to retry forever.
 */
type StaffState = {
  queue: QueuedAdjustment[];
  /** False after a flush hit the network (not a 4xx) — drives the amber offline UI. */
  online: boolean;
  flushing: boolean;
  invFilter: InvFilter;
  /** Variant open in Update Stock. */
  activeVariantId: string | null;
  orderStage: StaffStage;

  setInvFilter: (f: InvFilter) => void;
  setActiveVariantId: (id: string) => void;
  setOrderStage: (s: StaffStage) => void;
  /** Queue a stock delta (applied optimistically via the queue overlay) and try to flush. */
  enqueueAdjust: (variantId: string, deltas: StockDeltas) => void;
  /** Push queued ops to the server in order; stops (and stays queued) when offline. */
  flush: () => Promise<void>;
};

const persistQueue = (queue: QueuedAdjustment[]) => storage.set(QUEUE_KEY, queue);

export const useStaffStore = create<StaffState>((set, get) => ({
  queue: storage.get<QueuedAdjustment[]>(QUEUE_KEY, []),
  online: true,
  flushing: false,
  invFilter: 'All',
  activeVariantId: null,
  orderStage: 'TO_PACK',

  setInvFilter: (invFilter) => set({ invFilter }),
  setActiveVariantId: (activeVariantId) => set({ activeVariantId }),
  setOrderStage: (orderStage) => set({ orderStage }),

  enqueueAdjust: (variantId, deltas) => {
    const queue = [...get().queue, { variantId, deltas, eventId: uuidv4(), queuedAt: Date.now() }];
    persistQueue(queue);
    set({ queue });
    void get().flush();
  },

  flush: async () => {
    if (get().flushing) return;
    set({ flushing: true });
    try {
      for (;;) {
        const [head, ...rest] = get().queue;
        if (!head) {
          set({ online: true });
          break;
        }
        try {
          const row = await adjustStock(head.variantId, head.deltas, head.eventId);
          // The response is this row's server truth — fold it into the cached board.
          queryClient.setQueryData<PaginatedInventory>(staffKeys.inventory, (prev) =>
            prev
              ? { ...prev, data: prev.data.map((r) => (r.variantId === row.variantId ? row : r)) }
              : prev,
          );
          persistQueue(rest);
          set({ queue: rest, online: true });
        } catch (err) {
          const rejected = err instanceof ApiError && err.status > 0;
          if (rejected) {
            // The server refused the op (stale local view, e.g. would go negative):
            // drop it and re-sync the board to truth rather than jam the queue.
            persistQueue(rest);
            set({ queue: rest });
            void queryClient.invalidateQueries({ queryKey: staffKeys.inventory });
          } else {
            set({ online: false }); // network — keep everything queued for the next sync
            break;
          }
        }
      }
      void queryClient.invalidateQueries({ queryKey: staffKeys.summary });
    } finally {
      set({ flushing: false });
    }
  },
}));

export const selectPendingCount = (s: StaffState): number => s.queue.length;
export const selectPendingFor = (variantId: string) => (s: StaffState) =>
  s.queue.some((op) => op.variantId === variantId);
