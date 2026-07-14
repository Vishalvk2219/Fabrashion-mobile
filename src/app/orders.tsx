import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, Loader, Text } from '@/components/ui';
import { toneFor } from '@/features/catalog/model';
import { useOrders } from '@/features/orders/hooks';
import type { Order, OrderStatus } from '@/features/orders/schema';
import { useTrials } from '@/features/trial/hooks';
import type { Trial, TrialStatus } from '@/features/trial/schema';
import { formatDayChip, formatSlot } from '@/lib/dates';
import { formatPaiseCompact } from '@/lib/money';
import { colors } from '@/theme/colors';

const TABS = ['Active', 'Delivered', 'Cancelled', 'Try at Home'] as const;
type Tab = (typeof TABS)[number];

type Group = 'Active' | 'Delivered' | 'Cancelled';
const STATUS_META: Record<OrderStatus, { label: string; tone: 'gold' | 'green' | 'grey'; group: Group }> = {
  PENDING: { label: 'Order Placed', tone: 'gold', group: 'Active' },
  PAID: { label: 'Confirmed', tone: 'gold', group: 'Active' },
  FULFILLING: { label: 'Preparing', tone: 'gold', group: 'Active' },
  SHIPPED: { label: 'Shipped', tone: 'gold', group: 'Active' },
  DELIVERED: { label: 'Delivered', tone: 'green', group: 'Delivered' },
  CANCELLED: { label: 'Cancelled', tone: 'grey', group: 'Cancelled' },
  REFUNDED: { label: 'Refunded', tone: 'grey', group: 'Cancelled' },
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function StatusBadge({ label, tone }: { label: string; tone: 'gold' | 'green' | 'grey' }) {
  const bg = tone === 'green' ? colors.okBg : tone === 'grey' ? colors.surface : colors.accentSoft;
  const fg = tone === 'green' ? colors.okFg : tone === 'grey' ? colors.muted : colors.accent;
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text weight="700" size={11} color={fg}>
        {label}
      </Text>
    </View>
  );
}

function OrderCard({ order }: { order: Order }) {
  const first = order.items[0];
  const extra = order.itemCount - 1;
  const meta = STATUS_META[order.status];
  const delivered = meta.group === 'Delivered';
  return (
    <View style={styles.card}>
      <View style={styles.cardHead}>
        <View>
          <Text weight="700" size={12}>
            #{order.id.slice(0, 8).toUpperCase()}
          </Text>
          <Text size={11} muted style={{ marginTop: 1 }}>
            Placed {fmtDate(order.placedAt ?? order.createdAt)}
          </Text>
        </View>
        <StatusBadge label={meta.label} tone={meta.tone} />
      </View>
      <View style={styles.cardBody}>
        <View style={[styles.thumb, { backgroundColor: first ? toneFor(first.productId) : colors.surface }]} />
        <View style={{ flex: 1 }}>
          <Text weight="600" size={13}>
            {first?.name ?? 'Order'}
          </Text>
          <Text size={11} muted style={{ marginTop: 2 }}>
            {extra > 0 ? `+ ${extra} more item${extra > 1 ? 's' : ''}` : '1 item'}
          </Text>
          <Text weight="700" size={13} style={{ marginTop: 6 }}>
            {formatPaiseCompact(order.totalPaise)}
          </Text>
        </View>
      </View>
      <View style={styles.cardActions}>
        {delivered ? (
          <>
            <Pressable style={styles.outlineAction} hitSlop={{ top: 6, bottom: 6 }}>
              <Text weight="600" size={13}>
                Buy Again
              </Text>
            </Pressable>
            <Pressable style={styles.outlineAction} hitSlop={{ top: 6, bottom: 6 }} onPress={() => router.push('/reviews')}>
              <Text weight="600" size={13}>
                Rate
              </Text>
            </Pressable>
          </>
        ) : (
          <>
            <Pressable
              style={styles.solidAction}
              hitSlop={{ top: 6, bottom: 6 }}
              onPress={() => router.push({ pathname: '/order-tracking', params: { id: order.id } })}>
              <Text weight="600" size={13} color={colors.onPrimary}>
                Track Order
              </Text>
            </Pressable>
            <Pressable style={styles.outlineAction} hitSlop={{ top: 6, bottom: 6 }}>
              <Icon name="receipt_long" size={17} color={colors.label} />
              <Text weight="600" size={13}>
                Invoice
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}

const TRIAL_STATUS_META: Record<TrialStatus, { label: string; tone: 'gold' | 'green' | 'grey' }> = {
  REQUESTED: { label: 'Booking Requested', tone: 'gold' },
  CONFIRMED: { label: 'Confirmed', tone: 'gold' },
  OUT_FOR_TRIAL: { label: 'On its way', tone: 'gold' },
  IN_TRIAL: { label: 'Trial in progress', tone: 'green' },
  COMPLETED: { label: 'Completed', tone: 'grey' },
  CANCELLED: { label: 'Cancelled', tone: 'grey' },
};

function TrialCard({ trial }: { trial: Trial }) {
  const first = trial.items[0];
  const meta = TRIAL_STATUS_META[trial.status];
  const chip = formatDayChip(trial.slotStart.slice(0, 10));
  const actionable = trial.status === 'IN_TRIAL';
  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push({ pathname: '/trial/[id]', params: { id: trial.id } })}>
      <View style={styles.cardHead}>
        <View>
          <Text weight="700" size={12}>
            #{trial.id.slice(0, 8).toUpperCase()}
          </Text>
          <Text size={11} muted style={{ marginTop: 1 }}>
            {chip.label} {chip.day} · {formatSlot(trial.slotStart, trial.slotEnd)}
          </Text>
        </View>
        <StatusBadge label={meta.label} tone={meta.tone} />
      </View>
      <View style={styles.cardBody}>
        <View style={[styles.thumb, { backgroundColor: toneFor(first?.productId ?? trial.id) }]} />
        <View style={{ flex: 1 }}>
          {first?.brand ? (
            <Text uppercase size={9} track={0.1} color={colors.faint}>
              {first.brand}
            </Text>
          ) : null}
          <Text weight="600" size={13} style={{ marginTop: 2 }}>
            {first?.name ?? 'Trial booking'}
            {trial.itemCount > 1 ? ` +${trial.itemCount - 1} more` : ''}
          </Text>
          <Text size={11} muted style={{ marginTop: 6 }}>
            {actionable
              ? 'Delivered — choose what to keep'
              : `Refundable hold ${formatPaiseCompact(trial.authAmountPaise)}`}
          </Text>
        </View>
        <Icon name="chevron_right" size={20} color={colors.disabled} />
      </View>
    </Pressable>
  );
}

function EmptyTab({ icon, title, message }: { icon: 'receipt_long' | 'checkroom'; title: string; message: string }) {
  return (
    <View style={styles.emptyTab}>
      <View style={styles.emptyCircle}>
        <Icon name={icon} size={44} weight={300} color={colors.accent} />
      </View>
      <Text serif weight="600" size={24} align="center" style={{ marginTop: 24 }}>
        {title}
      </Text>
      <Text muted size={13} align="center" style={{ marginTop: 8, maxWidth: 250, lineHeight: 21 }}>
        {message}
      </Text>
    </View>
  );
}

export default function OrdersScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ tab?: string }>();
  const initial = (TABS.find((t) => t === params.tab) ?? 'Active') as Tab;
  const [tab, setTab] = useState<Tab>(initial);

  const { data, isLoading } = useOrders();
  const orders = data?.data ?? [];
  const { data: trialsData, isLoading: trialsLoading } = useTrials();
  const trials = trialsData?.data ?? [];

  const byGroup = (g: Group) => orders.filter((o) => STATUS_META[o.status].group === g);
  const activeOrders = byGroup('Active');
  const deliveredOrders = byGroup('Delivered');
  const cancelledOrders = byGroup('Cancelled');

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable style={styles.back} onPress={() => router.back()} hitSlop={6}>
          <Icon name="arrow_back" size={22} color={colors.label} />
        </Pressable>
        <Text serif weight="600" size={24}>
          My Orders
        </Text>
      </View>

      <View style={styles.tabsWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
          {TABS.map((t) => {
            const active = t === tab;
            return (
              <Pressable key={t} onPress={() => setTab(t)} style={[styles.tab, active && styles.tabActive]}>
                <Text weight="600" size={13} color={active ? colors.label : colors.muted2}>
                  {t}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {isLoading && tab !== 'Try at Home' ? <Loader /> : null}
        {trialsLoading && tab === 'Try at Home' ? <Loader /> : null}
        {!isLoading &&
          tab === 'Active' &&
          (activeOrders.length ? (
            activeOrders.map((o) => <OrderCard key={o.id} order={o} />)
          ) : (
            <EmptyTab
              icon="receipt_long"
              title="No active orders"
              message="When you place an order, it will appear here for easy tracking."
            />
          ))}
        {!isLoading &&
          tab === 'Delivered' &&
          (deliveredOrders.length ? (
            deliveredOrders.map((o) => <OrderCard key={o.id} order={o} />)
          ) : (
            <EmptyTab icon="receipt_long" title="Nothing delivered yet" message="Your delivered orders will show up here." />
          ))}
        {!isLoading &&
          tab === 'Cancelled' &&
          (cancelledOrders.length ? (
            cancelledOrders.map((o) => <OrderCard key={o.id} order={o} />)
          ) : (
            <EmptyTab icon="receipt_long" title="No cancelled orders" message="Cancelled orders will appear here." />
          ))}
        {!trialsLoading &&
          tab === 'Try at Home' &&
          (trials.length ? (
            trials.map((t) => <TrialCard key={t.id} trial={t} />)
          ) : (
            <EmptyTab
              icon="checkroom"
              title="No trials yet"
              message="Book a Try at Home from any product to try pieces before you buy."
            />
          ))}
      </ScrollView>
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
  tabsWrap: { backgroundColor: colors.background },
  tabs: { gap: 22, paddingHorizontal: 20, paddingTop: 14 },
  tab: { paddingBottom: 12, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: colors.label },
  scroll: { padding: 20, paddingBottom: 24 },
  card: {
    backgroundColor: colors.background,
    borderRadius: 18,
    borderCurve: 'continuous',
    padding: 16,
    marginBottom: 14,
  },
  cardHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
  badge: { paddingVertical: 5, paddingHorizontal: 12, borderRadius: 20 },
  cardBody: { flexDirection: 'row', gap: 12, paddingVertical: 12 },
  thumb: { width: 52, height: 64, borderRadius: 10 },
  cardActions: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
  },
  solidAction: {
    flex: 1,
    height: 44,
    backgroundColor: colors.primary,
    borderRadius: 12,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineAction: {
    flex: 1,
    height: 44,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    borderCurve: 'continuous',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  emptyTab: { alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
