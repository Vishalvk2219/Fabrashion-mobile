import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FiltersSheet, ProductCard } from '@/components/product';
import { Icon, Text } from '@/components/ui';
import { ListingSkeleton } from '@/components/layout/skeletons';
import { useCatalog } from '@/features/catalog/hooks';
import { colors } from '@/theme/colors';

function CircleBtn({ icon, onPress }: { icon: 'arrow_back' | 'search'; onPress: () => void }) {
  return (
    <Pressable style={styles.circle} onPress={onPress} hitSlop={6}>
      <Icon name={icon} size={22} color={colors.label} />
    </Pressable>
  );
}

function Chip({
  label,
  icon,
  active,
  onPress,
}: {
  label: string;
  icon?: 'tune' | 'swap_vert';
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={{ top: 6, bottom: 6 }}
      style={[
        styles.chip,
        active ? { backgroundColor: colors.primary } : { borderWidth: 1.5, borderColor: colors.border },
      ]}>
      {icon ? <Icon name={icon} size={16} color={active ? colors.onPrimary : colors.label2} /> : null}
      <Text weight="600" size={12} color={active ? colors.onPrimary : colors.label2}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function ListingScreen() {
  const insets = useSafeAreaInsets();
  const { items, isLoading } = useCatalog();
  const [filtersOpen, setFiltersOpen] = useState(false);

  if (isLoading) return <ListingSkeleton />;

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <CircleBtn icon="arrow_back" onPress={() => router.back()} />
        <View style={styles.titleWrap}>
          <Text serif weight="600" size={22}>
            All Pieces
          </Text>
          <Text size={11} color={colors.muted2} style={styles.count}>
            {items.length} items
          </Text>
        </View>
        <CircleBtn icon="search" onPress={() => router.push('/search')} />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
        style={styles.chipScroll}>
        <Chip label="Filters" icon="tune" active onPress={() => setFiltersOpen(true)} />
        <Chip label="Popular" icon="swap_vert" />
        <Chip label="Size" />
        <Chip label="Colour" />
        <Chip label="Price" />
      </ScrollView>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => <ProductCard item={item} />}
      />

      <FiltersSheet visible={filtersOpen} onClose={() => setFiltersOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  circle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: { flex: 1 },
  count: { marginTop: 2 },
  chipScroll: { flexGrow: 0, borderBottomWidth: 1, borderBottomColor: colors.hairline },
  chipRow: { gap: 10, paddingHorizontal: 16, paddingVertical: 10 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 38,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  grid: { padding: 20, paddingBottom: 110, gap: 18 },
  gridRow: { gap: 18 },
});
