import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { addCartItem, fetchCart, removeCartItem, updateCartItem } from './api';
import type { AddCartItemInput } from './schema';

export const cartKeys = { root: ['cart'] as const };

export function useCart() {
  return useQuery({ queryKey: cartKeys.root, queryFn: fetchCart });
}

/** Total quantity across cart lines — drives the Cart tab badge. */
export function useCartCount(): number {
  const { data } = useCart();
  return data?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
}

export function useAddToCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: AddCartItemInput) => addCartItem(input),
    onSuccess: (cart) => qc.setQueryData(cartKeys.root, cart),
  });
}

export function useUpdateCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      updateCartItem(itemId, quantity),
    onSuccess: (cart) => qc.setQueryData(cartKeys.root, cart),
  });
}

export function useRemoveCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => removeCartItem(itemId),
    onSuccess: (cart) => qc.setQueryData(cartKeys.root, cart),
  });
}
