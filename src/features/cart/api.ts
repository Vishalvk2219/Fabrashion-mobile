import { apiGet, apiClient } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import type { AddCartItemInput, Cart } from './schema';

export function fetchCart(): Promise<Cart> {
  return apiGet<Cart>(endpoints.cart.root);
}

export async function addCartItem(input: AddCartItemInput): Promise<Cart> {
  const { data } = await apiClient.post<Cart>(endpoints.cart.items, input);
  return data;
}

export async function updateCartItem(itemId: string, quantity: number): Promise<Cart> {
  const { data } = await apiClient.patch<Cart>(endpoints.cart.item(itemId), { quantity });
  return data;
}

export async function removeCartItem(itemId: string): Promise<Cart> {
  const { data } = await apiClient.delete<Cart>(endpoints.cart.item(itemId));
  return data;
}
