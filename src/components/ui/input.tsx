import { forwardRef } from 'react';
import {
  StyleSheet,
  TextInput,
  type TextInputProps,
  useColorScheme,
  View,
} from 'react-native';

import { colors } from '@/theme/colors';
import { radii, spacing } from '@/theme/tokens';
import { Text } from './text';

type Props = TextInputProps & {
  label?: string;
  /** Validation message shown below the field. */
  error?: string;
};

/** Labeled text input with an error state. Pair with react-hook-form's `Controller`. */
export const Input = forwardRef<TextInput, Props>(function Input(
  { label, error, style, ...rest },
  ref,
) {
  useColorScheme();
  return (
    <View style={styles.wrapper}>
      {label ? (
        <Text variant="caption" muted>
          {label}
        </Text>
      ) : null}
      <TextInput
        ref={ref}
        placeholderTextColor={colors.secondaryLabel}
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            color: colors.label,
            borderColor: error ? colors.danger : colors.border,
          },
          style,
        ]}
        {...rest}
      />
      {error ? (
        <Text variant="caption" color={colors.danger}>
          {error}
        </Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: { gap: spacing.xs },
  input: {
    minHeight: 48,
    borderRadius: radii.md,
    borderCurve: 'continuous',
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.md,
    fontSize: 17,
  },
});
