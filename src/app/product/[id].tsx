import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PriceRow, ProductMiniCard, WishButton } from '@/components/product';
import { PdpSkeleton } from '@/components/layout/skeletons';
import { Icon, PressableScale, Text } from '@/components/ui';
import { useCatalog, useCatalogItem } from '@/features/catalog/hooks';
import { useAddToCart } from '@/features/cart/hooks';
import { tap } from '@/lib/haptics';
import { colors, productTones } from '@/theme/colors';

function CircleIcon({
  name,
  onPress,
}: {
  name: 'arrow_back' | 'ios_share' | 'zoom_in';
  onPress?: () => void;
}) {
  return (
    <Pressable style={styles.circleIcon} onPress={onPress} hitSlop={6}>
      <Icon name={name} size={name === 'zoom_in' ? 20 : 22} color={colors.label} />
    </Pressable>
  );
}

function InfoCard({
  icon,
  title,
  subtitle,
  chevron,
}: {
  icon: 'local_shipping' | 'storefront';
  title: string;
  subtitle: string;
  chevron?: boolean;
}) {
  return (
    <View style={styles.infoCard}>
      <Icon name={icon} size={24} color={colors.accent} />
      <View style={{ flex: 1 }}>
        <Text weight="600" size={13}>
          {title}
        </Text>
        <Text size={11} muted style={{ marginTop: 1 }}>
          {subtitle}
        </Text>
      </View>
      {chevron ? <Icon name="chevron_right" size={20} color={colors.disabled} /> : null}
    </View>
  );
}

const RATING_BARS = [
  { star: 5, pct: 82 },
  { star: 4, pct: 12 },
  { star: 3, pct: 6 },
];

export default function ProductDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { item, isLoading, isPreview } = useCatalogItem(id);
  const { items } = useCatalog();

  const [img, setImg] = useState(0);
  const [color, setColor] = useState(0);
  const [size, setSize] = useState('M');
  const addToCart = useAddToCart();

  if (isLoading || !item) return <PdpSkeleton />;

  // Resolve the chosen size + colour to a sellable variant (fall back to size-only, then first).
  const selectedHex = item.colors[color] ?? null;
  const selectedSize = item.sizes.includes(size) ? size : (item.sizes[0] ?? size);
  const variant =
    item.variants.find((v) => v.size === selectedSize && v.colorHex === selectedHex) ??
    item.variants.find((v) => v.size === selectedSize) ??
    item.variants[0];
  // Preview items carry fake variant ids (no live backend) — don't hit the cart API then.
  const canAdd = !isPreview && !!variant && variant.availableQty > 0;

  const addCurrentToCart = () => {
    if (canAdd && variant) {
      tap(); // light confirmation the item went into the bag
      addToCart.mutate({ variantId: variant.id, quantity: 1 });
    }
  };

  const gallery = [item.tone, productTones[3], productTones[6], productTones[8]];
  const similar = items.filter((i) => i.id !== item.id).slice(0, 6);

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 96 }}>
        {/* Gallery */}
        <View style={[styles.hero, { backgroundColor: gallery[img] }]}>
          {item.imageUrl ? (
            <Image source={item.imageUrl} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
          ) : null}
          <LinearGradient
            colors={['rgba(255,255,255,0.45)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            locations={[0, 0.55]}
            style={StyleSheet.absoluteFill}
          />
          <View style={[styles.heroTop, { top: insets.top + 8 }]}>
            <CircleIcon name="arrow_back" onPress={() => router.back()} />
            <View style={styles.heroTopRight}>
              <CircleIcon name="ios_share" />
              <WishButton id={item.id} size={42} />
            </View>
          </View>
          <View style={styles.thumbs}>
            {gallery.map((tone, i) => (
              <Pressable
                key={i}
                onPress={() => setImg(i)}
                style={[
                  styles.thumb,
                  { backgroundColor: tone, borderColor: i === img ? colors.primary : 'transparent' },
                ]}
              />
            ))}
          </View>
          <View style={styles.zoom}>
            <CircleIcon name="zoom_in" />
          </View>
        </View>

        <View style={styles.info}>
          {/* Brand + rating */}
          <View style={styles.brandRow}>
            <Text
              uppercase
              weight="600"
              size={10}
              track={0.14}
              color={colors.accent}
              numberOfLines={1}
              style={{ flexShrink: 1, minWidth: 0 }}>
              {item.brand}
            </Text>
            {item.rating != null ? (
              <View style={styles.ratingChip}>
                <Icon name="star" size={14} fill color={colors.accent} />
                <Text weight="700" size={12}>
                  {item.rating.toFixed(1)}
                </Text>
                <Text size={11} color={colors.muted2}>
                  ({item.ratingCount})
                </Text>
              </View>
            ) : null}
          </View>

          <Text serif weight="600" size={30} style={styles.name}>
            {item.name}
          </Text>
          <View style={styles.priceLine}>
            <PriceRow
              pricePaise={item.pricePaise}
              mrpPaise={item.mrpPaise}
              offerPct={item.offerPct}
              size="lg"
              showOffer
            />
          </View>
          <Text size={11} muted style={{ marginTop: 4 }}>
            Inclusive of all taxes
          </Text>

          {/* Colour */}
          {item.colors.length > 0 ? (
            <>
              <Text weight="700" size={13} style={styles.sectionTitle}>
                Colour
              </Text>
              <View style={styles.swatchRow}>
                {item.colors.map((hex, i) => (
                  <Pressable key={hex} onPress={() => setColor(i)}>
                    <View style={[styles.swatchRing, i === color && { borderColor: colors.accent }]}>
                      <View style={[styles.swatchDot, { backgroundColor: hex }]} />
                    </View>
                  </Pressable>
                ))}
              </View>
            </>
          ) : null}

          {/* Size */}
          <View style={styles.sizeHeader}>
            <Text weight="700" size={13}>
              Select Size
            </Text>
            <Text weight="600" size={12} color={colors.accent}>
              Size Guide
            </Text>
          </View>
          <View style={styles.sizeRow}>
            {item.sizes.map((s) => {
              const active = s === size;
              return (
                <Pressable
                  key={s}
                  onPress={() => setSize(s)}
                  style={[
                    styles.sizeBox,
                    active
                      ? { backgroundColor: colors.primary, borderColor: colors.primary }
                      : { borderColor: colors.border },
                  ]}>
                  <Text weight="600" size={13} color={active ? colors.onPrimary : colors.label2}>
                    {s}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.deliveryCard}>
            <InfoCard
              icon="local_shipping"
              title="Delivery by Mon, 8 Jul"
              subtitle="Free delivery · Easy 15-day returns"
            />
          </View>
          <View style={{ marginTop: 12 }}>
            <InfoCard
              icon="storefront"
              title="Available at 3 stores near you"
              subtitle="Bandra · Lower Parel · Colaba"
              chevron
            />
          </View>

          {/* Details */}
          <Text serif weight="600" size={22} style={styles.blockTitle}>
            Details
          </Text>
          <Text size={13} color={colors.label2} style={styles.desc}>
            {item.description}
          </Text>
          <View style={styles.specRow}>
            {item.material ? (
              <View>
                <Text uppercase size={10} track={0.1} color={colors.muted2}>
                  Material
                </Text>
                <Text weight="600" size={13} style={{ marginTop: 3 }}>
                  {item.material}
                </Text>
              </View>
            ) : null}
            {item.care ? (
              <View>
                <Text uppercase size={10} track={0.1} color={colors.muted2}>
                  Care
                </Text>
                <Text weight="600" size={13} style={{ marginTop: 3 }}>
                  {item.care}
                </Text>
              </View>
            ) : null}
          </View>

          {/* Reviews */}
          {item.rating != null ? (
            <>
              <View style={styles.reviewHeader}>
                <Text serif weight="600" size={22}>
                  Reviews
                </Text>
                <Pressable onPress={() => router.push('/reviews')} hitSlop={6}>
                  <Text weight="600" size={12} color={colors.accent}>
                    View all {item.ratingCount}
                  </Text>
                </Pressable>
              </View>
              <View style={styles.reviewSummary}>
                <View style={styles.reviewScore}>
                  <Text serif weight="700" size={40} style={{ lineHeight: 42 }}>
                    {item.rating.toFixed(1)}
                  </Text>
                  <View style={styles.starRow}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Icon key={i} name="star" size={13} fill color={colors.accent} />
                    ))}
                  </View>
                  <Text size={10} muted style={{ marginTop: 4 }}>
                    {item.ratingCount} reviews
                  </Text>
                </View>
                <View style={{ flex: 1, gap: 5 }}>
                  {RATING_BARS.map((b) => (
                    <View key={b.star} style={styles.barRow}>
                      <Text size={10} muted style={{ width: 8 }}>
                        {b.star}
                      </Text>
                      <View style={styles.barTrack}>
                        <View style={[styles.barFill, { width: `${b.pct}%` }]} />
                      </View>
                    </View>
                  ))}
                </View>
              </View>
              <View style={styles.reviewPreview}>
                <View style={styles.reviewer}>
                  <View style={styles.avatar}>
                    <Text weight="700" size={11}>
                      R
                    </Text>
                  </View>
                  <Text weight="600" size={13}>
                    Riya S.
                  </Text>
                  <Icon name="star" size={14} fill color={colors.accent} style={{ marginLeft: 'auto' }} />
                  <Text weight="700" size={12}>
                    5.0
                  </Text>
                </View>
                <Text size={12} color={colors.label2} style={styles.reviewText}>
                  Exquisite fabric and the fit is perfect. The Try at Home service made choosing the
                  right size effortless.
                </Text>
              </View>
            </>
          ) : null}

          {/* Similar */}
          <Text serif weight="600" size={22} style={styles.blockTitle}>
            You May Also Like
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.similarRail}>
            {similar.map((s) => (
              <ProductMiniCard key={s.id} item={s} width={130} />
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Action bar */}
      <View style={[styles.actionBar, { paddingBottom: insets.bottom + 12 }]}>
        <PressableScale
          style={styles.tryBtn}
          scaleTo={0.94}
          onPress={() =>
            router.push({ pathname: '/try-home', params: { id: item.id, variantId: variant?.id } })
          }>
          <Icon name="checkroom" size={20} color={colors.label} />
          <Text weight="700" size={9}>
            Try Home
          </Text>
        </PressableScale>
        <PressableScale
          style={styles.cartBtn}
          onPress={() => {
            addCurrentToCart();
            router.push('/(tabs)/(cart)');
          }}>
          <Text weight="600" size={14}>
            Add to Cart
          </Text>
        </PressableScale>
        <PressableScale
          style={styles.buyBtn}
          onPress={() => {
            addCurrentToCart();
            router.push('/checkout');
          }}>
          <Text weight="600" size={14} color={colors.onPrimary}>
            Buy Now
          </Text>
        </PressableScale>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  hero: { width: '100%', height: 460, overflow: 'hidden' },
  heroTop: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heroTopRight: { flexDirection: 'row', gap: 8 },
  circleIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbs: { position: 'absolute', bottom: 14, left: 16, flexDirection: 'row', gap: 8 },
  thumb: { width: 46, height: 58, borderRadius: 8, borderWidth: 2 },
  zoom: { position: 'absolute', bottom: 14, right: 14 },
  info: { paddingHorizontal: 20, paddingTop: 18 },
  brandRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  ratingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surface,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  name: { marginTop: 6, lineHeight: 32 },
  priceLine: { marginTop: 10 },
  sectionTitle: { marginTop: 22 },
  swatchRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  swatchRing: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatchDot: { width: 30, height: 30, borderRadius: 15 },
  sizeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 22,
  },
  sizeRow: { flexDirection: 'row', gap: 10, marginTop: 12, flexWrap: 'wrap' },
  sizeBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderCurve: 'continuous',
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliveryCard: { marginTop: 24 },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: 16,
    borderCurve: 'continuous',
  },
  blockTitle: { marginTop: 28 },
  desc: { marginTop: 8, lineHeight: 22 },
  specRow: { flexDirection: 'row', gap: 24, marginTop: 16 },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 28,
  },
  reviewSummary: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    marginTop: 14,
    padding: 16,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 16,
    borderCurve: 'continuous',
  },
  reviewScore: { alignItems: 'center' },
  starRow: { flexDirection: 'row', gap: 2, marginTop: 2 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  barTrack: { flex: 1, height: 5, backgroundColor: colors.border, borderRadius: 3 },
  barFill: { height: 5, backgroundColor: colors.accent, borderRadius: 3 },
  reviewPreview: {
    marginTop: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
  reviewer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewText: { marginTop: 8, lineHeight: 20 },
  similarRail: { gap: 14, paddingTop: 2, paddingBottom: 4 },
  actionBar: {
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
    backgroundColor: colors.background,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  tryBtn: {
    width: 76,
    height: 54,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    borderRadius: 14,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBtn: {
    flex: 1,
    height: 54,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    borderRadius: 14,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyBtn: {
    flex: 1,
    height: 54,
    backgroundColor: colors.primary,
    borderRadius: 14,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
