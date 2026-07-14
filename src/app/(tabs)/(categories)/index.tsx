import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, Text } from '@/components/ui';
import { useCategoryTiles } from '@/features/catalog/hooks';
import type { CategoryTile } from '@/features/catalog/model';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/tokens';

function CategoryCard({ tile }: { tile: CategoryTile }) {
  return (
    <Pressable style={[styles.card, { backgroundColor: tile.tone }]} onPress={() => router.push('/listing')}>
      <View style={styles.cardBlob} />
      <Icon name={tile.icon} size={30} weight={300} color={colors.label} />
      <View>
        <Text serif weight="600" size={20}>
          {tile.name}
        </Text>
        <Text size={11} muted style={styles.count}>
          {tile.count}
        </Text>
      </View>
    </Pressable>
  );
}

export default function CategoriesScreen() {
  const insets = useSafeAreaInsets();
  const { tiles } = useCategoryTiles();
  const pairs: CategoryTile[][] = [];
  for (let i = 0; i < tiles.length; i += 2) pairs.push(tiles.slice(i, i + 2));

  return (
    <ScrollView
      style={styles.root}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text serif weight="600" size={32}>
          Categories
        </Text>
      </View>

      <Pressable style={styles.search} onPress={() => router.push('/search')}>
        <Icon name="search" size={20} color={colors.muted2} />
        <Text size={13} color={colors.muted2}>
          Search categories
        </Text>
      </Pressable>

      <View style={styles.grid}>
        {pairs.map((pair, i) => (
          <View key={i} style={styles.row}>
            {pair.map((tile) => (
              <CategoryCard key={tile.id} tile={tile} />
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 20, paddingBottom: 8 },
  search: {
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 16,
    height: 48,
    borderRadius: radii.md,
    borderCurve: 'continuous',
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
  },
  grid: { paddingHorizontal: 20, gap: 14 },
  row: { flexDirection: 'row', gap: 14 },
  card: {
    flex: 1,
    height: 130,
    borderRadius: radii.card,
    borderCurve: 'continuous',
    padding: 18,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  cardBlob: {
    position: 'absolute',
    right: -14,
    bottom: -14,
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  count: { marginTop: 1 },
});
