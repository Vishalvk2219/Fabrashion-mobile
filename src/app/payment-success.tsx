import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { Animated, Easing, Pressable, StyleSheet, useAnimatedValue, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, Text } from '@/components/ui';
import { colors } from '@/theme/colors';

const HAIRLINE = '#3A352C';

export default function PaymentSuccessScreen() {
  const insets = useSafeAreaInsets();
  // The order is already placed + the cart converted server-side (checkout hook). Show the id.
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();
  const displayId = orderId ? `#${orderId.slice(0, 8).toUpperCase()}` : '#ANDRO';

  const pop = useAnimatedValue(0);
  const ring1 = useAnimatedValue(0);
  const ring2 = useAnimatedValue(0);

  useEffect(() => {
    Animated.spring(pop, { toValue: 1, useNativeDriver: true, friction: 5, tension: 80 }).start();
    const loop = (v: Animated.Value) =>
      Animated.loop(
        Animated.timing(v, { toValue: 1, duration: 1600, easing: Easing.out(Easing.ease), useNativeDriver: true }),
      );
    const l1 = loop(ring1);
    l1.start();
    const t = setTimeout(() => loop(ring2).start(), 500);
    return () => {
      clearTimeout(t);
      l1.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ringStyle = (v: Animated.Value) => ({
    opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0.6, 0] }),
    transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.7, 2.1] }) }],
  });

  return (
    <View style={styles.root}>
      <View style={styles.badgeWrap}>
        <Animated.View style={[styles.ring, ringStyle(ring1)]} />
        <Animated.View style={[styles.ring, ringStyle(ring2)]} />
        <Animated.View style={[styles.check, { transform: [{ scale: pop }] }]}>
          <Icon name="check" size={52} color={colors.white} />
        </Animated.View>
      </View>

      <Text serif weight="600" size={34} color={colors.white} style={{ marginTop: 36 }}>
        Order Confirmed
      </Text>
      <Text size={14} align="center" color={colors.onDark} style={styles.subtitle}>
        Thank you, Aanya. Your pieces are being prepared with care.
      </Text>

      <View style={styles.orderBadge}>
        <Text size={11} track={0.1} color={colors.onDarkMuted}>
          ORDER
        </Text>
        <Text weight="700" size={14} track={0.04} color={colors.white}>
          {displayId}
        </Text>
      </View>

      <View style={[styles.actions, { bottom: insets.bottom + 24 }]}>
        <Pressable
          style={styles.trackBtn}
          onPress={() =>
            router.replace(orderId ? { pathname: '/order-tracking', params: { id: orderId } } : '/orders')
          }>

          <Text weight="600" size={15} color={colors.white}>
            Track Order
          </Text>
        </Pressable>
        <Pressable style={styles.continueBtn} onPress={() => router.replace('/')}>
          <Text weight="600" size={15} color={colors.white}>
            Continue Shopping
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.dark,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
  },
  badgeWrap: { width: 120, height: 120, alignItems: 'center', justifyContent: 'center' },
  ring: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  check: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: { marginTop: 12, lineHeight: 22 },
  orderBadge: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderWidth: 1,
    borderColor: HAIRLINE,
    borderRadius: 14,
  },
  actions: { position: 'absolute', left: 36, right: 36 },
  trackBtn: {
    height: 54,
    backgroundColor: colors.accent,
    borderRadius: 14,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  continueBtn: {
    height: 54,
    borderWidth: 1,
    borderColor: HAIRLINE,
    borderRadius: 14,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
