import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, Text } from '@/components/ui';
import { useSession } from '@/features/auth/hooks';
import { useAuthStore } from '@/features/auth/store';
import { useOrders } from '@/features/orders/hooks';
import { useWishlistStore } from '@/features/wishlist/store';
import { colors } from '@/theme/colors';
import type { IconName } from '@/theme/material-icons';

function MenuRow({
  icon,
  label,
  onPress,
  iconColor = colors.accent,
  last,
}: {
  icon: IconName;
  label: string;
  onPress?: () => void;
  iconColor?: string;
  last?: boolean;
}) {
  return (
    <Pressable style={[styles.row, !last && styles.rowBorder]} onPress={onPress}>
      <Icon name={icon} size={22} color={iconColor} />
      <Text weight="500" size={14} style={{ flex: 1 }}>
        {label}
      </Text>
      <Icon name="chevron_right" size={20} color={colors.disabled} />
    </Pressable>
  );
}

function Stat({
  value,
  label,
  valueColor,
  onPress,
}: {
  value: string;
  label: string;
  valueColor?: string;
  onPress?: () => void;
}) {
  return (
    <Pressable style={styles.stat} onPress={onPress} disabled={!onPress}>
      <Text weight="700" size={18} color={valueColor}>
        {value}
      </Text>
      <Text size={10} muted style={{ marginTop: 1 }}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useSession();
  const signOut = useAuthStore((s) => s.signOut);
  const orderCount = useOrders().data?.meta.total ?? 0;
  const wishCount = useWishlistStore((s) => s.ids.length);

  const name = user?.fullName ?? 'Aanya Rao';
  const contact = [user?.email, user?.phone].filter(Boolean).join(' · ') || '+91 98765 43210';

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        <View style={[styles.headerCard, { paddingTop: insets.top + 12 }]}>
          <View style={styles.identity}>
            <View style={styles.avatar}>
              <Text serif weight="600" size={28}>
                {name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text serif weight="600" size={24}>
                {name}
              </Text>
              <Text size={12} muted style={{ marginTop: 2 }}>
                {contact}
              </Text>
            </View>
            <Icon name="edit" size={22} color={colors.disabled} />
          </View>
          <View style={styles.stats}>
            <Stat value={String(orderCount)} label="Orders" onPress={() => router.push('/orders')} />
            <Stat value={String(wishCount)} label="Wishlist" onPress={() => router.push('/(tabs)/(wishlist)')} />
            <Stat value="Gold" label="Member" valueColor={colors.accent} />
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.group}>
            <MenuRow icon="shopping_bag" label="My Orders" onPress={() => router.push('/orders')} />
            <MenuRow icon="location_on" label="Saved Addresses" onPress={() => router.push('/addresses')} />
            <MenuRow
              icon="checkroom"
              label="Try at Home Bookings"
              onPress={() => router.push({ pathname: '/orders', params: { tab: 'Try at Home' } })}
            />
            <MenuRow icon="account_balance_wallet" label="Payments & Wallet" last />
          </View>

          <View style={[styles.group, { marginTop: 16 }]}>
            <MenuRow icon="help" label="Help & Support" iconColor={colors.label2} onPress={() => router.push('/help')} />
            <MenuRow icon="settings" label="Settings" iconColor={colors.label2} onPress={() => router.push('/settings')} />
            <MenuRow icon="shield" label="Privacy Policy" iconColor={colors.label2} last />
          </View>

          <Pressable style={styles.logout} onPress={() => signOut()}>
            <Icon name="logout" size={20} color="#B03A3A" />
            <Text weight="600" size={14} color="#B03A3A">
              Log Out
            </Text>
          </Pressable>
          <Text size={11} align="center" color={colors.disabled} style={{ marginTop: 16 }}>
            ANDRÓ · Version 2.4.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.backgroundAlt },
  headerCard: {
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
  },
  identity: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surfaceDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stats: { flexDirection: 'row', gap: 10, marginTop: 20 },
  stat: { flex: 1, backgroundColor: colors.backgroundAlt, borderRadius: 14, paddingVertical: 12, alignItems: 'center' },
  body: { padding: 20 },
  group: { backgroundColor: colors.background, borderRadius: 18, borderCurve: 'continuous', overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.surface },
  logout: {
    marginTop: 16,
    height: 52,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    borderCurve: 'continuous',
    backgroundColor: colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});
