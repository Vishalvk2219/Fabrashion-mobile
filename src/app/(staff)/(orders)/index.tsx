import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Pill, toneFor } from '@/components/backoffice/parts';
import { EmptyState } from '@/components/ui/empty-state';
import { Icon } from '@/components/ui/icon';
import { Loader } from '@/components/ui/loader';
import { Text } from '@/components/ui/text';
import {
  useAdvanceOrder,
  useAdvanceTrial,
  useStaffOrders,
  useStaffSummary,
  useStaffTrials,
} from '@/features/staff/hooks';
import { FULFIL_STAGES, orderItemsLine, STAGE_META, TRIAL_OPS_META } from '@/features/staff/model';
import { useStaffStore } from '@/features/staff/store';
import type { StaffOrder, StaffTrial } from '@/features/staff/schema';
import { formatDayChip, formatSlot, timeAgo } from '@/lib/dates';
import { formatPaiseCompact } from '@/lib/money';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/tokens';

export default function Fulfilment() {
  const insets = useSafeAreaInsets();
  const stage = useStaffStore((s) => s.orderStage);
  const setStage = useStaffStore((s) => s.setOrderStage);
  const trialStage = stage === 'TRY_AT_HOME';
  const orderQuery = useStaffOrders(trialStage ? undefined : stage);
  const trialQuery = useStaffTrials();
  const { data: summary } = useStaffSummary();
  const advance = useAdvanceOrder();
  const advanceTrial = useAdvanceTrial();

  const { isPending, isError, refetch } = trialStage ? trialQuery : orderQuery;
  const rows = trialStage ? [] : (orderQuery.data?.data ?? []);
  const trials = trialQuery.data?.data ?? [];

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text serif weight="600" size={28}>
          Fulfilment
        </Text>
        <Text size={12} color={colors.muted2} style={{ marginTop: 2 }}>
          {summary?.store.name ?? '…'} · live queue
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabs}>
          {FULFIL_STAGES.map((s) => {
            const active = s === stage;
            return (
              <Pressable
                key={s}
                onPress={() => setStage(s)}
                style={[styles.tab, active ? styles.tabActive : styles.tabIdle]}>
                <Text size={12} weight="600" color={active ? colors.onPrimary : colors.label2}>
                  {STAGE_META[s].label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {isPending ? (
        <Loader label="Loading the queue…" />
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
          {trialStage ? (
            trials.length === 0 ? (
              <Text size={13} color={colors.muted} align="center" style={{ marginTop: 40 }}>
                No trial visits scheduled for your boutique right now.
              </Text>
            ) : (
              trials.map((t) => (
                <TrialOpsCard
                  key={t.id}
                  trial={t}
                  advancing={advanceTrial.isPending && advanceTrial.variables === t.id}
                  onAdvance={() => advanceTrial.mutate(t.id)}
                />
              ))
            )
          ) : rows.length === 0 ? (
            <Text size={13} color={colors.muted} align="center" style={{ marginTop: 40 }}>
              Nothing in “{STAGE_META[stage].label}” right now.
            </Text>
          ) : (
            rows.map((o) => (
              <OrderCard
                key={o.id}
                order={o}
                advancing={advance.isPending && advance.variables === o.id}
                onAdvance={() => advance.mutate(o.id)}
              />
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

function TrialOpsCard({
  trial,
  advancing,
  onAdvance,
}: {
  trial: StaffTrial;
  advancing: boolean;
  onAdvance: () => void;
}) {
  const meta = TRIAL_OPS_META[trial.status];
  const chip = formatDayChip(trial.slotStart.slice(0, 10));
  const awaitingPayment = trial.status === 'REQUESTED' && !trial.paid;
  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={[styles.thumb, { backgroundColor: toneFor(trial.id) }]} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <View style={styles.cardHead}>
            <Text uppercase size={9} track={0.1} color={colors.faint}>
              TRY-AT-HOME · #{trial.id.slice(0, 8)}
            </Text>
            <Pill bg={meta.bg} fg={meta.fg}>
              {meta.label}
            </Pill>
          </View>
          <Text size={15} weight="600" style={{ marginTop: 3 }}>
            {trial.customer}
          </Text>
          <Text size={12} color={colors.muted} style={{ marginTop: 2 }}>
            {orderItemsLine(trial.firstItemName, trial.itemCount)}
          </Text>
          <Text size={11} color={colors.faint} style={{ marginTop: 4 }}>
            {chip.label} {chip.day} · {formatSlot(trial.slotStart, trial.slotEnd)} · hold{' '}
            {formatPaiseCompact(trial.valuePaise)}
          </Text>
        </View>
      </View>
      {meta.action ? (
        <View style={styles.actions}>
          <Pressable
            style={[styles.markBtn, (advancing || awaitingPayment) && { opacity: 0.5 }]}
            hitSlop={{ top: 6, bottom: 6 }}
            disabled={advancing || awaitingPayment}
            onPress={onAdvance}>
            <Icon name="check_circle" size={18} color={colors.onPrimary} />
            <Text size={13} weight="600" color={colors.onPrimary}>
              {awaitingPayment ? 'Awaiting payment' : advancing ? 'Updating…' : meta.action}
            </Text>
          </Pressable>
        </View>
      ) : trial.status === 'IN_TRIAL' ? (
        <Text size={11} color={colors.muted} style={{ marginTop: 10 }}>
          Customer decides keep/return
          {trial.trialEndsAt
            ? ` by ${new Date(trial.trialEndsAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric' })}`
            : ''}{' '}
          — pickup after completion.
        </Text>
      ) : null}
    </View>
  );
}

function OrderCard({
  order,
  advancing,
  onAdvance,
}: {
  order: StaffOrder;
  advancing: boolean;
  onAdvance: () => void;
}) {
  const meta = STAGE_META[order.stage];
  const done = order.status === 'DELIVERED';
  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={[styles.thumb, { backgroundColor: toneFor(order.id) }]} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <View style={styles.cardHead}>
            <Text uppercase size={9} track={0.1} color={colors.faint}>
              #{order.id.slice(0, 8)}
            </Text>
            <Pill bg={meta.bg} fg={meta.fg}>
              {meta.label}
            </Pill>
          </View>
          <Text size={15} weight="600" style={{ marginTop: 3 }}>
            {order.customer}
          </Text>
          <Text size={12} color={colors.muted} style={{ marginTop: 2 }}>
            {orderItemsLine(order.firstItemName, order.itemCount)}
          </Text>
          <Text size={11} color={colors.faint} style={{ marginTop: 4 }}>
            {timeAgo(order.placedAt)} · {formatPaiseCompact(order.totalPaise)}
          </Text>
        </View>
      </View>
      {done ? null : (
        <View style={styles.actions}>
          <Pressable
            style={[styles.markBtn, advancing && { opacity: 0.6 }]}
            hitSlop={{ top: 6, bottom: 6 }}
            disabled={advancing}
            onPress={onAdvance}>
            <Icon name="check_circle" size={18} color={colors.onPrimary} />
            <Text size={13} weight="600" color={colors.onPrimary}>
              {advancing ? 'Updating…' : `Mark ${meta.action}`}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.officeCanvas },
  header: { backgroundColor: colors.background, paddingHorizontal: 20, paddingBottom: 8 },
  tabs: { gap: 8, marginTop: 14, paddingBottom: 2 },
  tab: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1.5,
    borderCurve: 'continuous',
  },
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
  card: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderCurve: 'continuous',
    padding: 14,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  thumb: { width: 52, height: 64, borderRadius: 10, borderCurve: 'continuous' },
  cardHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  actions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  markBtn: {
    flex: 1,
    height: 44,
    backgroundColor: colors.primary,
    borderRadius: radii.chip,
    borderCurve: 'continuous',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
});
