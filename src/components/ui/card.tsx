import { type ViewProps, StyleSheet, useColorScheme, View } from 'react-native';

import { colors } from '@/theme/colors';
import { radii, spacing } from '@/theme/tokens';

/** Rounded surface container for grouped content. */
export function Card({ style, ...rest }: ViewProps) {
  useColorScheme();
  return <View style={[styles.card, { backgroundColor: colors.surface }, style]} {...rest} />;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.lg,
    borderCurve: 'continuous',
    padding: spacing.lg,
    gap: spacing.sm,
  },
});
