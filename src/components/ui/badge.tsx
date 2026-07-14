import { StyleSheet, View } from 'react-native';

import { colors } from '@/theme/colors';
import { radii, spacing } from '@/theme/tokens';
import { Text } from './text';

type Tone = 'neutral' | 'ink' | 'gold' | 'success' | 'danger' | 'primary';

const BG: Record<Tone, string> = {
  neutral: colors.surface,
  ink: colors.primary,
  primary: colors.primary, // back-compat alias
  gold: colors.accentSoft,
  success: colors.success,
  danger: colors.danger,
};
const FG: Record<Tone, string> = {
  neutral: colors.label2,
  ink: colors.onPrimary,
  primary: colors.onPrimary,
  gold: colors.accent,
  success: colors.white,
  danger: colors.white,
};

/** Small pill label (discount, trial-eligible, stock state). */
export function Badge({ label, tone = 'neutral' }: { label: string; tone?: Tone }) {
  return (
    <View style={[styles.badge, { backgroundColor: BG[tone] }]}>
      <Text size={11} weight="700" color={FG[tone]} track={0.02}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radii.chip,
    borderCurve: 'continuous',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
});
