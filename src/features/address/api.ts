import { apiClient, apiGet, apiPost } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import type { Address, AddressInput } from './schema';

export function fetchAddresses(): Promise<Address[]> {
  return apiGet<Address[]>(endpoints.addresses.root);
}

export function createAddress(input: AddressInput): Promise<Address> {
  return apiPost<Address>(endpoints.addresses.root, input);
}

export async function updateAddress(id: string, input: Partial<AddressInput>): Promise<Address> {
  const { data } = await apiClient.patch<Address>(endpoints.addresses.detail(id), input);
  return data;
}

export async function removeAddress(id: string): Promise<{ addresses: Address[] }> {
  const { data } = await apiClient.delete<{ addresses: Address[] }>(endpoints.addresses.detail(id));
  return data;
}
