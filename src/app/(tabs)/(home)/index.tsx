import { FlatList, RefreshControl } from 'react-native';

import { EmptyState, Loader } from '@/components/ui';
import { ProductCard } from '@/components/product';
import { useProducts } from '@/features/catalog/hooks';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/tokens';

export default function HomeScreen() {
  const { data, isLoading, isError, refetch, isRefetching } = useProducts();
  const products = data?.data ?? [];

  if (isLoading) return <Loader label="Loading products…" />;

  if (isError || products.length === 0) {
    return (
      <EmptyState
        icon="🛍️"
        title="Catalog coming soon"
        message="Products appear here once the backend catalog (Phase 2) is live. The navigation, theming, and data layer are all wired and ready."
      />
    );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(product) => product.id}
      numColumns={2}
      contentInsetAdjustmentBehavior="automatic"
      columnWrapperStyle={{ gap: spacing.md }}
      contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}
      renderItem={({ item }) => <ProductCard product={item} />}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />
      }
    />
  );
}
