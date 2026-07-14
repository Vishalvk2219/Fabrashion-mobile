import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, PressableScale, Text } from '@/components/ui';
import { useDefaultAddress } from '@/features/address/hooks';
import { useCart } from '@/features/cart/hooks';
import { useCheckout, useConfirmOrderDev } from '@/features/checkout/hooks';
import { failure, success } from '@/lib/haptics';
import { formatPaiseCompact } from '@/lib/money';
import { colors } from '@/theme/colors';
import type { IconName } from '@/theme/material-icons';

/** In-app method chooser (routed through PhonePe PG). COD is intentionally excluded — plan 13. */
const METHODS: { k: string; icon: IconName; title: string; sub: string }[] = [
  { k: 'upi', icon: 'account_balance_wallet', title: 'UPI', sub: 'GPay · PhonePe · Paytm' },
  { k: 'card', icon: 'credit_card', title: 'Credit / Debit Card', sub: 'Visa, Mastercard, Amex' },
  { k: 'net', icon: 'account_balance', title: 'Net Banking', sub: 'All major banks' },
];

function SummaryRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <View style={styles.summaryRow}>
      <Text size={13} color={colors.label2}>
        {label}
      </Text>
      <Text weight="600" size={13} color={accent ? colors.accent : colors.label}>
        {value}
      </Text>
    </View>
  );
}

export default function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const { data: cart } = useCart();
  const address = useDefaultAddress();
  const checkout = useCheckout();
  const confirmDev = useConfirmOrderDev();
  const [pay, setPay] = useState('upi');

  const totals = cart?.totals;
  const busy = checkout.isPending || confirmDev.isPending;
  const canPlace = !!address && !!totals && totals.count > 0 && !busy;

  const toSuccess = (orderId: string) => {
    success(); // consequential, rare — the order is placed & captured
    router.replace({ pathname: '/payment-success', params: { orderId } });
  };

  const place = () => {
    if (!canPlace || !address) return;
    checkout.mutate(address.id, {
      onSuccess: (order) => {
        // DEV: stand in for the PhonePe capture, then show success. Prod (4c) → PhonePe SDK.
        if (__DEV__) confirmDev.mutate(order.id, { onSuccess: () => toSuccess(order.id), onError: failure });
        else toSuccess(order.id);
      },
      onError: failure,
    });
  };

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable style={styles.back} onPress={() => router.back()} hitSlop={6}>
          <Icon name="arrow_back" size={22} color={colors.label} />
        </Pressable>
        <Text serif weight="600" size={24}>
          Checkout
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text weight="700" size={13} style={styles.sectionLabel}>
          Delivery Address
        </Text>
        <Pressable style={styles.addressCard} onPress={() => router.push('/addresses')}>
          <Icon name={address ? 'home' : 'add' } size={22} color={colors.accent} />
          <View style={{ flex: 1 }}>
            {address ? (
              <>
                <Text weight="600" size={13}>
                  {address.label} · {address.recipientName}
                </Text>
                <Text size={12} muted style={styles.addressText}>
                  {[address.line1, address.line2, `${address.city}, ${address.state} ${address.pincode}`]
                    .filter(Boolean)
                    .join(', ')}
                </Text>
              </>
            ) : (
              <Text weight="600" size={13}>
                Add a delivery address
              </Text>
            )}
          </View>
          <Text weight="600" size={12} color={colors.accent}>
            {address ? 'Change' : 'Add'}
          </Text>
        </Pressable>

        <Text weight="700" size={13} style={styles.sectionLabel}>
          Payment Method
        </Text>
        {METHODS.map((m) => {
          const selected = pay === m.k;
          return (
            <Pressable
              key={m.k}
              onPress={() => setPay(m.k)}
              style={[styles.method, { borderColor: selected ? colors.accent : colors.border }]}>
              <Icon name={m.icon} size={22} color={colors.label} />
              <View style={{ flex: 1 }}>
                <Text weight="600" size={13}>
                  {m.title}
                </Text>
                <Text size={11} muted style={{ marginTop: 1 }}>
                  {m.sub}
                </Text>
              </View>
              <Icon
                name={selected ? 'radio_button_checked' : 'radio_button_unchecked'}
                size={22}
                fill={selected}
                color={selected ? colors.accent : colors.disabled}
              />
            </Pressable>
          );
        })}

        {totals ? (
          <View style={styles.summary}>
            <Text serif weight="600" size={19} style={{ marginBottom: 14 }}>
              Order Summary
            </Text>
            <SummaryRow label="Subtotal" value={formatPaiseCompact(totals.subtotalPaise)} />
            <SummaryRow label="Discount" value={`– ${formatPaiseCompact(totals.discountPaise)}`} accent />
            <SummaryRow
              label="Delivery"
              value={totals.shippingPaise === 0 ? 'Free' : formatPaiseCompact(totals.shippingPaise)}
            />
            <View style={styles.totalDivider} />
            <View style={styles.summaryRow}>
              <Text weight="700" size={15}>
                Total Payable
              </Text>
              <Text weight="700" size={20}>
                {formatPaiseCompact(totals.totalPaise)}
              </Text>
            </View>
          </View>
        ) : null}

        {checkout.isError || confirmDev.isError ? (
          <Text size={12} color={colors.danger} align="center" style={{ marginTop: 14 }}>
            {(checkout.error ?? confirmDev.error) instanceof Error
              ? (checkout.error ?? confirmDev.error)!.message
              : 'Could not place the order. Please try again.'}
          </Text>
        ) : null}
      </ScrollView>

      <View style={[styles.bar, { paddingBottom: insets.bottom + 16 }]}>
        <PressableScale
          style={[styles.placeBtn, !canPlace && styles.placeBtnDisabled]}
          accessibilityRole="button"
          accessibilityState={{ disabled: !canPlace }}
          disabled={!canPlace}
          onPress={place}>
          <Icon name="lock" size={20} color={colors.onPrimary} />
          <Text weight="600" size={15} color={colors.onPrimary}>
            {busy ? 'Placing…' : `Place Order · ${formatPaiseCompact(totals?.totalPaise ?? 0)}`}
          </Text>
        </PressableScale>
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
    paddingBottom: 12,
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
  scroll: { padding: 20, paddingBottom: 24 },
  sectionLabel: { marginBottom: 10 },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.background,
    borderRadius: 16,
    borderCurve: 'continuous',
    padding: 16,
    marginBottom: 20,
  },
  addressText: { marginTop: 3, lineHeight: 18 },
  method: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderRadius: 16,
    borderCurve: 'continuous',
    padding: 14,
    marginBottom: 10,
  },
  summary: {
    backgroundColor: colors.background,
    borderRadius: 18,
    borderCurve: 'continuous',
    padding: 18,
    marginTop: 12,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  totalDivider: { borderTopWidth: 1, borderTopColor: colors.hairline, paddingTop: 12, marginTop: 2 },
  bar: {
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  placeBtn: {
    height: 54,
    backgroundColor: colors.primary,
    borderRadius: 14,
    borderCurve: 'continuous',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  placeBtnDisabled: { opacity: 0.45 },
});
