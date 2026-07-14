import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { colors } from '@/theme/colors';
import { spacing } from '@/theme/tokens';
import { Text } from './text';

/** Centered loading spinner with an optional label. Fills its parent. */
export function Loader({ label }: { label?: string }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={colors.label} />
      {label ? (
        <Text size={13} muted>
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
    padding: spacing.xxl,
    backgroundColor: colors.background,
  },
});
