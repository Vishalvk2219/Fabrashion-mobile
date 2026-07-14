import { ScrollView, type ScrollViewProps, useColorScheme } from 'react-native';

import { colors } from '@/theme/colors';
import { spacing } from '@/theme/tokens';

/**
 * Standard scrollable screen container. First child of a route so the native header /
 * tab bar apply automatic safe-area insets (`contentInsetAdjustmentBehavior="automatic"`).
 * Use for detail/placeholder screens; use a bare `FlatList` for long lists instead.
 */
export function Screen({ children, style, contentContainerStyle, ...rest }: ScrollViewProps) {
  useColorScheme();
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      style={[{ backgroundColor: colors.background }, style]}
      contentContainerStyle={[
        { padding: spacing.lg, gap: spacing.lg, flexGrow: 1 },
        contentContainerStyle,
      ]}
      {...rest}>
      {children}
    </ScrollView>
  );
}
