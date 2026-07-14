/** Wire types for the admin APIs â€” mirror `fabrashion-backend/src/modules/admin`. */
import type { Department, Paginated } from '@/features/catalog/schema';

export type AdminOverview = {
  revenueTodayPaise: number;
  ordersToday: number;
  avgOrderPaise: number;
  activeCustomers: number;
  /** Basis points vs the previous period; null = no baseline (render "â€”"). */
  deltas: {
    revenueBps: number | null;
    ordersBps: number | null;
    aovBps: number | null;
    customersBps: number | null;
  };
  /** Last 7 IST days, oldest first. */
  revenue7d: { date: string; revenuePaise: number }[];
  /** Physical-store rows are 0 until POS sale ingestion lands. */
  storePerf: { storeId: string | null; name: string; revenuePaise: number }[];
};

export type AdminStaffStatus = 'ACTIVE' | 'INVITED';

export type AdminStaffMember = {
  id: string;
  fullName: string;
  phone: string | null;
  role: 'STAFF' | 'ADMIN';
  store: { id: string; name: string; code: string } | null;
  status: AdminStaffStatus;
  createdAt: string;
};

export type CreateStaffInput = {
  fullName: string;
  phone: string; // 10 digits, no +91 (same rule as login)
  role: 'STAFF' | 'ADMIN';
  storeId?: string;
  permissions?: Record<string, boolean>;
};

export type AdminCatalogRow = {
  id: string;
  name: string;
  slug: string;
  brand: string | null;
  minPricePaise: number;
  maxPricePaise: number;
  /** Sellable units summed across every location. */
  totalStock: number;
  isActive: boolean;
  imageUrl: string | null;
};

export type CreateProductInput = {
  name: string;
  description: string;
  categoryId: string;
  department: Department;
  brand?: string;
  fit?: string;
  material?: string;
  gstRatePct?: number;
  hsnCode?: string;
  trialEligible?: boolean;
  imageUrl?: string;
  initialWarehouseQty?: number;
  variants: {
    size: string;
    colorName: string;
    colorHex?: string;
    pricePaise: number;
    mrpPaise: number;
  }[];
};

export type AdminOrderStatus = 'NEW' | 'PACKED' | 'DELIVERED' | 'CANCELLED';

export type AdminOrder = {
  id: string;
  status: AdminOrderStatus;
  rawStatus: string;
  customer: string;
  itemCount: number;
  totalPaise: number;
  source: string;
  placedAt: string | null;
};

export type PaginatedAdminStaff = Paginated<AdminStaffMember>;
export type PaginatedAdminCatalog = Paginated<AdminCatalogRow>;
export type PaginatedAdminOrders = Paginated<AdminOrder>;
