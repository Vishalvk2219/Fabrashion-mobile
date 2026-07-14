import { ActivityIndicator, StyleSheet, useColorScheme, View } from 'react-native';

import { colors } from '@/theme/colors';
import { spacing } from '@/theme/tokens';
import { Text } from './text';

/** Centered loading spinner with an optional label. Fills its parent. */
export function Loader({ label }: { label?: string }) {
  useColorScheme();
  return (
    <View style={styles.container}>
      <ActivityIndicator color={colors.primary} />
      {label ? (
        <Text variant="caption" muted>
          {label}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.xl,
  },
});
