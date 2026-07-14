import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Pill, toneFor } from '@/components/backoffice/parts';
import { EmptyState } from '@/components/ui/empty-state';
import { Icon } from '@/components/ui/icon';
import { Loader } from '@/components/ui/loader';
import { Text } from '@/components/ui/text';
import { useAdminCatalog } from '@/features/admin/hooks';
import { CATALOG_FILTERS, CATALOG_STATUS_PILL, catalogStatus } from '@/features/admin/model';
import { useAdminStore } from '@/features/admin/store';
import { formatPaiseCompact } from '@/lib/money';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/tokens';

export default function Catalog() {
  const insets = useSafeAreaInsets();
  const { data, isPending, isError, refetch } = useAdminCatalog();
  const filter = useAdminStore((s) => s.catalogFilter);
  const setFilter = useAdminStore((s) => s.setCatalogFilter);

  const rows = (data?.data ?? []).filter((p) =>
    filter === 'All' ? true : catalogStatus(p.totalStock) === filter,
  );

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.titleRow}>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text serif weight="600" size={28}>
              Catalog
            </Text>
            <Text size={12} color={colors.muted2} style={{ marginTop: 2 }}>
              {data ? `${data.meta.total} products · all locations` : '…'}
            </Text>
          </View>
          <Pressable
            style={styles.addBtn}
            hitSlop={{ top: 8, bottom: 8 }}
            onPress={() => router.push('/add-item')}>
            <Icon name="add" size={20} color={colors.onPrimary} />
            <Text size={14} weight="600" color={colors.onPrimary}>
              Add Product
            </Text>
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
          {CATALOG_FILTERS.map((f) => {
            const active = f === filter;
            return (
              <Pressable
                key={f}
                onPress={() => setFilter(f)}
                style={[styles.tab, active ? styles.tabActive : styles.tabIdle]}>
                <Text size={12} weight="600" color={active ? colors.onPrimary : colors.label2}>
                  {f}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {isPending ? (
        <Loader label="Loading the catalog…" />
      ) : isError ? (
        <EmptyState
          icon="cloud_off"
          title="Can't reach the store"
          message="Check your connection and try again."
          action={
            <Pressable style={styles.retry} onPress={() => void refetch()}>
              <Text size={14} weight="600" color={colors.onPrimary}>
                Retry
              </Text>
            </Pressable>
          }
        />
      ) : (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {rows.length === 0 ? (
            <Text size={13} color={colors.muted} align="center" style={{ marginTop: 40 }}>
              No products match.
            </Text>
          ) : (
            rows.map((p) => {
              const status = catalogStatus(p.totalStock);
              const pill = CATALOG_STATUS_PILL[status];
              return (
                <View key={p.id} style={styles.row}>
                  {p.imageUrl ? (
                    <Image source={{ uri: p.imageUrl }} style={styles.thumb} contentFit="cover" />
                  ) : (
                    <View style={[styles.thumb, { backgroundColor: toneFor(p.slug) }]} />
                  )}
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text uppercase size={9} track={0.1} color={colors.faint}>
                      {p.brand ?? 'ANDRÓ'}
                    </Text>
                    <Text size={14} weight="600" style={{ marginTop: 2 }}>
                      {p.name}
                    </Text>
                    <View style={styles.rowMeta}>
                      <Text size={13} weight="700">
                        {p.minPricePaise === p.maxPricePaise
                          ? formatPaiseCompact(p.minPricePaise)
                          : `from ${formatPaiseCompact(p.minPricePaise)}`}
                      </Text>
                      <Pill bg={pill.bg} fg={pill.fg}>
                        {status}
                      </Pill>
                    </View>
                  </View>
                  <View style={{ alignItems: 'center' }}>
                    <Text size={20} weight="700">
                      {p.totalStock}
                    </Text>
                    <Text size={9} color={colors.muted2}>
                      in stock
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.officeCanvas },
  header: { backgroundColor: colors.background, paddingHorizontal: 20, paddingBottom: 8 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 40,
    paddingHorizontal: 16,
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    borderCurve: 'continuous',
  },
  tabs: { gap: 8, marginTop: 14, paddingBottom: 2 },
  tab: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 18, borderWidth: 1.5, borderCurve: 'continuous' },
  tabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabIdle: { backgroundColor: colors.background, borderColor: colors.border },
  retry: {
    height: 48,
    paddingHorizontal: 28,
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { padding: 20, paddingBottom: 110, gap: 12 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderCurve: 'continuous',
    padding: 12,
  },
  thumb: { width: 52, height: 64, borderRadius: 10, borderCurve: 'continuous' },
  rowMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 7 },
  fab: {
    position: 'absolute',
    right: 22,
    height: 54,
    paddingHorizontal: 22,
    borderRadius: 18,
    borderCurve: 'continuous',
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: colors.dark,
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
});
