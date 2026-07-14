import { ScrollView, type ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/theme/colors';
import { spacing } from '@/theme/tokens';

/**
 * Standard scrollable screen container. Screens now draw their own headers (no native header),
 * so this owns the top/bottom safe-area insets. Use for detail/placeholder screens; use a bare
 * `FlatList` for long lists instead.
 */
export function Screen({ children, style, contentContainerStyle, ...rest }: ScrollViewProps) {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      style={[{ backgroundColor: colors.background }, style]}
      contentContainerStyle={[
        {
          paddingTop: insets.top + spacing.lg,
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.xl,
          gap: spacing.lg,
          flexGrow: 1,
        },
        contentContainerStyle,
      ]}
      {...rest}>
      {children}
    </ScrollView>
  );
}
