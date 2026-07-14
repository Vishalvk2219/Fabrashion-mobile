import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SectionLabel } from '@/components/backoffice/parts';
import { Icon } from '@/components/ui/icon';
import { Loader } from '@/components/ui/loader';
import { Text } from '@/components/ui/text';
import { useAuthStore } from '@/features/auth/store';
import { useAdminOverview } from '@/features/admin/hooks';
import { formatBps, formatPaiseCompact, formatPaiseLakhs } from '@/lib/money';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/tokens';
import type { IconName } from '@/theme/material-icons';
import type { Href } from 'expo-router';

type Link = { title: string; icon: IconName; href: Href };
const LINKS: Link[] = [
  { title: 'Manage Staff', icon: 'groups', href: '/(admin)/(staff)' },
  { title: 'Catalog', icon: 'style', href: '/(admin)/(catalog)' },
  { title: 'All Orders', icon: 'receipt_long', href: '/(admin)/(orders)' },
  { title: 'Add Staff', icon: 'person_add', href: '/add-staff' },
];

const DAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function AdminOverview() {
  const insets = useSafeAreaInsets();
  const signOut = useAuthStore((s) => s.signOut);
  const user = useAuthStore((s) => s.user);
  const { data, isPending } = useAdminOverview();

  const kpis = data
    ? [
        { title: 'Revenue today', value: formatPaiseLakhs(data.revenueTodayPaise), bps: data.deltas.revenueBps, icon: 'payments' as IconName },
        { title: 'Orders', value: String(data.ordersToday), bps: data.deltas.ordersBps, icon: 'shopping_bag' as IconName },
        { title: 'Avg order value', value: formatPaiseCompact(data.avgOrderPaise), bps: data.deltas.aovBps, icon: 'trending_up' as IconName },
        { title: 'Active customers', value: String(data.activeCustomers), bps: data.deltas.customersBps, icon: 'group' as IconName },
      ]
    : [];

  const maxDay = Math.max(1, ...(data?.revenue7d.map((d) => d.revenuePaise) ?? [1]));
  const maxStore = Math.max(1, ...(data?.storePerf.map((s) => s.revenuePaise) ?? [1]));

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Dark hero */}
        <View style={[styles.hero, { paddingTop: insets.top + 14 }]}>
          <View style={styles.heroTop}>
            <View style={{ flex: 1 }}>
              <Text uppercase size={10} track={0.16} color={colors.accent}>
                ANDRÓ · All Stores
              </Text>
              <Text serif weight="600" size={27} color={colors.white} style={{ lineHeight: 30, marginTop: 3 }}>
                Welcome, {user?.fullName.split(' ')[0] ?? 'Admin'}
              </Text>
              <View style={styles.roleBadge}>
                <Icon name="shield_person" size={14} fill color={colors.accent} />
                <Text size={11} weight="700" track={0.04} color={colors.accent}>
                  Administrator
                </Text>
              </View>
            </View>
            <Pressable style={styles.logout} hitSlop={6} onPress={() => void signOut()}>
              <Icon name="logout" size={22} color={colors.white} />
            </Pressable>
          </View>

          <View style={styles.kpiGrid}>
            {isPending
              ? [0, 1, 2, 3].map((i) => (
                  <View key={i} style={styles.kpi}>
                    <Text size={23} weight="700" color={colors.heroMute}>
                      —
                    </Text>
                  </View>
                ))
              : kpis.map((k) => (
                  <View key={k.title} style={styles.kpi}>
                    <View style={styles.kpiHead}>
                      <Icon name={k.icon} size={20} color={colors.accent} />
                      <Text
                        size={11}
                        weight="700"
                        color={k.bps === null ? colors.heroMute : k.bps >= 0 ? colors.kpiUp : colors.kpiDown}>
                        {formatBps(k.bps)}
                      </Text>
                    </View>
                    <Text size={23} weight="700" color={colors.white} style={{ marginTop: 8 }}>
                      {k.value}
                    </Text>
                    <Text size={10.5} color={colors.heroMute} style={{ marginTop: 1 }}>
                      {k.title}
                    </Text>
                  </View>
                ))}
          </View>
        </View>

        {/* Revenue chart */}
        <View style={styles.section}>
          <View style={styles.card}>
            <View style={styles.cardHead}>
              <Text size={13} weight="700">
                Revenue · last 7 days
              </Text>
              <Text size={11} color={colors.muted2}>
                vs yesterday {formatBps(data?.deltas.revenueBps ?? null)}
              </Text>
            </View>
            {!data ? (
              <View style={{ height: 100 }}>
                <Loader />
              </View>
            ) : (
              <View style={styles.chart}>
                {data.revenue7d.map((b) => {
                  const peak = b.revenuePaise === maxDay && b.revenuePaise > 0;
                  const pct = Math.max(4, Math.round((b.revenuePaise / maxDay) * 100));
                  return (
                    <View key={b.date} style={styles.barCol}>
                      <View style={styles.barTrack}>
                        <View
                          style={[
                            styles.bar,
                            { height: `${pct}%`, backgroundColor: peak ? colors.accent : colors.divider },
                          ]}
                        />
                      </View>
                      <Text size={10} weight="600" color={colors.faint}>
                        {DAY_LETTERS[new Date(b.date).getDay()]}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </View>

        {/* Channel / store performance (physical stores report 0 until POS sales sync) */}
        <View style={styles.section}>
          <SectionLabel style={{ marginBottom: 12 }}>Revenue by channel · 7 days</SectionLabel>
          <View style={styles.perfCard}>
            {(data?.storePerf ?? []).map((s, i, list) => (
              <View key={s.name} style={[styles.perfRow, i < list.length - 1 && styles.perfDivider]}>
                <View style={styles.perfTop}>
                  <Text size={13.5} weight="600">
                    {s.name}
                  </Text>
                  <Text size={13} weight="700">
                    {formatPaiseLakhs(s.revenuePaise)}
                  </Text>
                </View>
                <View style={styles.perfTrack}>
                  <View
                    style={[
                      styles.perfFill,
                      {
                        width: `${Math.round((s.revenuePaise / maxStore) * 100)}%`,
                        backgroundColor: s.storeId === null ? colors.label : colors.accent,
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Quick links */}
        <View style={styles.section}>
          <View style={styles.linkGrid}>
            {LINKS.map((l) => (
              <Pressable key={l.title} style={styles.linkCard} onPress={() => router.push(l.href)}>
                <View style={styles.linkIcon}>
                  <Icon name={l.icon} size={22} color={colors.accent} />
                </View>
                <Text size={13.5} weight="600" style={{ flexShrink: 1, minWidth: 0 }}>
                  {l.title}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.officeCanvas },
  scroll: { paddingBottom: 100 },
  hero: {
    backgroundColor: colors.dark,
    paddingHorizontal: 20,
    paddingBottom: 22,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
  },
  heroTop: { flexDirection: 'row', alignItems: 'flex-start' },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    marginTop: 9,
    backgroundColor: colors.accentTint,
    paddingHorizontal: 11,
    paddingVertical: 4,
    borderRadius: radii.pill,
  },
  logout: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.heroTile,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 18 },
  kpi: {
    flexBasis: '47%',
    flexGrow: 1,
    backgroundColor: colors.heroTile,
    borderRadius: radii.lg,
    borderCurve: 'continuous',
    padding: 14,
  },
  kpiHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  section: { paddingHorizontal: 20, paddingTop: 18 },
  card: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.card,
    borderCurve: 'continuous',
    padding: 16,
    paddingBottom: 12,
  },
  cardHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  chart: { flexDirection: 'row', alignItems: 'flex-end', gap: 9 },
  barCol: { flex: 1, alignItems: 'center', gap: 6 },
  barTrack: { width: '100%', height: 80, justifyContent: 'flex-end' },
  bar: { width: '100%', borderTopLeftRadius: 6, borderTopRightRadius: 6, borderBottomLeftRadius: 3, borderBottomRightRadius: 3 },
  perfCard: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.card,
    borderCurve: 'continuous',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  perfRow: { paddingVertical: 12 },
  perfDivider: { borderBottomWidth: 1, borderBottomColor: colors.hairline },
  perfTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  perfTrack: { height: 6, backgroundColor: colors.hairline, borderRadius: 3, overflow: 'hidden' },
  perfFill: { height: 6, borderRadius: 3 },
  linkGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  linkCard: {
    flexBasis: '47%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderCurve: 'continuous',
    padding: 16,
  },
  linkIcon: {
    width: 42,
    height: 42,
    borderRadius: radii.chip,
    backgroundColor: colors.officeCanvas,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
