import { router } from 'expo-router';
import { Fragment } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, Text } from '@/components/ui';
import { HomeSkeleton } from '@/components/layout/skeletons';
import { ProductCard, ProductMiniCard, ProductRailCard } from '@/components/product';
import { useCatalog, useCategoryTiles } from '@/features/catalog/hooks';
import type { CatalogItem, CategoryTile } from '@/features/catalog/model';
import { useSession } from '@/features/auth/hooks';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/tokens';

function SectionHeader({ title, onSeeAll }: { title: string; onSeeAll?: () => void }) {
  return (
    <View style={styles.sectionHeader}>
      <Text serif weight="600" size={26}>
        {title}
      </Text>
      {onSeeAll ? (
        <Pressable onPress={onSeeAll} hitSlop={8}>
          <Text weight="700" size={11} track={0.08} color={colors.accent}>
            SEE ALL
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function CategoryCircle({ tile }: { tile: CategoryTile }) {
  return (
    <Pressable style={styles.catCircleWrap} onPress={() => router.push('/listing')}>
      <View style={[styles.catCircle, { backgroundColor: tile.tone }]}>
        <Icon name={tile.icon} size={26} weight={300} color={colors.label} />
      </View>
      <Text size={11} weight="500" color={colors.label2} align="center">
        {tile.name}
      </Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { items, isLoading } = useCatalog();
  const { tiles } = useCategoryTiles();
  const { user } = useSession();

  if (isLoading) return <HomeSkeleton />;

  const newArrivals = items.slice(0, 6);
  const trending = items.slice(2, 8);
  const recommended = items.slice(0, 4);
  const recent = items.slice(4, 8);
  const recPairs: CatalogItem[][] = [];
  for (let i = 0; i < recommended.length; i += 2) recPairs.push(recommended.slice(i, i + 2));

  return (
    <ScrollView
      style={styles.root}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 32 }}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View>
          <Text uppercase size={10} track={0.16} color={colors.faint}>
            Deliver to
          </Text>
          <View style={styles.locationRow}>
            <Text weight="600" size={15}>
              Mumbai · 400001
            </Text>
            <Icon name="expand_more" size={18} color={colors.accent} />
          </View>
        </View>
        <View style={styles.headerActions}>
          <Pressable style={styles.iconBtn} hitSlop={4} onPress={() => router.push('/notifications')}>
            <Icon name="notifications" size={22} color={colors.label} />
            <View style={styles.bellDot} />
          </Pressable>
          <Pressable style={styles.avatar} hitSlop={4} onPress={() => router.push('/(tabs)/(profile)')}>
            <Text serif weight="600" size={18}>
              {(user?.fullName ?? 'A').charAt(0).toUpperCase()}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Search bar */}
      <Pressable style={styles.searchBar} onPress={() => router.push('/search')}>
        <Icon name="search" size={22} color={colors.muted2} />
        <Text size={14} color={colors.muted2}>
          Search brands, styles, occasions…
        </Text>
      </Pressable>

      {/* Hero banner */}
      <Pressable style={styles.hero} onPress={() => router.push('/listing')}>
        <View style={styles.heroGlow} />
        <Text uppercase size={10} track={0.24} color={colors.accent}>
          The Autumn Edit
        </Text>
        <Text serif weight="600" size={30} color={colors.white} style={styles.heroTitle}>
          Up to 40% off{'\n'}Premium Coats
        </Text>
        <View style={styles.heroBtn}>
          <Text weight="700" size={12} track={0.03}>
            Shop the Edit
          </Text>
        </View>
      </Pressable>

      {/* Category rail */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.catRail}>
        {tiles.map((t) => (
          <CategoryCircle key={t.id} tile={t} />
        ))}
      </ScrollView>

      {/* New Arrivals */}
      <SectionHeader title="New Arrivals" onSeeAll={() => router.push('/listing')} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rail}>
        {newArrivals.map((item) => (
          <ProductRailCard key={item.id} item={item} priceMode="offer" />
        ))}
      </ScrollView>

      {/* Atelier banner */}
      <Pressable style={styles.atelier} onPress={() => router.push('/listing')}>
        <View style={styles.atelierBlock} />
        <View>
          <Text uppercase size={10} track={0.2} color={colors.accent}>
            Premium Collection
          </Text>
          <Text serif weight="600" size={26} style={styles.atelierTitle}>
            The Atelier{'\n'}Series
          </Text>
          <Text size={12} weight="500" muted style={styles.atelierLink}>
            Explore →
          </Text>
        </View>
      </Pressable>

      {/* Trending */}
      <SectionHeader title="Trending Now" onSeeAll={() => router.push('/listing')} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rail}>
        {trending.map((item) => (
          <ProductRailCard key={item.id} item={item} priceMode="strike" />
        ))}
      </ScrollView>

      {/* Recommended grid */}
      <View style={styles.recHeader}>
        <SectionHeader title="Recommended" />
      </View>
      <View style={styles.grid}>
        {recPairs.map((pair, i) => (
          <View key={i} style={styles.gridRow}>
            {pair.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
            {pair.length === 1 ? <View style={{ flex: 1 }} /> : null}
          </View>
        ))}
      </View>

      {/* Recently Viewed */}
      <View style={styles.recHeader}>
        <SectionHeader title="Recently Viewed" />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rail}>
        {recent.map((item) => (
          <Fragment key={item.id}>
            <ProductMiniCard item={item} />
          </Fragment>
        ))}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 },
  headerActions: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute',
    top: 11,
    right: 12,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.accent,
    borderWidth: 1.5,
    borderColor: colors.background,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    marginHorizontal: 20,
    marginTop: 14,
    marginBottom: 4,
    height: 50,
    borderRadius: radii.lg,
    borderCurve: 'continuous',
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
  },
  hero: {
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 4,
    height: 172,
    borderRadius: 22,
    borderCurve: 'continuous',
    backgroundColor: colors.darkHero,
    overflow: 'hidden',
    justifyContent: 'center',
    paddingHorizontal: 26,
  },
  heroGlow: {
    position: 'absolute',
    right: -30,
    top: -30,
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: colors.accent,
    opacity: 0.28,
  },
  heroTitle: { marginTop: 8, lineHeight: 32 },
  heroBtn: {
    marginTop: 14,
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
  },
  catRail: { gap: 18, paddingHorizontal: 20, paddingTop: 22, paddingBottom: 6 },
  catCircleWrap: { width: 62, alignItems: 'center', gap: 8 },
  catCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
  },
  rail: { gap: 14, paddingHorizontal: 20, paddingBottom: 4 },
  atelier: {
    marginHorizontal: 20,
    marginVertical: 24,
    height: 150,
    borderRadius: 22,
    borderCurve: 'continuous',
    backgroundColor: colors.surfaceAlt,
    overflow: 'hidden',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  atelierBlock: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '45%',
    backgroundColor: colors.surfaceDeep,
  },
  atelierTitle: { marginTop: 6, lineHeight: 28 },
  atelierLink: { marginTop: 8 },
  recHeader: { marginTop: 6 },
  grid: { paddingHorizontal: 20, gap: 18 },
  gridRow: { flexDirection: 'row', gap: 18 },
});
