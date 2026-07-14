import { apiPost } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import type { Order } from '@/features/orders/schema';

/** Place the active cart as a PENDING order shipped to `addressId`. */
export function placeOrder(addressId: string): Promise<Order> {
  return apiPost<Order>(endpoints.checkout, { addressId });
}

/** DEV-only: mark a PENDING order PAID (stands in for the PhonePe capture webhook until phase 4c). */
export function confirmOrderDev(id: string): Promise<Order> {
  return apiPost<Order>(endpoints.orders.confirmDev(id));
}
