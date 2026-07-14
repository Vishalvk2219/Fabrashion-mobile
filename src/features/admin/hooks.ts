import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createProduct,
  createStaff,
  fetchAdminCatalog,
  fetchAdminOrders,
  fetchAdminStaff,
  fetchOverview,
} from './api';
import type { AdminOrderStatus, CreateProductInput, CreateStaffInput } from './schema';

export const adminKeys = {
  overview: ['admin', 'overview'] as const,
  staff: ['admin', 'staff'] as const,
  catalog: ['admin', 'catalog'] as const,
  orders: (status: AdminOrderStatus | 'ALL') => ['admin', 'orders', status] as const,
  ordersRoot: ['admin', 'orders'] as const,
};

export function useAdminOverview() {
  return useQuery({ queryKey: adminKeys.overview, queryFn: fetchOverview });
}

export function useAdminStaff() {
  return useQuery({ queryKey: adminKeys.staff, queryFn: fetchAdminStaff });
}

export function useCreateStaff() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateStaffInput) => createStaff(input),
    onSuccess: () => void qc.invalidateQueries({ queryKey: adminKeys.staff }),
  });
}

export function useAdminCatalog() {
  return useQuery({ queryKey: adminKeys.catalog, queryFn: fetchAdminCatalog });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateProductInput) => createProduct(input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: adminKeys.catalog });
      // The product is live in the customer shop immediately — refresh that cache too.
      void qc.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useAdminOrders(status?: AdminOrderStatus) {
  return useQuery({
    queryKey: adminKeys.orders(status ?? 'ALL'),
    queryFn: () => fetchAdminOrders(status),
  });
}
