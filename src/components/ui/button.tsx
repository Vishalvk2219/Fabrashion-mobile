import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';

import { colors } from '@/theme/colors';
import { radii, spacing } from '@/theme/tokens';
import { Text } from './text';

type Variant = 'primary' | 'secondary' | 'ghost';

type Props = Omit<PressableProps, 'children'> & {
  title: string;
  variant?: Variant;
  loading?: boolean;
};

/** Themed pressable button with primary/secondary/ghost variants and a loading state. */
export function Button({ title, variant = 'primary', loading, disabled, style, ...rest }: Props) {
  useColorScheme();
  const isDisabled = disabled || loading;
  const bg =
    variant === 'primary' ? colors.primary : variant === 'secondary' ? colors.surface : 'transparent';
  const fg = variant === 'primary' ? colors.onPrimary : colors.primary;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      style={(state) => [
        styles.base,
        { backgroundColor: bg, opacity: isDisabled ? 0.5 : state.pressed ? 0.85 : 1 },
        variant === 'ghost' && { borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border },
        typeof style === 'function' ? style(state) : style,
      ]}
      {...rest}>
      <View style={styles.content}>
        {loading ? <ActivityIndicator color={fg} /> : <Text color={fg} variant="headline">{title}</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 50,
    borderRadius: radii.md,
    borderCurve: 'continuous',
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  content: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center', justifyContent: 'center' },
});
