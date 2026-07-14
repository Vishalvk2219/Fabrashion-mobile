/** Server cart — mirrors the backend `cart` module DTO. Totals are server-computed; never derived. */
export type CartLine = {
  itemId: string;
  productId: string;
  variantId: string;
  name: string;
  brand: string | null;
  size: string;
  colorName: string;
  colorHex: string | null;
  imageUrl: string | null;
  pricePaise: number;
  mrpPaise: number;
  qty: number;
  /** Live online availability for this variant. */
  availableQty: number;
  lineTotalPaise: number;
};

export type CartTotals = {
  count: number;
  subtotalPaise: number;
  discountPaise: number;
  taxPaise: number;
  shippingPaise: number;
  totalPaise: number;
};

export type Cart = {
  id: string;
  lines: CartLine[];
  totals: CartTotals;
};

export type AddCartItemInput = { variantId: string; quantity: number };
