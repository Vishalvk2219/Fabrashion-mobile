import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, Loader, Text } from '@/components/ui';
import { useAddresses, useRemoveAddress, useUpdateAddress } from '@/features/address/hooks';
import type { Address } from '@/features/address/schema';
import { colors } from '@/theme/colors';

function AddressCard({ address }: { address: Address }) {
  const remove = useRemoveAddress();
  const update = useUpdateAddress();
  const lines = [address.line1, address.line2, `${address.city}, ${address.state} ${address.pincode}`]
    .filter(Boolean)
    .join(', ');
  return (
    <View style={[styles.card, address.isDefault && styles.cardDefault]}>
      <View style={styles.badgeRow}>
        <View style={[styles.badge, { backgroundColor: address.isDefault ? colors.accentSoft : colors.surface }]}>
          <Text weight="700" size={10} color={address.isDefault ? colors.accent : colors.label2}>
            {address.isDefault ? `${address.label} · DEFAULT` : address.label}
          </Text>
        </View>
      </View>
      <Text weight="600" size={14}>
        {address.recipientName}
      </Text>
      <Text size={12} muted style={styles.line}>
        {lines} · {address.recipientPhone}
      </Text>
      <View style={styles.actions}>
        <Pressable onPress={() => router.push({ pathname: '/address-form', params: { id: address.id } })}>
          <Text weight="600" size={13} color={colors.accent}>
            Edit
          </Text>
        </Pressable>
        <Pressable onPress={() => remove.mutate(address.id)}>
          <Text weight="600" size={13} muted>
            Delete
          </Text>
        </Pressable>
        {!address.isDefault ? (
          <Pressable onPress={() => update.mutate({ id: address.id, input: { isDefault: true } })}>
            <Text weight="600" size={13} muted>
              Set Default
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

export default function AddressesScreen() {
  const insets = useSafeAreaInsets();
  const { data: addresses, isLoading } = useAddresses();

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable style={styles.back} onPress={() => router.back()} hitSlop={6}>
          <Icon name="arrow_back" size={22} color={colors.label} />
        </Pressable>
        <Text serif weight="600" size={24}>
          Saved Addresses
        </Text>
      </View>

      {isLoading ? (
        <Loader />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {(addresses ?? []).map((a) => (
            <AddressCard key={a.id} address={a} />
          ))}
          <Pressable style={styles.addNew} onPress={() => router.push('/address-form')}>
            <Icon name="add" size={20} color={colors.accent} />
            <Text weight="600" size={14} color={colors.accent}>
              Add New Address
            </Text>
          </Pressable>
        </ScrollView>
      )}
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
  card: {
    backgroundColor: colors.background,
    borderRadius: 16,
    borderCurve: 'continuous',
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  cardDefault: { borderColor: colors.accent },
  badgeRow: { flexDirection: 'row', marginBottom: 8 },
  badge: { paddingVertical: 3, paddingHorizontal: 10, borderRadius: 10 },
  line: { lineHeight: 18, marginTop: 4 },
  actions: {
    flexDirection: 'row',
    gap: 18,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.surface,
  },
  addNew: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#D8D2C6',
    borderRadius: 16,
    borderCurve: 'continuous',
    padding: 16,
    backgroundColor: colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
});
