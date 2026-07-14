import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ApiError } from '@/api/client';
import { EmptyState, Icon, Loader, Text } from '@/components/ui';
import { useDefaultAddress } from '@/features/address/hooks';
import { useCreateTrial, useTrialEligibility } from '@/features/trial/hooks';
import { toneFor } from '@/features/catalog/model';
import { formatDayChip, formatSlot } from '@/lib/dates';
import { formatPaiseCompact } from '@/lib/money';
import { colors } from '@/theme/colors';
import { fontFamily } from '@/theme/typography';

/**
 * Book an at-home trial for the variant picked on the PDP. The server owns
 * eligibility, the serviceable boutique, and the slot grid; the full basket value
 * is held (Strategy A) and refunded for returned pieces.
 */
export default function TryHomeScreen() {
  const insets = useSafeAreaInsets();
  const { variantId } = useLocalSearchParams<{ id?: string; variantId?: string }>();
  const address = useDefaultAddress();
  const createTrial = useCreateTrial();

  const variantIds = variantId ? [variantId] : [];
  const { data: eligibility, isPending } = useTrialEligibility(variantIds, address?.id);

  const [dayIdx, setDayIdx] = useState(0);
  const [slotIdx, setSlotIdx] = useState(0);
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!variantId) {
    return (
      <View style={styles.root}>
        <Header top={insets.top} />
        <EmptyState
          icon="checkroom"
          title="Pick a piece first"
          message="Choose a size and colour on the product page, then book your trial."
        />
      </View>
    );
  }

  if (!address) {
    return (
      <View style={styles.root}>
        <Header top={insets.top} />
        <EmptyState
          icon="home"
          title="Add a delivery address"
          message="Your trial pieces are brought to your doorstep — save an address to continue."
          action={
            <Pressable style={styles.confirmBtn} onPress={() => router.push('/addresses')}>
              <Text weight="600" size={15} color={colors.onPrimary}>
                Add Address
              </Text>
            </Pressable>
          }
        />
      </View>
    );
  }

  if (isPending || !eligibility) {
    return (
      <View style={styles.root}>
        <Header top={insets.top} />
        <Loader label="Checking availability…" />
      </View>
    );
  }

  const piece = eligibility.items[0];
  const day = eligibility.slots[dayIdx] ?? eligibility.slots[0];
  const window = day?.windows[slotIdx] ?? day?.windows[0];
  const bookable =
    eligibility.addressServiceable && piece?.eligible && window?.available && !createTrial.isPending;
  const holdPaise = piece?.pricePaise ?? 0;

  const confirm = () => {
    if (!window || !piece) return;
    setError(null);
    createTrial.mutate(
      {
        items: [{ variantId: piece.variantId, qty: 1 }],
        addressId: address.id,
        slotStart: window.slotStart,
        note: note.trim() || undefined,
      },
      {
        onSuccess: () => router.replace({ pathname: '/orders', params: { tab: 'Try at Home' } }),
        onError: (err) =>
          setError(err instanceof ApiError ? err.message : 'Could not reach the server. Try again.'),
      },
    );
  };

  return (
    <View style={styles.root}>
      <Header top={insets.top} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled">
        <View style={styles.rowBetween}>
          <Text weight="700" size={13}>
            Selected Piece
          </Text>
          {eligibility.store ? (
            <Text size={12} muted>
              from {eligibility.store.name}
            </Text>
          ) : null}
        </View>

        {piece ? (
          <View style={styles.pieceCard}>
            <View style={[styles.pieceThumb, { backgroundColor: toneFor(piece.variantId) }]} />
            <View style={{ flex: 1 }}>
              <Text weight="600" size={13}>
                {piece.name}
              </Text>
              <Text size={12} muted style={{ marginTop: 4 }}>
                Size {piece.size} · {piece.colorName} · {formatPaiseCompact(piece.pricePaise)}
              </Text>
              {!piece.eligible && piece.reason ? (
                <Text size={12} color={colors.dangerFg} style={{ marginTop: 6 }}>
                  {piece.reason}
                </Text>
              ) : null}
            </View>
          </View>
        ) : null}

        {!eligibility.addressServiceable ? (
          <View style={styles.noticeCard}>
            <Icon name="info" size={22} color={colors.warnFg} />
            <Text size={12.5} color={colors.label2} style={{ flex: 1, lineHeight: 18 }}>
              No boutique services this address yet — trials are currently available around our
              store cities.
            </Text>
          </View>
        ) : null}

        <Text weight="700" size={13} style={styles.label}>
          Delivery Address
        </Text>
        <View style={styles.addressCard}>
          <Icon name="home" size={22} color={colors.accent} />
          <View style={{ flex: 1 }}>
            <Text weight="600" size={13}>
              {address.label} · {address.recipientName}
            </Text>
            <Text size={12} muted style={{ marginTop: 3, lineHeight: 18 }}>
              {address.line1}
              {address.line2 ? `, ${address.line2}` : ''}, {address.city} {address.pincode}
            </Text>
          </View>
          <Pressable onPress={() => router.push('/addresses')} hitSlop={6}>
            <Text weight="600" size={12} color={colors.accent}>
              Change
            </Text>
          </Pressable>
        </View>

        <Text weight="700" size={13} style={styles.label}>
          Select Date
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateRow}>
          {eligibility.slots.map((s, i) => {
            const chip = formatDayChip(s.date);
            const active = i === dayIdx;
            return (
              <Pressable
                key={s.date}
                onPress={() => {
                  setDayIdx(i);
                  setSlotIdx(0);
                }}
                style={[
                  styles.dateChip,
                  active
                    ? { backgroundColor: colors.primary, borderColor: colors.primary }
                    : { borderColor: colors.border },
                ]}>
                <Text weight="600" size={11} color={active ? colors.onPrimary : colors.label2}>
                  {chip.label}
                </Text>
                <Text weight="700" size={18} color={active ? colors.onPrimary : colors.label2} style={{ marginTop: 2 }}>
                  {chip.day}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Text weight="700" size={13} style={styles.label}>
          Time Slot
        </Text>
        <View style={styles.slotRow}>
          {(day?.windows ?? []).map((w, i) => {
            const active = i === slotIdx;
            return (
              <Pressable
                key={w.slotStart}
                disabled={!w.available}
                onPress={() => setSlotIdx(i)}
                style={[
                  styles.slotChip,
                  active
                    ? { backgroundColor: colors.primary, borderColor: colors.primary }
                    : { borderColor: colors.border },
                  !w.available && { opacity: 0.4 },
                ]}>
                <Text weight="600" size={12} color={active ? colors.onPrimary : colors.label2}>
                  {formatSlot(w.slotStart, w.slotEnd)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text weight="700" size={13} style={styles.label}>
          Instructions (optional)
        </Text>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Add a note for our stylist…"
          placeholderTextColor={colors.faint}
          multiline
          style={styles.noteInput}
        />

        <View style={styles.feeCard}>
          <View style={styles.feeLeft}>
            <Icon name="info" size={22} color={colors.accent} />
            <View style={{ flex: 1 }}>
              <Text size={13} color={colors.label2}>
                Fully refundable trial hold
              </Text>
              <Text size={11} muted style={{ marginTop: 2 }}>
                Only pieces you keep are charged — returns are refunded.
              </Text>
            </View>
          </View>
          <Text weight="700" size={16}>
            {formatPaiseCompact(holdPaise)}
          </Text>
        </View>

        {error ? (
          <Text size={12.5} color={colors.dangerFg} style={{ marginTop: 12 }}>
            {error}
          </Text>
        ) : null}
      </ScrollView>

      <View style={[styles.bar, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable
          style={[styles.confirmBtn, !bookable && { opacity: 0.5 }]}
          disabled={!bookable}
          onPress={confirm}>
          <Text weight="600" size={15} color={colors.onPrimary}>
            {createTrial.isPending ? 'Booking…' : `Confirm Booking · ${formatPaiseCompact(holdPaise)}`}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function Header({ top }: { top: number }) {
  return (
    <View style={[styles.header, { paddingTop: top + 8 }]}>
      <Pressable style={styles.back} onPress={() => router.back()} hitSlop={6}>
        <Icon name="arrow_back" size={22} color={colors.label} />
      </Pressable>
      <Text serif weight="600" size={24}>
        Try at Home
      </Text>
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
  scroll: { padding: 20, paddingTop: 16, paddingBottom: 24 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  pieceCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.background,
    borderRadius: 16,
    borderCurve: 'continuous',
    padding: 12,
    marginBottom: 20,
  },
  pieceThumb: { width: 56, height: 70, borderRadius: 10 },
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.warnBg,
    borderRadius: 14,
    borderCurve: 'continuous',
    padding: 12,
    marginBottom: 20,
  },
  label: { marginBottom: 12 },
  addressCard: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    backgroundColor: colors.background,
    borderRadius: 16,
    borderCurve: 'continuous',
    padding: 16,
    marginBottom: 20,
  },
  dateRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  dateChip: {
    width: 64,
    paddingVertical: 12,
    borderRadius: 14,
    borderCurve: 'continuous',
    borderWidth: 1.5,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  slotRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  slotChip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderCurve: 'continuous',
    borderWidth: 1.5,
    backgroundColor: colors.background,
  },
  noteInput: {
    backgroundColor: colors.background,
    borderRadius: 16,
    borderCurve: 'continuous',
    padding: 14,
    minHeight: 64,
    fontFamily: fontFamily.sans,
    fontSize: 13,
    color: colors.label,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  feeCard: {
    backgroundColor: colors.background,
    borderRadius: 16,
    borderCurve: 'continuous',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  feeLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  bar: {
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  confirmBtn: {
    height: 54,
    backgroundColor: colors.primary,
    borderRadius: 14,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
