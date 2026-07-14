import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SectionLabel, toneFor } from '@/components/backoffice/parts';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useStaffInventoryView } from '@/features/staff/hooks';
import { selectPendingCount, useStaffStore } from '@/features/staff/store';
import { timeAgo } from '@/lib/dates';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/tokens';

/** "floor +1 · counter −1" summary of one queued op. */
const deltasLine = (deltas: Record<string, number | undefined>): string =>
  Object.entries(deltas)
    .filter((e): e is [string, number] => typeof e[1] === 'number' && e[1] !== 0)
    .map(([k, v]) => `${k} ${v > 0 ? '+' : '−'}${Math.abs(v)}`)
    .join(' · ');

export default function SyncQueue() {
  const insets = useSafeAreaInsets();
  const { rows } = useStaffInventoryView();
  const queue = useStaffStore((s) => s.queue);
  const online = useStaffStore((s) => s.online);
  const flushing = useStaffStore((s) => s.flushing);
  const flush = useStaffStore((s) => s.flush);
  const pendingCount = useStaffStore(selectPendingCount);

  const synced = pendingCount === 0;
  const badgeBg = synced ? colors.okBg : colors.warnBg;
  const badgeFg = synced ? colors.okFg : colors.warnFg;
  const badgeIcon = synced ? 'cloud_done' : online ? 'cloud_sync' : 'cloud_off';
  const badgeText = synced
    ? 'All changes synced'
    : `${online ? 'Syncing' : 'Offline'} · ${pendingCount} pending`;

  const itemFor = (variantId: string) => rows.find((r) => r.variantId === variantId);

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable style={styles.back} onPress={() => router.back()} hitSlop={6}>
          <Icon name="arrow_back" size={22} color={colors.label} />
        </Pressable>
        <Text serif weight="600" size={24}>
          Sync Status
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.statusCard, { backgroundColor: badgeBg }]}>
          <View style={styles.statusIcon}>
            <Icon name={badgeIcon} size={28} fill color={badgeFg} />
          </View>
          <View style={{ flex: 1 }}>
            <Text size={16} weight="700">
              {badgeText}
            </Text>
            <Text size={12} color={colors.label2} style={{ marginTop: 2 }}>
              Local changes are safe on this device and upload automatically once connected.
              Uploads apply exactly once, even if a sync retries.
            </Text>
          </View>
        </View>

        <SectionLabel style={{ marginBottom: 12 }}>Change queue</SectionLabel>
        {queue.length === 0 ? (
          <Text size={13} color={colors.muted} align="center" style={{ marginTop: 24 }}>
            Nothing waiting — every change is on the server.
          </Text>
        ) : (
          <View style={{ gap: 10 }}>
            {queue.map((op) => {
              const item = itemFor(op.variantId);
              return (
                <View key={op.eventId} style={styles.row}>
                  <View
                    style={[
                      styles.thumb,
                      { backgroundColor: item?.colorHex ?? toneFor(item?.sku ?? op.variantId) },
                    ]}
                  />
                  <View style={{ flex: 1 }}>
                    <Text size={13} weight="600">
                      {item ? `${item.name} · ${item.size}` : 'Inventory item'}
                    </Text>
                    <Text size={11} color={colors.muted} style={{ marginTop: 2 }}>
                      {deltasLine(op.deltas)} · queued {timeAgo(new Date(op.queuedAt).toISOString())}
                    </Text>
                  </View>
                  <View style={styles.syncDot}>
                    <View style={[styles.dot, { backgroundColor: colors.warnFg }]} />
                    <Text size={11} weight="700" color={colors.warnFg}>
                      Pending
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable
          style={[styles.cta, flushing && { opacity: 0.6 }]}
          disabled={flushing}
          onPress={() => void flush()}>
          <Icon name="cloud_sync" size={20} color={colors.onPrimary} />
          <Text size={15} weight="600" color={colors.onPrimary}>
            {flushing ? 'Syncing…' : 'Sync Now'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.officeCanvas },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  back: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: radii.card,
    borderCurve: 'continuous',
    padding: 20,
    marginBottom: 20,
  },
  statusIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.background,
    borderRadius: radii.md,
    borderCurve: 'continuous',
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  thumb: { width: 38, height: 48, borderRadius: 8, borderCurve: 'continuous' },
  syncDot: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  cta: {
    height: 54,
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    borderCurve: 'continuous',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});
