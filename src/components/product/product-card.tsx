import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, useColorScheme, View } from 'react-native';

import { Text } from '@/components/ui';
import type { Product } from '@/features/catalog/schema';
import { colors } from '@/theme/colors';
import { radii, spacing } from '@/theme/tokens';
import { PriceTag } from './price-tag';
import { StockLabel } from './stock-label';

/** Tappable catalog card → product detail. Uses the first variant/image for the summary. */
export function ProductCard({ product }: { product: Product }) {
  useColorScheme();
  const variant = product.variants[0];
  const imageUrl = product.images[0]?.url;
  const available = product.variants.reduce((sum, v) => sum + v.availableQty, 0);

  return (
    <Link href={{ pathname: '/product/[id]', params: { id: product.id } }} asChild>
      <Pressable style={styles.wrap}>
        <View style={[styles.imageWrap, { backgroundColor: colors.surface }]}>
          {imageUrl ? (
            <Image source={imageUrl} style={styles.image} contentFit="cover" transition={150} />
          ) : null}
        </View>
        <Text variant="headline" numberOfLines={1}>
          {product.name}
        </Text>
        {product.brand ? (
          <Text variant="caption" muted numberOfLines={1}>
            {product.brand}
          </Text>
        ) : null}
        {variant ? <PriceTag pricePaise={variant.pricePaise} mrpPaise={variant.mrpPaise} /> : null}
        <StockLabel availableQty={available} />
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, gap: spacing.xs },
  imageWrap: {
    aspectRatio: 3 / 4,
    borderRadius: radii.md,
    borderCurve: 'continuous',
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  image: { width: '100%', height: '100%' },
});
