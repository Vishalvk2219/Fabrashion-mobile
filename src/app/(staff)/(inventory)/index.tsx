import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HeroStat, OfflineBanner, Pill, toneFor } from '@/components/backoffice/parts';
import { EmptyState } from '@/components/ui/empty-state';
import { Icon } from '@/components/ui/icon';
import { Loader } from '@/components/ui/loader';
import { Text } from '@/components/ui/text';
import { useStaffInventoryView, useStaffSummary } from '@/features/staff/hooks';
import {
  deriveStatus,
  INVENTORY_FILTERS,
  STATUS_PILL,
  totalUnits,
  type InventoryView,
} from '@/features/staff/model';
import { selectPendingCount, useStaffStore } from '@/features/staff/store';
import { formatPaiseCompact } from '@/lib/money';
import { fontFamily } from '@/theme/typography';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/tokens';

export default function StoreOps() {
  const insets = useSafeAreaInsets();
  const { rows, isPending, isError, refetch } = useStaffInventoryView();
  const { data: summary } = useStaffSummary();
  const filter = useStaffStore((s) => s.invFilter);
  const setFilter = useStaffStore((s) => s.setInvFilter);
  const setActiveVariantId = useStaffStore((s) => s.setActiveVariantId);
  const online = useStaffStore((s) => s.online);
  const pendingCount = useStaffStore(selectPendingCount);
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();
  const visible = rows
    .filter((it) => (filter === 'All' ? true : deriveStatus(it) === filter))
    .filter((it) => (q ? it.name.toLowerCase().includes(q) || it.sku.toLowerCase().includes(q) : true));

  const total = rows.reduce((a, c) => a + totalUnits(c), 0);
  const counter = rows.reduce((a, c) => a + c.counter, 0);
  const low = rows.filter((it) => {
    const st = deriveStatus(it);
    return st === 'Low Stock' || st === 'Out of Stock';
  }).length;

  const openItem = (variantId: string) => {
    setActiveVariantId(variantId);
    router.push('/update-stock');
  };

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Dark hero */}
        <View style={[styles.hero, { paddingTop: insets.top + 14 }]}>
          <View style={styles.heroTop}>
            <View style={{ flex: 1 }}>
              <Text uppercase size={10} track={0.16} color={colors.accent}>
                ANDRÓ · {summary?.store.name ?? 'Store Ops'}
              </Text>
              <Text serif weight="600" size={24} color={colors.white} style={{ lineHeight: 26 }}>
                Store Inventory
              </Text>
            </View>
            <Pressable
              style={[styles.syncBadge, { backgroundColor: online ? colors.okBg : colors.warnBg }]}
              onPress={() => router.push('/sync-queue')}>
              <Icon
                name={online ? 'cloud_done' : 'cloud_off'}
                size={16}
                fill
                color={online ? colors.okFg : colors.warnFg}
              />
              <Text size={11} weight="700" color={online ? colors.okFg : colors.warnFg}>
                {online ? 'Online · Synced' : `Offline · ${pendingCount} pending`}
              </Text>
            </Pressable>
          </View>
          <View style={styles.statRow}>
            <HeroStat value={String(total)} label="Total units" />
            <HeroStat value={String(counter)} label="On counter" color={colors.accent} />
            <HeroStat value={String(low)} label="Low / out" color={colors.amber} />
          </View>
        </View>

        {pendingCount > 0 ? (
          <OfflineBanner
            pendingCount={pendingCount}
            onPress={() => router.push('/sync-queue')}
            style={styles.bannerSpacing}
          />
        ) : null}

        {/* Search */}
        <View style={styles.searchWrap}>
          <View style={styles.search}>
            <Icon name="qr_code_scanner" size={20} color={colors.muted2} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search name or SKU…"
              placeholderTextColor={colors.muted2}
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.searchInput}
            />
            <Icon name="search" size={20} color={colors.accent} />
          </View>
        </View>

        {/* Filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}>
          {INVENTORY_FILTERS.map((f) => {
            const active = f === filter;
            return (
              <Pressable
                key={f}
                onPress={() => setFilter(f)}
                style={[styles.chip, active ? styles.chipActive : styles.chipIdle]}>
                <Text size={12} weight="600" color={active ? colors.onPrimary : colors.label2}>
                  {f}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Rows */}
        {isPending ? (
          <View style={styles.stateWrap}>
            <Loader label="Loading the store board…" />
          </View>
        ) : isError ? (
          <View style={styles.stateWrap}>
            <EmptyState
              icon="cloud_off"
              title="Can't reach the store"
              message="Check your connection, then pull to retry."
              action={
                <Pressable style={styles.retry} onPress={() => void refetch()}>
                  <Text size={14} weight="600" color={colors.onPrimary}>
                    Retry
                  </Text>
                </Pressable>
              }
            />
          </View>
        ) : (
          <View style={styles.rows}>
            {visible.length === 0 ? (
              <Text size={13} color={colors.muted} align="center" style={{ marginTop: 24 }}>
                No items match.
              </Text>
            ) : (
              visible.map((it) => (
                <InventoryRow key={it.variantId} item={it} onPress={() => openItem(it.variantId)} />
              ))
            )}
          </View>
        )}
      </ScrollView>

      {/* FAB */}
      <Pressable style={[styles.fab, { bottom: insets.bottom + 84 }]} onPress={() => router.push('/add-item')}>
        <Icon name="add" size={22} color={colors.onPrimary} />
        <Text size={14} weight="600" color={colors.onPrimary}>
          Add Item
        </Text>
      </Pressable>
    </View>
  );
}

function InventoryRow({ item, onPress }: { item: InventoryView; onPress: () => void }) {
  const status = deriveStatus(item);
  const pill = STATUS_PILL[status];
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={[styles.thumb, { backgroundColor: item.colorHex ?? toneFor(item.sku) }]} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <View style={styles.rowTop}>
          <Text uppercase size={9} track={0.1} color={colors.faint}>
            {item.brand ?? 'ANDRÓ'} · {item.sku}
          </Text>
          <View style={styles.syncDot}>
            <View style={[styles.dot, { backgroundColor: item.synced ? colors.okFg : colors.warnFg }]} />
            <Text size={10} weight="600" color={colors.muted2}>
              {item.synced ? 'Synced' : 'Pending'}
            </Text>
          </View>
        </View>
        <Text size={14} weight="600" style={{ marginTop: 3 }}>
          {item.name} · {item.size}
        </Text>
        <View style={styles.rowMeta}>
          <Pill bg={pill.bg} fg={pill.fg}>
            {status}
          </Pill>
          <Text size={11} color={colors.muted}>
            Floor {item.floor} · Counter {item.counter} · Held {item.reserved}
          </Text>
        </View>
        <Text size={11} color={colors.faint} style={{ marginTop: 4 }}>
          {formatPaiseCompact(item.pricePaise)} · {totalUnits(item)} total
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.officeCanvas },
  scroll: { paddingBottom: 120 },
  hero: {
    backgroundColor: colors.darkHero,
    paddingHorizontal: 20,
    paddingBottom: 18,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  heroTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  syncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radii.pill,
  },
  statRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  bannerSpacing: { marginHorizontal: 20, marginTop: 14 },
  searchWrap: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 8 },
  search: {
    height: 46,
    borderRadius: radii.md,
    borderCurve: 'continuous',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: fontFamily.sansMedium,
    color: colors.label,
    paddingVertical: 0,
  },
  chips: { gap: 8, paddingHorizontal: 20, paddingBottom: 10 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1.5,
    borderCurve: 'continuous',
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipIdle: { backgroundColor: colors.background, borderColor: colors.border },
  stateWrap: { minHeight: 260 },
  retry: {
    height: 48,
    paddingHorizontal: 28,
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rows: { paddingHorizontal: 20, gap: 12 },
  row: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderCurve: 'continuous',
    padding: 12,
  },
  thumb: { width: 56, height: 70, borderRadius: 10, borderCurve: 'continuous' },
  rowTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  syncDot: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  rowMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
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
