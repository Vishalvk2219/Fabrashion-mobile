import { StyleSheet, type ViewProps, View } from 'react-native';

import { colors } from '@/theme/colors';
import { radii, spacing } from '@/theme/tokens';

/** Rounded white surface with a hairline border — the design's grouped-content container. */
export function Card({ style, ...rest }: ViewProps) {
  return <View style={[styles.card, style]} {...rest} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: colors.hairline,
    padding: spacing.lg,
    gap: spacing.sm,
  },
});
