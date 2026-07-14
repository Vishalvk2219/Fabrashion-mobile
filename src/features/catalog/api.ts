import { apiGet } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import type { Category, Paginated, Product, ProductFilters } from './schema';

export function fetchProducts(filters: ProductFilters = {}): Promise<Paginated<Product>> {
  return apiGet<Paginated<Product>>(endpoints.products.list, { params: filters });
}

export function fetchProduct(id: string): Promise<Product> {
  return apiGet<Product>(endpoints.products.detail(id));
}

export function fetchCategories(): Promise<Category[]> {
  return apiGet<Category[]>(endpoints.categories);
}
