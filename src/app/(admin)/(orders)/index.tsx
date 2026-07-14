import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Pill } from '@/components/backoffice/parts';
import { EmptyState } from '@/components/ui/empty-state';
import { Icon } from '@/components/ui/icon';
import { Loader } from '@/components/ui/loader';
import { Text } from '@/components/ui/text';
import { useAdminOrders, useAdminOverview } from '@/features/admin/hooks';
import { ADMIN_ORDER_FILTERS, ADMIN_ORDER_META } from '@/features/admin/model';
import { useAdminStore } from '@/features/admin/store';
import { timeAgo } from '@/lib/dates';
import { formatPaiseCompact, formatPaiseLakhs } from '@/lib/money';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/tokens';

export default function AllOrders() {
  const insets = useSafeAreaInsets();
  const filter = useAdminStore((s) => s.orderFilter);
  const setFilter = useAdminStore((s) => s.setOrderFilter);
  const { data, isPending, isError, refetch } = useAdminOrders(filter === 'All' ? undefined : filter);
  const { data: overview } = useAdminOverview();

  const rows = data?.data ?? [];

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text serif weight="600" size={28}>
          Orders
        </Text>
        <Text size={12} color={colors.muted2} style={{ marginTop: 2 }}>
          {overview
            ? `${overview.ordersToday} today · ${formatPaiseLakhs(overview.revenueTodayPaise)} revenue`
            : '…'}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
          {ADMIN_ORDER_FILTERS.map((f) => {
            const active = f === filter;
            return (
              <Pressable
                key={f}
                onPress={() => setFilter(f)}
                style={[styles.tab, active ? styles.tabActive : styles.tabIdle]}>
                <Text size={12} weight="600" color={active ? colors.onPrimary : colors.label2}>
                  {f === 'All' ? 'All' : ADMIN_ORDER_META[f].label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {isPending ? (
        <Loader label="Loading orders…" />
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
              No orders here yet.
            </Text>
          ) : (
            rows.map((o) => {
              const meta = ADMIN_ORDER_META[o.status];
              return (
                <View key={o.id} style={styles.row}>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <View style={styles.rowTop}>
                      <Text size={14} weight="700">
                        #{o.id.slice(0, 8)}
                      </Text>
                      <Pill bg={meta.bg} fg={meta.fg}>
                        {meta.label}
                      </Pill>
                    </View>
                    <Text size={12} color={colors.muted} style={{ marginTop: 4 }}>
                      {o.customer} · {o.source === 'ONLINE' ? 'Online' : o.source} · {timeAgo(o.placedAt)}
                    </Text>
                  </View>
                  <View style={styles.amount}>
                    <Text size={15} weight="700">
                      {formatPaiseCompact(o.totalPaise)}
                    </Text>
                    <Icon name="chevron_right" size={20} color={colors.disabled} />
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
  scroll: { padding: 20, paddingBottom: 100, gap: 12 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderCurve: 'continuous',
    paddingVertical: 15,
    paddingHorizontal: 16,
  },
  rowTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  amount: { alignItems: 'flex-end' },
});
