import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, Text } from '@/components/ui';
import { colors } from '@/theme/colors';
import type { IconName } from '@/theme/material-icons';

type Notif = { icon: IconName; title: string; body: string; unread?: boolean; gold?: boolean };

const TODAY: Notif[] = [
  {
    icon: 'local_shipping',
    title: 'Your order is out for delivery',
    body: '#ANDRO-48213 arrives today by 6 PM.',
    unread: true,
    gold: true,
  },
  {
    icon: 'checkroom',
    title: 'Try at Home confirmed',
    body: 'Stylist visit booked for Thu, 9 Jul · 2–4 PM.',
    unread: true,
  },
];
const EARLIER: Notif[] = [
  { icon: 'sell', title: 'The Autumn Edit is live', body: 'Up to 40% off premium coats, for a limited time.' },
  { icon: 'auto_awesome', title: 'New arrivals from ANDRÓ Atelier', body: 'Fresh pieces picked for your taste.' },
];

function NotifRow({ n }: { n: Notif }) {
  return (
    <View style={styles.row}>
      <View style={[styles.iconBox, { backgroundColor: n.gold ? colors.accentSoft : colors.surface }]}>
        <Icon name={n.icon} size={22} color={n.gold ? colors.accent : colors.label} />
      </View>
      <View style={{ flex: 1 }}>
        <Text weight="600" size={13}>
          {n.title}
        </Text>
        <Text size={12} muted style={styles.body}>
          {n.body}
        </Text>
      </View>
      {n.unread ? <View style={styles.dot} /> : null}
    </View>
  );
}

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable style={styles.back} onPress={() => router.back()} hitSlop={6}>
          <Icon name="arrow_back" size={22} color={colors.label} />
        </Pressable>
        <Text serif weight="600" size={24}>
          Notifications
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text uppercase size={11} track={0.12} color={colors.muted2} style={styles.sectionLabel}>
          Today
        </Text>
        {TODAY.map((n) => (
          <NotifRow key={n.title} n={n} />
        ))}
        <Text uppercase size={11} track={0.12} color={colors.muted2} style={[styles.sectionLabel, { marginTop: 20 }]}>
          Earlier
        </Text>
        {EARLIER.map((n) => (
          <NotifRow key={n.title} n={n} />
        ))}
      </ScrollView>
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
  scroll: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24 },
  sectionLabel: { marginBottom: 12, marginTop: 8 },
  row: { flexDirection: 'row', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.surface },
  iconBox: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  body: { marginTop: 2, lineHeight: 17 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent, marginTop: 6 },
});
