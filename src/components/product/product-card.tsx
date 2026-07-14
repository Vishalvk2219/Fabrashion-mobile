import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';

import { Text } from '@/components/ui';
import type { CatalogItem } from '@/features/catalog/model';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/tokens';
import { PriceRow } from './price-row';
import { RatingStars } from './rating-stars';
import { WishButton } from './wish-button';

const openProduct = (id: string) => router.push(`/product/${id}`);

/** Product image with the design's diagonal sheen + a tone fallback when there's no live image. */
function ProductThumb({
  item,
  radius,
  style,
  children,
}: {
  item: CatalogItem;
  radius: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}) {
  return (
    <View style={[styles.thumb, { borderRadius: radius, backgroundColor: item.tone }, style]}>
      {item.imageUrl ? (
        <Image source={item.imageUrl} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
      ) : null}
      <LinearGradient
        colors={['rgba(255,255,255,0.4)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 0.6]}
        style={StyleSheet.absoluteFill}
      />
      {children}
    </View>
  );
}

function OfferTag({ pct }: { pct: number }) {
  if (!pct) return null;
  return (
    <View style={styles.offerTag}>
      <Text weight="700" size={9} color={colors.onPrimary} track={0.04}>
        {pct}% OFF
      </Text>
    </View>
  );
}

function Meta({ item }: { item: CatalogItem }) {
  return (
    <>
      {item.brand ? (
        <Text uppercase size={9} track={0.1} color={colors.faint} style={styles.brand}>
          {item.brand}
        </Text>
      ) : null}
      <Text weight="600" size={13} numberOfLines={1} style={styles.name}>
        {item.name}
      </Text>
    </>
  );
}

/** 2-column grid card (Recommended, Listing). */
export function ProductCard({ item }: { item: CatalogItem }) {
  return (
    <Pressable style={styles.gridCard} onPress={() => openProduct(item.id)}>
      <ProductThumb item={item} radius={radii.card} style={styles.gridThumb}>
        <View style={styles.wish}>
          <WishButton id={item.id} />
        </View>
        <OfferTag pct={item.offerPct} />
      </ProductThumb>
      <Meta item={item} />
      <View style={styles.priceLine}>
        <PriceRow pricePaise={item.pricePaise} mrpPaise={item.mrpPaise} />
      </View>
      <View style={styles.ratingLine}>
        <RatingStars rating={item.rating} />
      </View>
    </Pressable>
  );
}

/** Horizontal-rail card (New Arrivals, Trending). `priceMode` picks offer % vs struck MRP. */
export function ProductRailCard({
  item,
  priceMode = 'strike',
}: {
  item: CatalogItem;
  priceMode?: 'offer' | 'strike';
}) {
  return (
    <Pressable style={styles.railCard} onPress={() => openProduct(item.id)}>
      <ProductThumb item={item} radius={radii.card} style={styles.railThumb}>
        <View style={styles.wish}>
          <WishButton id={item.id} />
        </View>
      </ProductThumb>
      <Meta item={item} />
      <View style={styles.priceLine}>
        <PriceRow
          pricePaise={item.pricePaise}
          mrpPaise={item.mrpPaise}
          offerPct={item.offerPct}
          strike={priceMode === 'strike'}
          showOffer={priceMode === 'offer'}
        />
      </View>
    </Pressable>
  );
}

/** Small card (Recently Viewed, You May Also Like). */
export function ProductMiniCard({ item, width = 120 }: { item: CatalogItem; width?: number }) {
  return (
    <Pressable style={{ width }} onPress={() => openProduct(item.id)}>
      <View style={[styles.miniThumb, { width, height: width * 1.25, backgroundColor: item.tone }]}>
        {item.imageUrl ? (
          <Image source={item.imageUrl} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
        ) : null}
      </View>
      <Text weight="600" size={12} numberOfLines={1} style={styles.miniName}>
        {item.name}
      </Text>
      <Text weight="700" size={12}>
        {`₹${(item.pricePaise / 100).toLocaleString('en-IN')}`}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  thumb: { overflow: 'hidden' },
  gridCard: { flex: 1 },
  gridThumb: { width: '100%', aspectRatio: 3 / 4 },
  railCard: { width: 152 },
  railThumb: { width: 152, height: 200 },
  wish: { position: 'absolute', top: 10, right: 10 },
  offerTag: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderTopRightRadius: 8,
  },
  brand: { marginTop: 8 },
  name: { marginTop: 2 },
  priceLine: { marginTop: 3 },
  ratingLine: { marginTop: 5 },
  miniThumb: { borderRadius: 14, borderCurve: 'continuous', overflow: 'hidden' },
  miniName: { marginTop: 6 },
});
