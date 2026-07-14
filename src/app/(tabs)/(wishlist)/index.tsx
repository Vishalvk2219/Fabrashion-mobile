import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { WishButton } from '@/components/product';
import { Icon, Text } from '@/components/ui';
import { useCatalog } from '@/features/catalog/hooks';
import type { CatalogItem } from '@/features/catalog/model';
import { useAddToCart } from '@/features/cart/hooks';
import { useWishlistStore } from '@/features/wishlist/store';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/tokens';

function WishlistCard({ item }: { item: CatalogItem }) {
  const addToCart = useAddToCart();
  const moveToBag = () => {
    const variant = item.variants.find((v) => v.availableQty > 0) ?? item.variants[0];
    if (variant && !item.id.startsWith('preview-')) addToCart.mutate({ variantId: variant.id, quantity: 1 });
    router.push('/(tabs)/(cart)');
  };
  return (
    <View style={styles.card}>
      <Pressable style={[styles.thumb, { backgroundColor: item.tone }]} onPress={() => router.push(`/product/${item.id}`)}>
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
        <View style={styles.wish}>
          <WishButton id={item.id} />
        </View>
      </Pressable>
      <Text weight="600" size={13} numberOfLines={1} style={{ marginTop: 8 }}>
        {item.name}
      </Text>
      <Text weight="700" size={13} style={{ marginTop: 2 }}>
        {`₹${(item.pricePaise / 100).toLocaleString('en-IN')}`}
      </Text>
      <Pressable style={styles.moveBtn} hitSlop={{ top: 6, bottom: 6 }} onPress={moveToBag}>
        <Text weight="600" size={12}>
          Move to Bag
        </Text>
      </Pressable>
    </View>
  );
}

export default function WishlistScreen() {
  const insets = useSafeAreaInsets();
  const ids = useWishlistStore((s) => s.ids);
  const { items } = useCatalog();
  const wished = items.filter((i) => ids.includes(i.id));

  const pairs: CatalogItem[][] = [];
  for (let i = 0; i < wished.length; i += 2) pairs.push(wished.slice(i, i + 2));

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text serif weight="600" size={32}>
          Wishlist
        </Text>
        <Text size={12} color={colors.muted2} style={{ marginTop: 2 }}>
          {wished.length} saved pieces
        </Text>
      </View>

      {wished.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyCircle}>
            <Icon name="favorite" size={44} weight={300} color={colors.accent} />
          </View>
          <Text serif weight="600" size={24} align="center" style={{ marginTop: 24 }}>
            Your wishlist awaits
          </Text>
          <Text muted size={13} align="center" style={styles.emptyMsg}>
            Tap the heart on any piece to save it here for later.
          </Text>
          <Pressable style={styles.discoverBtn} onPress={() => router.push('/')}>
            <Text weight="600" size={14} color={colors.onPrimary}>
              Discover Pieces
            </Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.grid}>
          {pairs.map((pair, i) => (
            <View key={i} style={styles.gridRow}>
              {pair.map((item) => (
                <WishlistCard key={item.id} item={item} />
              ))}
              {pair.length === 1 ? <View style={{ flex: 1 }} /> : null}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 20, paddingBottom: 8 },
  grid: { padding: 20, paddingBottom: 110, gap: 18 },
  gridRow: { flexDirection: 'row', gap: 18 },
  card: { flex: 1 },
  thumb: { width: '100%', aspectRatio: 3 / 4, borderRadius: radii.card, borderCurve: 'continuous', overflow: 'hidden' },
  wish: { position: 'absolute', top: 10, right: 10 },
  moveBtn: {
    marginTop: 8,
    height: 38,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    borderRadius: 10,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, paddingBottom: 80 },
  emptyCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyMsg: { marginTop: 8, lineHeight: 21, maxWidth: 230 },
  discoverBtn: {
    marginTop: 24,
    paddingVertical: 14,
    paddingHorizontal: 30,
    backgroundColor: colors.primary,
    borderRadius: 14,
    borderCurve: 'continuous',
  },
});
