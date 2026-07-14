import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, Text } from '@/components/ui';
import { colors } from '@/theme/colors';
import type { IconName } from '@/theme/material-icons';

type Step = {
  title: string;
  time: string;
  state: 'done' | 'current' | 'pending';
  icon?: IconName;
};

const STEPS: Step[] = [
  { title: 'Order Confirmed', time: '5 Jul, 10:24 AM', state: 'done' },
  { title: 'Order Accepted', time: '5 Jul, 11:02 AM', state: 'done' },
  { title: 'Packed', time: '5 Jul, 1:45 PM', state: 'done' },
  { title: 'Out for Delivery', time: 'In transit · arriving today', state: 'current', icon: 'local_shipping' },
  { title: 'Delivered', time: 'Expected by 6:00 PM', state: 'pending' },
];

function TimelineRow({ step, last }: { step: Step; last: boolean }) {
  const done = step.state === 'done';
  const current = step.state === 'current';
  return (
    <View style={styles.row}>
      <View style={styles.rail}>
        <View
          style={[
            styles.node,
            done && styles.nodeDone,
            current && styles.nodeCurrent,
            step.state === 'pending' && styles.nodePending,
          ]}>
          {done ? <Icon name="check" size={15} color={colors.white} /> : null}
          {current && step.icon ? <Icon name={step.icon} size={15} color={colors.white} /> : null}
        </View>
        {!last ? <View style={[styles.connector, done ? styles.connectorDone : styles.connectorPending]} /> : null}
      </View>
      <View style={styles.rowBody}>
        <Text weight={current ? '700' : '600'} size={13} color={step.state === 'pending' ? colors.disabled : colors.label}>
          {step.title}
        </Text>
        <Text
          size={11}
          color={current ? colors.accent : step.state === 'pending' ? colors.disabled : colors.muted}
          weight={current ? '600' : '400'}
          style={{ marginTop: 2 }}>
          {step.time}
        </Text>
      </View>
    </View>
  );
}

export default function OrderTrackingScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const orderId = id ? `#${id.slice(0, 8).toUpperCase()}` : '#ANDRO';

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <Pressable style={styles.back} onPress={() => router.back()} hitSlop={6}>
            <Icon name="arrow_back" size={22} color={colors.label} />
          </Pressable>
          <View>
            <Text serif weight="600" size={22}>
              Track Order
            </Text>
            <Text size={11} color={colors.muted2} style={{ marginTop: 2 }}>
              {orderId}
            </Text>
          </View>
        </View>

        {/* Map area */}
        <View style={styles.map}>
          <View style={styles.mapDot} />
          <View style={styles.mapBtn}>
            <Icon name="my_location" size={22} color={colors.accent} />
          </View>
        </View>

        {/* Delivery partner */}
        <View style={styles.partner}>
          <View style={styles.avatar}>
            <Text weight="700" size={15}>
              V
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text weight="600" size={13}>
              Vikram · Delivery Partner
            </Text>
            <Text size={11} muted style={{ marginTop: 1 }}>
              Arriving in ~25 min
            </Text>
          </View>
          <Pressable style={styles.callBtn} hitSlop={6}>
            <Icon name="call" size={20} color={colors.white} />
          </Pressable>
          <Pressable style={styles.chatBtn} hitSlop={6}>
            <Icon name="chat_bubble" size={20} color={colors.label} />
          </Pressable>
        </View>

        {/* Timeline */}
        <View style={styles.timeline}>
          {STEPS.map((step, i) => (
            <TimelineRow key={step.title} step={step} last={i === STEPS.length - 1} />
          ))}
        </View>
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
  map: {
    marginHorizontal: 20,
    height: 170,
    borderRadius: 20,
    borderCurve: 'continuous',
    backgroundColor: '#E4DED3',
    overflow: 'hidden',
  },
  mapDot: {
    position: 'absolute',
    top: '50%',
    left: '30%',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.accent,
  },
  mapBtn: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  partner: {
    marginHorizontal: 20,
    marginTop: 14,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 16,
    borderCurve: 'continuous',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.surfaceDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeline: { paddingHorizontal: 24, paddingTop: 20 },
  row: { flexDirection: 'row', gap: 14 },
  rail: { alignItems: 'center' },
  node: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  nodeDone: { backgroundColor: colors.accent },
  nodeCurrent: {
    backgroundColor: colors.accent,
    shadowColor: colors.accent,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  nodePending: { borderWidth: 2, borderColor: colors.border, backgroundColor: colors.background },
  connector: { width: 2, flex: 1, minHeight: 34 },
  connectorDone: { backgroundColor: colors.accent },
  connectorPending: { backgroundColor: colors.border },
  rowBody: { paddingBottom: 22 },
});
