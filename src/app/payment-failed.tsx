import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, Text } from '@/components/ui';
import { colors } from '@/theme/colors';

const DANGER = '#B03A3A';
const DANGER_SOFT = '#FBEDED';

export default function PaymentFailedScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.root}>
      <Pressable style={[styles.back, { top: insets.top + 8 }]} onPress={() => router.back()} hitSlop={8}>
        <Icon name="arrow_back" size={22} color={colors.label} />
      </Pressable>

      <View style={styles.circle}>
        <Icon name="error" size={52} fill color={DANGER} />
      </View>
      <Text serif weight="600" size={28} align="center" style={{ marginTop: 26 }}>
        Payment Failed
      </Text>
      <Text muted size={14} align="center" style={styles.subtitle}>
        Your payment couldn&apos;t be processed. No amount was deducted.
      </Text>

      <View style={styles.actions}>
        <Pressable style={styles.retryBtn} onPress={() => router.replace('/checkout')}>
          <Text weight="600" size={15} color={colors.onPrimary}>
            Retry Payment
          </Text>
        </Pressable>
        <Pressable style={styles.supportBtn} onPress={() => router.push('/help')}>
          <Text weight="600" size={15}>
            Contact Support
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  back: {
    position: 'absolute',
    left: 16,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: DANGER_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: { marginTop: 10, lineHeight: 22, maxWidth: 300 },
  actions: { marginTop: 28, width: '100%' },
  retryBtn: {
    height: 54,
    backgroundColor: colors.primary,
    borderRadius: 14,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  supportBtn: {
    height: 54,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
