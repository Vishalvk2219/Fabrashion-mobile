import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/layout/screen';
import { PriceTag, StockLabel } from '@/components/product';
import { Badge, Button, EmptyState, Loader, Text } from '@/components/ui';
import { useProduct } from '@/features/catalog/hooks';
import { colors } from '@/theme/colors';
import { radii, spacing } from '@/theme/tokens';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: product, isLoading, isError } = useProduct(id);

  if (isLoading) return <Loader label="Loading…" />;

  if (isError || !product) {
    return (
      <Screen contentContainerStyle={styles.centered}>
        <EmptyState
          icon="📦"
          title="Product details coming soon"
          message={`Detail for product ${id} loads here once the catalog API (Phase 2) is live.`}
        />
      </Screen>
    );
  }

  const variant = product.variants[0];
  const imageUrl = product.images[0]?.url;
  const available = product.variants.reduce((sum, v) => sum + v.availableQty, 0);

  return (
    <Screen>
      <Stack.Screen options={{ title: product.name }} />

      <View style={[styles.imageWrap, { backgroundColor: colors.surface }]}>
        {imageUrl ? (
          <Image source={imageUrl} style={styles.image} contentFit="cover" transition={200} />
        ) : null}
      </View>

      <View style={styles.headerRow}>
        {product.brand ? (
          <Text variant="caption" muted>
            {product.brand}
          </Text>
        ) : null}
        {product.trialEligible ? <Badge label="At-home trial" tone="primary" /> : null}
      </View>

      <Text variant="title" selectable>
        {product.name}
      </Text>

      {variant ? <PriceTag pricePaise={variant.pricePaise} mrpPaise={variant.mrpPaise} size="lg" /> : null}
      <StockLabel availableQty={available} />

      <Text variant="body" muted selectable>
        {product.description}
      </Text>

      <Button
        title={available > 0 ? 'Add to cart' : 'Out of stock'}
        disabled={available <= 0}
        onPress={() => {
          /* Wired to useAddToCart when backend Phase 4 lands. */
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  centered: { justifyContent: 'center' },
  imageWrap: {
    aspectRatio: 3 / 4,
    borderRadius: radii.lg,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
