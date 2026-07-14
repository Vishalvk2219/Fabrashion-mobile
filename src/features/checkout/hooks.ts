import { useMutation, useQueryClient } from '@tanstack/react-query';

import { cartKeys } from '@/features/cart/hooks';
import { orderKeys } from '@/features/orders/hooks';
import { confirmOrderDev, placeOrder } from './api';

/** Place the order; on success the cart is converted server-side, so refresh cart + orders. */
export function useCheckout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (addressId: string) => placeOrder(addressId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: cartKeys.root });
      void qc.invalidateQueries({ queryKey: orderKeys.list });
    },
  });
}

/** DEV payment confirmation (PhonePe stand-in). */
export function useConfirmOrderDev() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => confirmOrderDev(id),
    onSuccess: (order) => {
      qc.setQueryData(orderKeys.detail(order.id), order);
      void qc.invalidateQueries({ queryKey: orderKeys.list });
    },
  });
}
