/** Order shapes — mirror the backend `checkout` module OrderDTO. */
export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'FULFILLING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export type OrderItem = {
  productId: string;
  variantId: string;
  name: string;
  brand: string | null;
  size: string;
  colorName: string;
  colorHex: string | null;
  imageUrl: string | null;
  quantity: number;
  unitPricePaise: number;
  lineTotalPaise: number;
};

export type OrderPayment = {
  status: string;
  provider: string;
  amountPaise: number;
  method: string | null;
};

export type Order = {
  id: string;
  status: OrderStatus;
  source: 'ONLINE' | 'TRIAL_CONVERSION';
  subtotalPaise: number;
  taxPaise: number;
  shippingPaise: number;
  totalPaise: number;
  itemCount: number;
  shippingAddress: unknown;
  placedAt: string | null;
  createdAt: string;
  items: OrderItem[];
  payment: OrderPayment | null;
};

export type PaginatedOrders = {
  data: Order[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};
