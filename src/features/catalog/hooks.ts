import { useQuery } from '@tanstack/react-query';

import { fetchCategories, fetchProduct, fetchProducts } from './api';
import type { ProductFilters } from './schema';

export const catalogKeys = {
  categories: ['categories'] as const,
  list: (filters: ProductFilters) => ['products', 'list', filters] as const,
  detail: (id: string) => ['products', 'detail', id] as const,
};

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: catalogKeys.list(filters),
    queryFn: () => fetchProducts(filters),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: catalogKeys.detail(id),
    queryFn: () => fetchProduct(id),
    enabled: Boolean(id),
  });
}

export function useCategories() {
  return useQuery({ queryKey: catalogKeys.categories, queryFn: fetchCategories });
}
