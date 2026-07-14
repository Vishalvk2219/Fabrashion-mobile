import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState, Icon, Text } from '@/components/ui';
import { ProductCard, ProductMiniCard } from '@/components/product';
import { useCatalog } from '@/features/catalog/hooks';
import type { CatalogItem } from '@/features/catalog/model';
import { colors } from '@/theme/colors';
import { fontFamily } from '@/theme/typography';

const RECENT = ['Silk dress', 'Wool blazer', 'Loafers'];
const TRENDING = ['Cashmere overcoats', 'Occasion wear', 'Linen resort shirts'];

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const { items } = useCatalog();

  const q = query.trim().toLowerCase();
  const results = q
    ? items.filter((i) => i.name.toLowerCase().includes(q) || (i.brand ?? '').toLowerCase().includes(q))
    : [];
  const pairs: CatalogItem[][] = [];
  for (let i = 0; i < results.length; i += 2) pairs.push(results.slice(i, i + 2));

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable style={styles.back} onPress={() => router.back()} hitSlop={6}>
          <Icon name="arrow_back" size={22} color={colors.label} />
        </Pressable>
        <View style={styles.field}>
          <Icon name="search" size={20} color={colors.muted2} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search brands, styles…"
            placeholderTextColor={colors.muted2}
            autoFocus
            style={styles.input}
            returnKeyType="search"
          />
          <Icon name="mic" size={22} color={colors.accent} />
        </View>
      </View>

      {q ? (
        results.length === 0 ? (
          <EmptyState
            icon="search_off"
            title="No results found"
            message={`We couldn't find anything for "${query}". Try a different search.`}
          />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.results}>
            <Text muted size={13} style={styles.resultCount}>
              {results.length} {results.length === 1 ? 'result' : 'results'}
            </Text>
            <View style={styles.grid}>
              {pairs.map((pair, i) => (
                <View key={i} style={styles.gridRow}>
                  {pair.map((item) => (
                    <ProductCard key={item.id} item={item} />
                  ))}
                  {pair.length === 1 ? <View style={{ flex: 1 }} /> : null}
                </View>
              ))}
            </View>
          </ScrollView>
        )
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
          <View style={styles.rowBetween}>
            <Text weight="700" size={13}>
              Recent Searches
            </Text>
            <Text weight="600" size={12} color={colors.accent}>
              Clear
            </Text>
          </View>
          <View style={styles.chips}>
            {RECENT.map((r) => (
              <Pressable key={r} style={styles.chip} onPress={() => setQuery(r)}>
                <Icon name="history" size={16} color={colors.muted2} />
                <Text size={13} weight="500" color={colors.label2}>
                  {r}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text weight="700" size={13} style={styles.blockTitle}>
            Trending Searches
          </Text>
          {TRENDING.map((t) => (
            <Pressable key={t} style={styles.trendRow} onPress={() => setQuery(t)}>
              <Icon name="trending_up" size={20} color={colors.accent} />
              <Text size={14} style={{ flex: 1 }}>
                {t}
              </Text>
              <Icon name="north_east" size={18} color={colors.disabled} />
            </Pressable>
          ))}

          <Text serif weight="600" size={20} style={styles.popularTitle}>
            Popular Pieces
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rail}>
            {items.slice(0, 4).map((item) => (
              <ProductMiniCard key={item.id} item={item} />
            ))}
          </ScrollView>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  back: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  field: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    borderCurve: 'continuous',
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
  },
  input: { flex: 1, fontFamily: fontFamily.sans, fontSize: 14, color: colors.label },
  body: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 24 },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: colors.surface,
  },
  blockTitle: { marginBottom: 4 },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
  },
  popularTitle: { marginTop: 22, marginBottom: 12 },
  rail: { gap: 14, paddingBottom: 4 },
  results: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24 },
  resultCount: { marginBottom: 12 },
  grid: { gap: 18 },
  gridRow: { flexDirection: 'row', gap: 18 },
});
