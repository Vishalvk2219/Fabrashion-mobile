import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { cancelOrder, fetchOrder, fetchOrders } from './api';

export const orderKeys = {
  list: ['orders'] as const,
  detail: (id: string) => ['orders', id] as const,
};

export function useOrders() {
  return useQuery({ queryKey: orderKeys.list, queryFn: () => fetchOrders() });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => fetchOrder(id),
    enabled: Boolean(id),
  });
}

export function useCancelOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelOrder(id),
    onSuccess: (order) => {
      qc.setQueryData(orderKeys.detail(order.id), order);
      void qc.invalidateQueries({ queryKey: orderKeys.list });
    },
  });
}
