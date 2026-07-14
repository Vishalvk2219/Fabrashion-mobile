import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HeroStat, OfflineBanner, SectionLabel } from '@/components/backoffice/parts';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useAuthStore } from '@/features/auth/store';
import { useStaffOrders, useStaffSummary } from '@/features/staff/hooks';
import { orderItemsLine } from '@/features/staff/model';
import { selectPendingCount, useStaffStore } from '@/features/staff/store';
import { initials } from '@/features/admin/model';
import { greetingFor, timeAgo } from '@/lib/dates';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/tokens';
import type { IconName } from '@/theme/material-icons';
import type { Href } from 'expo-router';

type Quick = { title: string; icon: IconName; href: Href };
const QUICK_ACTIONS: Quick[] = [
  { title: 'Scan & Update', icon: 'qr_code_scanner', href: '/(staff)/(inventory)' },
  { title: 'Add Item', icon: 'add_box', href: '/add-item' },
  { title: 'Fulfil Orders', icon: 'local_shipping', href: '/(staff)/(orders)' },
  { title: 'Sync Queue', icon: 'cloud_sync', href: '/sync-queue' },
];

type Task = { key: string; title: string; sub: string; icon: IconName; tone: string; action: string };

export default function StaffDashboard() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const pendingCount = useStaffStore(selectPendingCount);
  const { data: summary } = useStaffSummary();
  const { data: toPack } = useStaffOrders('TO_PACK');

  const firstName = user?.fullName.split(' ')[0] ?? 'there';

  // Today's tasks derive from live data: the oldest orders to pack + a low-stock nudge.
  const tasks: Task[] = [
    ...(toPack?.data ?? []).slice(0, 3).map((o) => ({
      key: o.id,
      title: `Pack order for ${o.customer}`,
      sub: `${orderItemsLine(o.firstItemName, o.itemCount)} · ${timeAgo(o.placedAt)}`,
      icon: 'inventory_2' as IconName,
      tone: colors.accentSoft,
      action: 'Pack',
    })),
    ...(summary && summary.lowStock > 0
      ? [
          {
            key: 'low-stock',
            title: `Low stock · ${summary.lowStock} item${summary.lowStock > 1 ? 's' : ''}`,
            sub: 'Restock the floor or update counts',
            icon: 'warning' as IconName,
            tone: colors.warnBg,
            action: 'Review',
          },
        ]
      : []),
  ];

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
              <Text serif weight="600" size={27} color={colors.white} style={styles.heroTitle}>
                {greetingFor(firstName)}
              </Text>
              <View style={styles.roleBadge}>
                <Icon name="badge" size={14} color={colors.accent} fill />
                <Text size={11} weight="700" track={0.04} color={colors.accent}>
                  Store Staff
                </Text>
              </View>
            </View>
            <Pressable style={styles.avatar} hitSlop={6} onPress={() => router.push('/(staff)/(profile)')}>
              <Text serif weight="600" size={18}>
                {initials(user?.fullName ?? '·')}
              </Text>
            </Pressable>
          </View>
          <View style={styles.statRow}>
            <HeroStat value={String(summary?.toPack ?? '—')} label="To pack" />
            <HeroStat value={String(summary?.tryAtHome ?? '—')} label="Try-at-home" color={colors.accent} />
            <HeroStat value={String(summary?.lowStock ?? '—')} label="Low / out" color={colors.amber} />
          </View>
        </View>

        {/* Pending-sync banner */}
        {pendingCount > 0 ? (
          <OfflineBanner
            pendingCount={pendingCount}
            onPress={() => router.push('/sync-queue')}
            style={styles.bannerSpacing}
          />
        ) : null}

        {/* Quick actions */}
        <View style={styles.section}>
          <SectionLabel style={{ marginBottom: 12 }}>Quick actions</SectionLabel>
          <View style={styles.quickGrid}>
            {QUICK_ACTIONS.map((q) => (
              <Pressable key={q.title} style={styles.quickCard} onPress={() => router.push(q.href)}>
                <View style={styles.quickIcon}>
                  <Icon name={q.icon} size={24} color={colors.accent} />
                </View>
                <Text size={14} weight="600">
                  {q.title}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Today's tasks */}
        <View style={[styles.section, styles.tasksHeader]}>
          <SectionLabel>Today’s tasks</SectionLabel>
          <Pressable onPress={() => router.push('/(staff)/(orders)')}>
            <Text size={12} weight="700" color={colors.accent}>
              View all
            </Text>
          </Pressable>
        </View>
        <View style={styles.tasks}>
          {tasks.length === 0 ? (
            <Text size={13} color={colors.muted} align="center" style={{ marginTop: 8 }}>
              All clear — nothing waiting right now.
            </Text>
          ) : (
            tasks.map((t) => (
              <TaskCard
                key={t.key}
                task={t}
                onPress={() =>
                  router.push(t.key === 'low-stock' ? '/(staff)/(inventory)' : '/(staff)/(orders)')
                }
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function TaskCard({ task, onPress }: { task: Task; onPress: () => void }) {
  return (
    <Pressable style={styles.taskCard} onPress={onPress}>
      <View style={[styles.taskIcon, { backgroundColor: task.tone }]}>
        <Icon name={task.icon} size={22} color={colors.label} />
      </View>
      <View style={{ flex: 1 }}>
        <Text size={14} weight="600">
          {task.title}
        </Text>
        <Text size={11.5} color={colors.muted} style={{ marginTop: 2 }}>
          {task.sub}
        </Text>
      </View>
      <Text size={12} weight="700" color={colors.accent}>
        {task.action}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.officeCanvas },
  scroll: { paddingBottom: 100 },
  hero: {
    backgroundColor: colors.darkHero,
    paddingHorizontal: 20,
    paddingBottom: 22,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
  },
  heroTop: { flexDirection: 'row', alignItems: 'flex-start' },
  heroTitle: { lineHeight: 30, marginTop: 3 },
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
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.surfaceDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statRow: { flexDirection: 'row', gap: 10, marginTop: 18 },
  bannerSpacing: { marginHorizontal: 20, marginTop: 14 },
  section: { paddingHorizontal: 20, paddingTop: 18 },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  quickCard: {
    flexBasis: '47%',
    flexGrow: 1,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderCurve: 'continuous',
    padding: 16,
    gap: 12,
  },
  quickIcon: {
    width: 44,
    height: 44,
    borderRadius: radii.chip,
    backgroundColor: colors.officeCanvas,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tasksHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tasks: { paddingHorizontal: 20, paddingTop: 12, gap: 12 },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderCurve: 'continuous',
    padding: 14,
  },
  taskIcon: {
    width: 44,
    height: 44,
    borderRadius: radii.chip,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
