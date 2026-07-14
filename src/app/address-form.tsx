import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, Input, Text } from '@/components/ui';
import { useAddresses, useCreateAddress, useUpdateAddress } from '@/features/address/hooks';
import type { AddressLabel } from '@/features/address/schema';
import { colors } from '@/theme/colors';
import type { IconName } from '@/theme/material-icons';

const TYPES: { key: AddressLabel; label: string; icon: IconName }[] = [
  { key: 'HOME', label: 'Home', icon: 'home' },
  { key: 'WORK', label: 'Work', icon: 'work' },
  { key: 'OTHER', label: 'Other', icon: 'place' },
];

export default function AddressFormScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { data: addresses } = useAddresses();
  const create = useCreateAddress();
  const update = useUpdateAddress();
  const existing = id ? addresses?.find((a) => a.id === id) : undefined;

  const [recipientName, setName] = useState(existing?.recipientName ?? '');
  const [recipientPhone, setPhone] = useState(existing?.recipientPhone ?? '');
  const [line1, setLine1] = useState(existing?.line1 ?? '');
  const [city, setCity] = useState(existing?.city ?? '');
  const [state, setState] = useState(existing?.state ?? '');
  const [pincode, setPincode] = useState(existing?.pincode ?? '');
  const [label, setLabel] = useState<AddressLabel>(existing?.label ?? 'HOME');

  const valid =
    recipientName.trim() && recipientPhone.trim() && line1.trim() && city.trim() && state.trim() && /^\d{6}$/.test(pincode);
  const pending = create.isPending || update.isPending;

  const save = () => {
    if (!valid || pending) return;
    const input = { label, recipientName, recipientPhone, line1, city, state, pincode };
    const opts = { onSuccess: () => router.back() };
    if (existing) update.mutate({ id: existing.id, input }, opts);
    else create.mutate(input, opts);
  };

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable style={styles.back} onPress={() => router.back()} hitSlop={6}>
          <Icon name="arrow_back" size={22} color={colors.label} />
        </Pressable>
        <Text serif weight="600" size={24}>
          {existing ? 'Edit Address' : 'Add Address'}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.fields}>
          <Input label="Full Name" value={recipientName} onChangeText={setName} placeholder="e.g. Riya Kapoor" />
          <Input label="Phone Number" value={recipientPhone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="+91 98765 43210" />
          <Input
            label="Address Line"
            value={line1}
            onChangeText={setLine1}
            placeholder="Flat / House no., Building, Street, Area"
            multiline
            style={styles.multiline}
          />
          <View style={styles.rowFields}>
            <View style={{ flex: 1 }}>
              <Input label="City" value={city} onChangeText={setCity} placeholder="Mumbai" />
            </View>
            <View style={{ flex: 1 }}>
              <Input label="State" value={state} onChangeText={setState} placeholder="Maharashtra" />
            </View>
          </View>
          <Input label="Pincode" value={pincode} onChangeText={setPincode} keyboardType="number-pad" placeholder="400050" maxLength={6} />
        </View>

        <Text uppercase size={11} track={0.1} color={colors.muted2} style={styles.typeLabel}>
          Address Type
        </Text>
        <View style={styles.typeRow}>
          {TYPES.map((t) => {
            const active = t.key === label;
            return (
              <Pressable
                key={t.key}
                onPress={() => setLabel(t.key)}
                style={[
                  styles.typeBtn,
                  active ? { backgroundColor: colors.primary } : { borderWidth: 1.5, borderColor: colors.border },
                ]}>
                <Icon name={t.icon} size={18} color={active ? colors.onPrimary : colors.label2} />
                <Text weight="600" size={13} color={active ? colors.onPrimary : colors.label2}>
                  {t.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={[styles.bar, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable style={[styles.saveBtn, (!valid || pending) && styles.saveBtnDisabled]} onPress={save}>
          <Text weight="600" size={15} color={colors.onPrimary}>
            {pending ? 'Saving…' : 'Save Address'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingBottom: 12 },
  back: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { padding: 20, paddingBottom: 24 },
  fields: { gap: 18 },
  multiline: { height: 76, paddingTop: 14, textAlignVertical: 'top' },
  rowFields: { flexDirection: 'row', gap: 12 },
  typeLabel: { marginTop: 18, marginBottom: 10 },
  typeRow: { flexDirection: 'row', gap: 10 },
  typeBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    borderCurve: 'continuous',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  bar: { borderTopWidth: 1, borderTopColor: colors.hairline, paddingHorizontal: 16, paddingTop: 12 },
  saveBtn: {
    height: 54,
    backgroundColor: colors.primary,
    borderRadius: 14,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnDisabled: { opacity: 0.45 },
});
