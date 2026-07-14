import { apiGet, apiPost } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import type { Order, PaginatedOrders } from './schema';

export function fetchOrders(page = 1, limit = 20): Promise<PaginatedOrders> {
  return apiGet<PaginatedOrders>(endpoints.orders.list, { params: { page, limit } });
}

export function fetchOrder(id: string): Promise<Order> {
  return apiGet<Order>(endpoints.orders.detail(id));
}

export async function cancelOrder(id: string): Promise<Order> {
  return apiPost<Order>(endpoints.orders.cancel(id));
}
