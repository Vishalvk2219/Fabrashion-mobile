import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, Loader, PressableScale, Text } from '@/components/ui';
import { toneFor } from '@/features/catalog/model';
import { useCart, useRemoveCartItem, useUpdateCartItem } from '@/features/cart/hooks';
import type { CartLine } from '@/features/cart/schema';
import { bump, select, tap } from '@/lib/haptics';
import { formatPaiseCompact } from '@/lib/money';
import { colors } from '@/theme/colors';

function QtyStepper({ line }: { line: CartLine }) {
  const update = useUpdateCartItem();
  const setQty = (qty: number) => {
    select(); // discrete quantity change
    update.mutate({ itemId: line.itemId, quantity: qty });
  };
  const atMax = line.qty >= line.availableQty;
  return (
    <View style={styles.stepper}>
      <PressableScale scaleTo={0.85} onPress={() => setQty(line.qty - 1)} hitSlop={6}>
        <Icon name="remove" size={18} color={colors.label} />
      </PressableScale>
      <Text weight="700" size={13} style={styles.qty}>
        {line.qty}
      </Text>
      <PressableScale scaleTo={0.85} onPress={() => setQty(line.qty + 1)} hitSlop={6} disabled={atMax}>
        <Icon name="add" size={18} color={atMax ? colors.disabled : colors.label} />
      </PressableScale>
    </View>
  );
}

function LineCard({ line }: { line: CartLine }) {
  const remove = useRemoveCartItem();
  return (
    <View style={styles.lineCard}>
      <View style={[styles.lineThumb, { backgroundColor: toneFor(line.productId) }]}>
        {line.imageUrl ? (
          <Image source={line.imageUrl} style={StyleSheet.absoluteFill} contentFit="cover" />
        ) : null}
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.lineTop}>
          {line.brand ? (
            <Text uppercase size={9} track={0.1} color={colors.faint}>
              {line.brand}
            </Text>
          ) : (
            <View />
          )}
          <PressableScale
            scaleTo={0.85}
            onPress={() => {
              bump(); // destructive — a touch more weight than a routine tap
              remove.mutate(line.itemId);
            }}
            hitSlop={6}>
            <Icon name="delete" size={18} color={colors.disabled} />
          </PressableScale>
        </View>
        <Text weight="600" size={13} numberOfLines={1} style={{ marginTop: 2 }}>
          {line.name}
        </Text>
        <View style={styles.variantRow}>
          <Text size={11} muted>
            Size {line.size} · {line.colorName}
          </Text>
          {line.colorHex ? <View style={[styles.colorDot, { backgroundColor: line.colorHex }]} /> : null}
        </View>
        <View style={styles.lineBottom}>
          <QtyStepper line={line} />
          <Text weight="700" size={15}>
            {formatPaiseCompact(line.lineTotalPaise)}
          </Text>
        </View>
      </View>
    </View>
  );
}

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

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const { data: cart, isLoading } = useCart();
  const lines = cart?.lines ?? [];
  const totals = cart?.totals;

  if (isLoading) return <Loader />;

  if (lines.length === 0) {
    return (
      <View style={[styles.empty, { paddingTop: insets.top }]}>
        <View style={styles.emptyCircle}>
          <Icon name="shopping_bag" size={48} weight={300} color={colors.accent} />
        </View>
        <Text serif weight="600" size={28} align="center" style={{ marginTop: 26 }}>
          Your bag is empty
        </Text>
        <Text muted size={14} align="center" style={styles.emptyMsg}>
          Discover timeless pieces and add your favourites to the bag.
        </Text>
        <Pressable style={styles.startBtn} onPress={() => router.push('/')}>
          <Text weight="600" size={15} color={colors.onPrimary}>
            Start Shopping
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable style={styles.back} onPress={() => router.push('/')} hitSlop={6}>
          <Icon name="arrow_back" size={22} color={colors.label} />
        </Pressable>
        <Text serif weight="600" size={24}>
          Shopping Bag
        </Text>
        <Text size={13} muted style={{ marginLeft: 'auto' }}>
          {totals?.count} items
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {lines.map((line) => (
          <LineCard key={line.itemId} line={line} />
        ))}

        <Pressable style={styles.couponRow} onPress={() => router.push('/coupons')}>
          <Icon name="sell" size={22} color={colors.accent} />
          <Text size={13} muted style={{ flex: 1 }}>
            Apply coupon code
          </Text>
          <Text weight="700" size={12} color={colors.accent}>
            VIEW ALL
          </Text>
        </Pressable>

        {totals ? (
          <View style={styles.summary}>
            <Text serif weight="600" size={19} style={{ marginBottom: 14 }}>
              Price Details
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
                Total
              </Text>
              <Text weight="700" size={20}>
                {formatPaiseCompact(totals.totalPaise)}
              </Text>
            </View>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.bar}>
        <View>
          <Text size={11} muted>
            Total
          </Text>
          <Text weight="700" size={18}>
            {formatPaiseCompact(totals?.totalPaise ?? 0)}
          </Text>
        </View>
        <PressableScale
          style={styles.checkoutBtn}
          onPressIn={tap}
          onPress={() => router.push('/checkout')}>
          <Text weight="600" size={15} color={colors.onPrimary}>
            Checkout
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
  lineCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.background,
    borderRadius: 18,
    borderCurve: 'continuous',
    padding: 12,
    marginBottom: 12,
  },
  lineThumb: { width: 70, height: 90, borderRadius: 12, overflow: 'hidden' },
  lineTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  variantRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 3 },
  colorDot: { width: 10, height: 10, borderRadius: 5 },
  lineBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  qty: { minWidth: 14, textAlign: 'center' },
  couponRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },
  summary: { backgroundColor: colors.background, borderRadius: 18, borderCurve: 'continuous', padding: 18 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  totalDivider: { borderTopWidth: 1, borderTopColor: colors.hairline, paddingTop: 12, marginTop: 2 },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  checkoutBtn: {
    flex: 1,
    height: 54,
    backgroundColor: colors.primary,
    borderRadius: 14,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyCircle: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyMsg: { marginTop: 10, lineHeight: 22, maxWidth: 300 },
  startBtn: {
    marginTop: 28,
    paddingVertical: 15,
    paddingHorizontal: 34,
    backgroundColor: colors.primary,
    borderRadius: 14,
    borderCurve: 'continuous',
  },
});
