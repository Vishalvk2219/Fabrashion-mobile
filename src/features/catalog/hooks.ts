import { useQuery } from '@tanstack/react-query';

import { fetchCategories, fetchProduct, fetchProducts } from './api';
import { toCatalogItem, type CatalogItem } from './model';
import { previewCategories, previewItems } from './preview';
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

/**
 * Catalog list as display items. Prefers live `GET /products`; falls back to the labelled preview
 * fixture when the backend returns nothing (not yet built). `isPreview` flags which is in use.
 */
export function useCatalog(filters: ProductFilters = {}) {
  const query = useProducts(filters);
  const live: CatalogItem[] = query.data?.data.map(toCatalogItem) ?? [];
  const isPreview = !query.isLoading && live.length === 0;
  return {
    items: isPreview ? previewItems : live,
    isPreview,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    isRefetching: query.isRefetching,
  };
}

/** Single catalog item — live product mapped to a display item, or the preview fallback. */
export function useCatalogItem(id: string) {
  const isPreviewId = id.startsWith('preview-');
  const query = useProduct(isPreviewId ? '' : id);
  const live = query.data ? toCatalogItem(query.data) : null;

  if (isPreviewId || (!live && (query.isError || (!query.isLoading && !query.data)))) {
    const item = previewItems.find((p) => p.id === id) ?? previewItems[0];
    return { item, isPreview: true, isLoading: false, isError: false };
  }
  return { item: live, isPreview: false, isLoading: query.isLoading, isError: query.isError };
}

/**
 * Category tiles for the Home rail + Categories grid. Icons/counts are UI concerns the backend
 * `Category` doesn't carry, so this uses the preview tiles until a live→tile mapping exists.
 */
export function useCategoryTiles() {
  useCategories(); // warm the cache / surface errors; tiles are presentational for now
  return { tiles: previewCategories, isPreview: true };
}
