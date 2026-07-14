import { type ColorValue, StyleSheet, useColorScheme, View } from 'react-native';

import { colors } from '@/theme/colors';
import { radii, spacing } from '@/theme/tokens';
import { Text } from './text';

type Tone = 'neutral' | 'success' | 'danger' | 'primary';

const BG: Record<Tone, ColorValue> = {
  neutral: colors.surface,
  success: colors.success,
  danger: colors.danger,
  primary: colors.primary,
};

/** Small pill label (stock state, trial-eligible, discount, etc.). */
export function Badge({ label, tone = 'neutral' }: { label: string; tone?: Tone }) {
  useColorScheme();
  const fg = tone === 'neutral' ? colors.secondaryLabel : colors.onPrimary;
  return (
    <View style={[styles.badge, { backgroundColor: BG[tone] }]}>
      <Text variant="caption" color={fg} style={styles.text}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  text: { fontWeight: '600' },
});
