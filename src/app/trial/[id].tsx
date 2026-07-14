import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ApiError } from '@/api/client';
import { EmptyState, Icon, Loader, Text } from '@/components/ui';
import { toneFor } from '@/features/catalog/model';
import { useCancelTrial, useTrial, useTrialOutcome } from '@/features/trial/hooks';
import type { TrialItem, TrialStatus } from '@/features/trial/schema';
import { formatDayChip, formatSlot, timeAgo } from '@/lib/dates';
import { formatPaiseCompact } from '@/lib/money';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/tokens';

const TIMELINE: { status: TrialStatus; label: string }[] = [
  { status: 'REQUESTED', label: 'Requested' },
  { status: 'CONFIRMED', label: 'Confirmed' },
  { status: 'OUT_FOR_TRIAL', label: 'On its way' },
  { status: 'IN_TRIAL', label: 'Delivered' },
  { status: 'COMPLETED', label: 'Completed' },
];

type Decision = 'KEPT' | 'RETURNED';

/** Booking detail: status timeline + the keep/return flow while the trial window is open. */
export default function TrialDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: trial, isPending, isError, refetch } = useTrial(id ?? '');
  const outcome = useTrialOutcome(id ?? '');
  const cancel = useCancelTrial(id ?? '');
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});
  const [error, setError] = useState<string | null>(null);

  if (isPending) {
    return (
      <View style={styles.root}>
        <Header top={insets.top} />
        <Loader label="Loading your trial…" />
      </View>
    );
  }
  if (isError || !trial) {
    return (
      <View style={styles.root}>
        <Header top={insets.top} />
        <EmptyState
          icon="cloud_off"
          title="Can't load this trial"
          message="Check your connection and try again."
          action={
            <Pressable style={styles.cta} onPress={() => void refetch()}>
              <Text weight="600" size={15} color={colors.onPrimary}>
                Retry
              </Text>
            </Pressable>
          }
        />
      </View>
    );
  }

  const cancelled = trial.status === 'CANCELLED';
  const completed = trial.status === 'COMPLETED';
  const deciding = trial.status === 'IN_TRIAL';
  const cancellable = trial.status === 'REQUESTED' || trial.status === 'CONFIRMED';
  const reachedIdx = TIMELINE.findIndex((t) => t.status === trial.status);
  const chip = formatDayChip(trial.slotStart.slice(0, 10));
  const allDecided = trial.items.every((i) => decisions[i.trialItemId]);
  const keepTotal = trial.items
    .filter((i) => decisions[i.trialItemId] === 'KEPT')
    .reduce((s, i) => s + i.unitPricePaise * i.quantity, 0);

  const submitOutcomes = () => {
    setError(null);
    outcome.mutate(
      {
        items: trial.items.map((i) => ({
          trialItemId: i.trialItemId,
          outcome: decisions[i.trialItemId]!,
        })),
      },
      {
        onError: (err) =>
          setError(err instanceof ApiError ? err.message : 'Could not reach the server. Try again.'),
      },
    );
  };

  const cancelBooking = () => {
    setError(null);
    cancel.mutate(undefined, {
      onError: (err) =>
        setError(err instanceof ApiError ? err.message : 'Could not reach the server. Try again.'),
    });
  };

  return (
    <View style={styles.root}>
      <Header top={insets.top} sub={`#${trial.id.slice(0, 8).toUpperCase()}`} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Timeline */}
        {cancelled ? (
          <View style={[styles.noticeCard, { backgroundColor: colors.surface }]}>
            <Icon name="block" size={22} color={colors.muted} />
            <Text size={13} color={colors.label2} style={{ flex: 1 }}>
              This booking was cancelled.
              {trial.refundPaise > 0
                ? ` ${formatPaiseCompact(trial.refundPaise)} will be refunded.`
                : ''}
            </Text>
          </View>
        ) : (
          <View style={styles.timeline}>
            {TIMELINE.map((step, i) => {
              const done = i <= reachedIdx;
              return (
                <View key={step.status} style={styles.timelineStep}>
                  <View style={[styles.timelineDot, done && styles.timelineDotDone]}>
                    {done ? <Icon name="check" size={12} color={colors.onPrimary} /> : null}
                  </View>
                  <Text
                    size={10}
                    weight={done ? '700' : '500'}
                    color={done ? colors.label : colors.muted2}
                    align="center">
                    {step.label}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Logistics */}
        <View style={styles.infoCard}>
          <Row icon="event" text={`${chip.label} ${chip.day} · ${formatSlot(trial.slotStart, trial.slotEnd)}`} />
          {trial.store ? <Row icon="storefront" text={`Fulfilled by ${trial.store.name}`} /> : null}
          <Row
            icon="account_balance_wallet"
            text={`Trial hold ${formatPaiseCompact(trial.authAmountPaise)} · ${trial.paid ? 'charged, refundable' : 'payment pending'}`}
          />
          {deciding && trial.trialEndsAt ? (
            <Row icon="hourglass_top" text={`Decide by ${new Date(trial.trialEndsAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })} — undecided pieces are returned`} />
          ) : null}
          {completed ? (
            <>
              {trial.refundPaise > 0 ? (
                <Row icon="currency_rupee" text={`${formatPaiseCompact(trial.refundPaise)} refunded for returns`} />
              ) : null}
              {trial.conversionOrderId ? (
                <Pressable
                  style={styles.orderLink}
                  onPress={() =>
                    router.push({ pathname: '/order-tracking', params: { id: trial.conversionOrderId! } })
                  }>
                  <Icon name="receipt_long" size={20} color={colors.accent} />
                  <Text weight="600" size={13} color={colors.accent} style={{ flex: 1 }}>
                    View the order for your kept pieces
                  </Text>
                  <Icon name="chevron_right" size={18} color={colors.accent} />
                </Pressable>
              ) : null}
            </>
          ) : null}
        </View>

        {/* Pieces */}
        <Text weight="700" size={13} style={styles.sectionLabel}>
          {deciding ? 'Choose what to keep' : 'Pieces'}
        </Text>
        <View style={{ gap: 10 }}>
          {trial.items.map((item) => (
            <PieceCard
              key={item.trialItemId}
              item={item}
              decision={deciding ? decisions[item.trialItemId] : undefined}
              deciding={deciding}
              onDecide={(d) => setDecisions((prev) => ({ ...prev, [item.trialItemId]: d }))}
            />
          ))}
        </View>

        {error ? (
          <Text size={12.5} color={colors.dangerFg} style={{ marginTop: 14 }}>
            {error}
          </Text>
        ) : null}
        <Text size={11} color={colors.faint} style={{ marginTop: 16 }}>
          Booked {timeAgo(trial.createdAt)}
        </Text>
      </ScrollView>

      {/* Footer action */}
      {deciding || cancellable ? (
        <View style={[styles.bar, { paddingBottom: insets.bottom + 16 }]}>
          {deciding ? (
            <Pressable
              style={[styles.cta, (!allDecided || outcome.isPending) && { opacity: 0.5 }]}
              disabled={!allDecided || outcome.isPending}
              onPress={submitOutcomes}>
              <Text weight="600" size={15} color={colors.onPrimary}>
                {outcome.isPending
                  ? 'Completing…'
                  : allDecided
                    ? `Complete Trial · keep ${formatPaiseCompact(keepTotal)}`
                    : 'Decide every piece to continue'}
              </Text>
            </Pressable>
          ) : (
            <Pressable
              style={[styles.cancelBtn, cancel.isPending && { opacity: 0.5 }]}
              disabled={cancel.isPending}
              onPress={cancelBooking}>
              <Text weight="600" size={15} color={colors.dangerFg}>
                {cancel.isPending ? 'Cancelling…' : 'Cancel Booking'}
              </Text>
            </Pressable>
          )}
        </View>
      ) : null}
    </View>
  );
}

function PieceCard({
  item,
  decision,
  deciding,
  onDecide,
}: {
  item: TrialItem;
  decision?: Decision;
  deciding: boolean;
  onDecide: (d: Decision) => void;
}) {
  return (
    <View style={styles.pieceCard}>
      <View style={styles.pieceTop}>
        <View style={[styles.thumb, { backgroundColor: item.colorHex ?? toneFor(item.productId) }]} />
        <View style={{ flex: 1 }}>
          {item.brand ? (
            <Text uppercase size={9} track={0.1} color={colors.faint}>
              {item.brand}
            </Text>
          ) : null}
          <Text weight="600" size={13} style={{ marginTop: 2 }}>
            {item.name}
          </Text>
          <Text size={11} muted style={{ marginTop: 3 }}>
            Size {item.size} · {item.colorName} · {formatPaiseCompact(item.unitPricePaise)}
          </Text>
          {!deciding && item.outcome !== 'PENDING' ? (
            <Text
              size={11}
              weight="700"
              color={item.outcome === 'KEPT' ? colors.okFg : colors.muted}
              style={{ marginTop: 4 }}>
              {item.outcome === 'KEPT' ? 'Kept' : 'Returned'}
            </Text>
          ) : null}
        </View>
      </View>
      {deciding ? (
        <View style={styles.decideRow}>
          <Pressable
            style={[styles.decideBtn, decision === 'KEPT' && styles.decideKeep]}
            hitSlop={{ top: 6, bottom: 6 }}
            onPress={() => onDecide('KEPT')}>
            <Icon name="check_circle" size={17} color={decision === 'KEPT' ? colors.onPrimary : colors.label} />
            <Text weight="600" size={13} color={decision === 'KEPT' ? colors.onPrimary : colors.label}>
              Keep
            </Text>
          </Pressable>
          <Pressable
            style={[styles.decideBtn, decision === 'RETURNED' && styles.decideReturn]}
            hitSlop={{ top: 6, bottom: 6 }}
            onPress={() => onDecide('RETURNED')}>
            <Icon name="undo" size={17} color={decision === 'RETURNED' ? colors.onPrimary : colors.label} />
            <Text weight="600" size={13} color={decision === 'RETURNED' ? colors.onPrimary : colors.label}>
              Return
            </Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

function Row({ icon, text }: { icon: React.ComponentProps<typeof Icon>['name']; text: string }) {
  return (
    <View style={styles.infoRow}>
      <Icon name={icon} size={20} color={colors.accent} />
      <Text size={12.5} color={colors.label2} style={{ flex: 1, lineHeight: 18 }}>
        {text}
      </Text>
    </View>
  );
}

function Header({ top, sub }: { top: number; sub?: string }) {
  return (
    <View style={[styles.header, { paddingTop: top + 8 }]}>
      <Pressable style={styles.back} onPress={() => router.back()} hitSlop={6}>
        <Icon name="arrow_back" size={22} color={colors.label} />
      </Pressable>
      <View>
        <Text serif weight="600" size={24}>
          Trial Booking
        </Text>
        {sub ? (
          <Text size={11} color={colors.muted2}>
            {sub}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.backgroundAlt },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: colors.background,
  },
  back: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { padding: 20, paddingBottom: 32 },
  timeline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderRadius: radii.card,
    borderCurve: 'continuous',
    padding: 16,
    marginBottom: 14,
  },
  timelineStep: { flex: 1, alignItems: 'center', gap: 6 },
  timelineDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineDotDone: { backgroundColor: colors.primary, borderColor: colors.primary },
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: radii.md,
    borderCurve: 'continuous',
    padding: 14,
    marginBottom: 14,
  },
  infoCard: {
    backgroundColor: colors.background,
    borderRadius: radii.card,
    borderCurve: 'continuous',
    padding: 16,
    gap: 12,
    marginBottom: 18,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  orderLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.accentSoft,
    borderRadius: radii.md,
    borderCurve: 'continuous',
    padding: 12,
  },
  sectionLabel: { marginBottom: 12 },
  pieceCard: {
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    borderCurve: 'continuous',
    padding: 12,
  },
  pieceTop: { flexDirection: 'row', gap: 12 },
  thumb: { width: 56, height: 70, borderRadius: 10, borderCurve: 'continuous' },
  decideRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  decideBtn: {
    flex: 1,
    height: 42,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radii.chip,
    borderCurve: 'continuous',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: colors.background,
  },
  decideKeep: { backgroundColor: colors.primary, borderColor: colors.primary },
  decideReturn: { backgroundColor: colors.muted, borderColor: colors.muted },
  bar: {
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtn: {
    height: 54,
    borderWidth: 1.5,
    borderColor: colors.dangerOutline,
    backgroundColor: colors.background,
    borderRadius: radii.md,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
