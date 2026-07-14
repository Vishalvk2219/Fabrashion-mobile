import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { initials } from '@/features/admin/model';
import { useAuthStore } from '@/features/auth/store';
import { useStaffSummary } from '@/features/staff/hooks';
import { selectPendingCount, useStaffStore } from '@/features/staff/store';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/tokens';
import type { IconName } from '@/theme/material-icons';

// Menu is presentational until staff shifts/notifications/help screens exist (see README).
const MENU: { label: string; icon: IconName }[] = [
  { label: 'My shifts', icon: 'schedule' },
  { label: 'Store information', icon: 'storefront' },
  { label: 'Notifications', icon: 'notifications' },
  { label: 'Help & support', icon: 'help' },
];

export default function StaffProfileScreen() {
  const insets = useSafeAreaInsets();
  const signOut = useAuthStore((s) => s.signOut);
  const user = useAuthStore((s) => s.user);
  const { data: summary } = useStaffSummary();
  const pendingCount = useStaffStore(selectPendingCount);

  const name = user?.fullName ?? 'Staff member';
  const contact = user?.email ?? user?.phone ?? '';

  const stats = [
    { value: String(summary?.updatedToday ?? '—'), label: 'Updated today' },
    { value: String(summary?.packedToday ?? '—'), label: 'Orders packed' },
    { value: String(pendingCount), label: 'Pending sync' },
  ];

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <View style={styles.identity}>
            <View style={styles.avatar}>
              <Text serif weight="600" size={24}>
                {initials(name)}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text serif weight="600" size={22}>
                {name}
              </Text>
              {contact ? (
                <Text size={12} color={colors.muted} style={{ marginTop: 1 }}>
                  {contact}
                </Text>
              ) : null}
              <View style={styles.roleBadge}>
                <Icon name="badge" size={13} fill color={colors.accent} />
                <Text size={10.5} weight="700" color={colors.accent}>
                  Store Staff{summary ? ` · ${summary.store.name}` : ''}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.stats}>
            {stats.map((s) => (
              <View key={s.label} style={styles.statTile}>
                <Text size={20} weight="700">
                  {s.value}
                </Text>
                <Text size={10} color={colors.muted2} style={{ marginTop: 1 }}>
                  {s.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.menu}>
          {MENU.map((m) => (
            <View key={m.label} style={styles.menuRow}>
              <Icon name={m.icon} size={23} color={colors.accent} />
              <Text size={14} weight="600" style={{ flex: 1 }}>
                {m.label}
              </Text>
              <Icon name="chevron_right" size={20} color={colors.disabled} />
            </View>
          ))}

          <Pressable style={styles.signOut} onPress={() => void signOut()}>
            <Icon name="logout" size={20} color={colors.dangerFg} />
            <Text size={14} weight="600" color={colors.dangerFg}>
              Sign Out
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.backgroundAlt },
  scroll: { paddingBottom: 100 },
  header: {
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
  },
  identity: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: colors.surfaceDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    marginTop: 6,
    backgroundColor: colors.accentSoft,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: radii.pill,
  },
  stats: { flexDirection: 'row', gap: 10, marginTop: 18 },
  statTile: {
    flex: 1,
    backgroundColor: colors.officeCanvas,
    borderRadius: radii.md,
    borderCurve: 'continuous',
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  menu: { paddingHorizontal: 20, paddingTop: 18, gap: 10 },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderCurve: 'continuous',
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  signOut: {
    marginTop: 8,
    height: 52,
    borderWidth: 1.5,
    borderColor: colors.dangerOutline,
    backgroundColor: colors.background,
    borderRadius: radii.md,
    borderCurve: 'continuous',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});
