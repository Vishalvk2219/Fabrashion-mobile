import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ApiError } from '@/api/client';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Toggle } from '@/components/ui/toggle';
import { useAdminOverview, useCreateStaff } from '@/features/admin/hooks';
import { phoneSchema } from '@/features/auth/schema';
import { fontFamily } from '@/theme/typography';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/tokens';
import type { IconName } from '@/theme/material-icons';

type PermKey = 'inventory' | 'orders' | 'reports';
const PERMISSIONS: { key: PermKey; icon: IconName; title: string; sub: string }[] = [
  { key: 'inventory', icon: 'inventory_2', title: 'Manage inventory', sub: 'Update stock & add items' },
  { key: 'orders', icon: 'local_shipping', title: 'Process orders', sub: 'Pack & fulfil customer orders' },
  { key: 'reports', icon: 'monitoring', title: 'View reports', sub: 'Sales & performance dashboards' },
];

const ROLES = [
  { label: 'Store Staff', value: 'STAFF' },
  { label: 'Admin', value: 'ADMIN' },
] as const;

export default function AddStaff() {
  const insets = useSafeAreaInsets();
  const createStaff = useCreateStaff();
  const { data: overview } = useAdminOverview();
  // Boutique choices come from the live channel list (physical stores only).
  const stores = (overview?.storePerf ?? []).filter(
    (s): s is { storeId: string; name: string; revenuePaise: number } => s.storeId !== null,
  );

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'STAFF' | 'ADMIN'>('STAFF');
  const [storeId, setStoreId] = useState<string | undefined>(undefined);
  const [perms, setPerms] = useState<Record<PermKey, boolean>>({ inventory: true, orders: true, reports: false });
  const [error, setError] = useState<string | null>(null);

  const togglePerm = (k: PermKey) => setPerms((p) => ({ ...p, [k]: !p[k] }));

  const submit = () => {
    setError(null);
    if (fullName.trim().length < 2) {
      setError('Enter the team member’s full name.');
      return;
    }
    if (!phoneSchema.safeParse(phone).success) {
      setError('Enter a valid 10-digit mobile number — it is their login.');
      return;
    }
    createStaff.mutate(
      { fullName: fullName.trim(), phone, role, storeId, permissions: perms },
      {
        onSuccess: () => router.back(),
        onError: (err) =>
          setError(err instanceof ApiError ? err.message : 'Could not reach the server. Try again.'),
      },
    );
  };

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable style={styles.back} onPress={() => router.back()} hitSlop={6}>
          <Icon name="arrow_back" size={22} color={colors.label} />
        </Pressable>
        <Text serif weight="600" size={24}>
          Add Team Member
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.photoRow}>
          <View style={styles.photo}>
            <Icon name="add_a_photo" size={24} color={colors.accent} />
          </View>
          <Text size={12} color={colors.muted} style={{ flex: 1, lineHeight: 18 }}>
            The role you set here is stored on their account — it decides which app experience they see.
            It is never chosen at login.
          </Text>
        </View>

        <FieldLabel>Full Name</FieldLabel>
        <TextInput
          value={fullName}
          onChangeText={setFullName}
          placeholder="e.g. Riya Kapoor"
          placeholderTextColor={colors.faint}
          style={[styles.input, styles.inputStrong]}
        />

        <FieldLabel>Phone (their login)</FieldLabel>
        <TextInput
          value={phone}
          onChangeText={(t) => setPhone(t.replace(/\D/g, '').slice(0, 10))}
          placeholder="10-digit mobile"
          placeholderTextColor={colors.faint}
          keyboardType="number-pad"
          maxLength={10}
          style={styles.input}
        />

        <FieldLabel>Role</FieldLabel>
        <View style={styles.roles}>
          {ROLES.map((r) => {
            const active = r.value === role;
            return (
              <Pressable
                key={r.value}
                onPress={() => setRole(r.value)}
                style={[styles.roleChip, active ? styles.roleChipActive : styles.roleChipIdle]}>
                <Text size={13} weight="600" color={active ? colors.onPrimary : colors.label2}>
                  {r.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <FieldLabel>Assigned Store</FieldLabel>
        <View style={styles.roles}>
          {stores.map((s) => {
            const active = s.storeId === storeId;
            return (
              <Pressable
                key={s.storeId}
                onPress={() => setStoreId(active ? undefined : s.storeId)}
                style={[styles.roleChip, active ? styles.roleChipActive : styles.roleChipIdle]}>
                <Text size={12} weight="600" color={active ? colors.onPrimary : colors.label2}>
                  {s.name}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <FieldLabel style={{ marginTop: 16 }}>Permissions</FieldLabel>
        <View style={styles.permCard}>
          {PERMISSIONS.map((p, i) => (
            <View key={p.key} style={[styles.permRow, i < PERMISSIONS.length - 1 && styles.permDivider]}>
              <Icon name={p.icon} size={22} color={colors.accent} />
              <View style={{ flex: 1 }}>
                <Text size={14} weight="600">
                  {p.title}
                </Text>
                <Text size={11} color={colors.muted} style={{ marginTop: 1 }}>
                  {p.sub}
                </Text>
              </View>
              <Toggle value={perms[p.key]} onChange={() => togglePerm(p.key)} />
            </View>
          ))}
        </View>

        {error ? (
          <Text size={12.5} color={colors.dangerFg} style={{ marginTop: 14 }}>
            {error}
          </Text>
        ) : null}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable
          style={[styles.cta, createStaff.isPending && { opacity: 0.6 }]}
          disabled={createStaff.isPending}
          onPress={submit}>
          <Icon name="mail" size={20} color={colors.onPrimary} />
          <Text size={15} weight="600" color={colors.onPrimary}>
            {createStaff.isPending ? 'Creating…' : 'Send Invite'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function FieldLabel({ children, style }: { children: string; style?: object }) {
  return (
    <Text uppercase size={11} track={0.1} color={colors.muted2} style={[styles.fieldLabel, style]}>
      {children}
    </Text>
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
  scroll: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 24 },
  photoRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 20 },
  photo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.officeCanvas,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldLabel: { marginBottom: 6 },
  input: {
    height: 50,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radii.chip,
    borderCurve: 'continuous',
    paddingHorizontal: 14,
    fontSize: 15,
    fontFamily: fontFamily.sansMedium,
    color: colors.label,
    marginBottom: 16,
  },
  inputStrong: { borderColor: colors.borderStrong },
  roles: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 18 },
  roleChip: {
    flexGrow: 1,
    height: 46,
    paddingHorizontal: 14,
    borderRadius: radii.chip,
    borderCurve: 'continuous',
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  roleChipIdle: { backgroundColor: colors.background, borderColor: colors.border },
  permCard: {
    backgroundColor: colors.officeCanvas,
    borderRadius: radii.lg,
    borderCurve: 'continuous',
    paddingHorizontal: 16,
  },
  permRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  permDivider: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  footer: { borderTopWidth: 1, borderTopColor: colors.hairline, paddingHorizontal: 16, paddingTop: 12 },
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
