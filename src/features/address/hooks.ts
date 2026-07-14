import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createAddress, fetchAddresses, removeAddress, updateAddress } from './api';
import type { Address, AddressInput } from './schema';

export const addressKeys = { root: ['addresses'] as const };

export function useAddresses() {
  return useQuery({ queryKey: addressKeys.root, queryFn: fetchAddresses });
}

/** The default address (or the first one), for pre-selecting at checkout. */
export function useDefaultAddress(): Address | undefined {
  const { data } = useAddresses();
  return data?.find((a) => a.isDefault) ?? data?.[0];
}

export function useCreateAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: AddressInput) => createAddress(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: addressKeys.root }),
  });
}

export function useUpdateAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<AddressInput> }) => updateAddress(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: addressKeys.root }),
  });
}

export function useRemoveAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => removeAddress(id),
    onSuccess: (res) => qc.setQueryData(addressKeys.root, res.addresses),
  });
}
