/** Saved shipping address — mirrors the backend `address` module DTO. */
export type AddressLabel = 'HOME' | 'WORK' | 'OTHER';

export type Address = {
  id: string;
  label: AddressLabel;
  recipientName: string;
  recipientPhone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
};

/** Body for create / update (`POST` / `PATCH /addresses`). */
export type AddressInput = {
  label: AddressLabel;
  recipientName: string;
  recipientPhone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
};
