import { create } from 'zustand';

import type { AdminOrderStatus } from './schema';
import type { CatalogStatus } from './model';

type CatFilter = CatalogStatus | 'All';
type OrderFilter = AdminOrderStatus | 'All';

/** Admin UI state: list tab filters. Server data lives in the React Query cache;
 *  the Add-Staff / New-Product forms keep local component state. */
type AdminState = {
  catalogFilter: CatFilter;
  orderFilter: OrderFilter;

  setCatalogFilter: (f: CatFilter) => void;
  setOrderFilter: (f: OrderFilter) => void;
};

export const useAdminStore = create<AdminState>((set) => ({
  catalogFilter: 'All',
  orderFilter: 'All',

  setCatalogFilter: (catalogFilter) => set({ catalogFilter }),
  setOrderFilter: (orderFilter) => set({ orderFilter }),
}));
