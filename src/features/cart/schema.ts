import type { ProductVariant } from '@/features/catalog/schema';

/** A line in the server cart. Totals are server-computed — never derived on the app. */
export type CartItem = {
  id: string;
  variantId: string;
  quantity: number;
  variant?: Pick<ProductVariant, 'id' | 'sku' | 'size' | 'colorName' | 'pricePaise' | 'mrpPaise'> & {
    productName?: string;
    imageUrl?: string | null;
  };
};

export type Cart = {
  id: string;
  items: CartItem[];
  subtotalPaise: number;
  shippingPaise: number;
  totalPaise: number;
};

export type AddCartItemInput = { variantId: string; quantity: number };
