/**
 * Catalog types — mirror the backend Prisma shapes (`plans/02-database-schema.md`).
 * Money is integer paise; ids are UUID strings.
 */
export type Department = 'MEN' | 'WOMEN' | 'UNISEX' | 'KIDS';

export type ProductImage = {
  id: string;
  url: string;
  altText: string | null;
  position: number;
};

export type ProductVariant = {
  id: string;
  sku: string;
  size: string;
  colorName: string;
  colorHex: string | null;
  pricePaise: number;
  mrpPaise: number;
  /** Live availability summed across sync-enabled locations. */
  availableQty: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  brand: string | null;
  department: Department;
  trialEligible: boolean;
  images: ProductImage[];
  variants: ProductVariant[];
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
};

export type Paginated<T> = {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};

/** Query params for `GET /products` (`plans/05-api-design.md`). */
export type ProductFilters = {
  q?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  limit?: number;
};
