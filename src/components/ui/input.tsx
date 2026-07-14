import { forwardRef, useState } from 'react';
import { StyleSheet, TextInput, type TextInputProps, View } from 'react-native';

import { colors } from '@/theme/colors';
import { radii, spacing } from '@/theme/tokens';
import { fontFamily } from '@/theme/typography';
import { Text } from './text';

type Props = TextInputProps & {
  /** Eyebrow label above the field (uppercase, tracked — design style). */
  label?: string;
  /** Validation message shown below the field. */
  error?: string;
};

/** ANDRÓ boxed text input — ink border on focus, uppercase eyebrow label, error state. */
export const Input = forwardRef<TextInput, Props>(function Input(
  { label, error, style, onFocus, onBlur, ...rest },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const borderColor = error ? colors.danger : focused ? colors.borderStrong : colors.border;
  return (
    <View style={styles.wrapper}>
      {label ? (
        <Text size={11} track={0.12} uppercase color={colors.muted2}>
          {label}
        </Text>
      ) : null}
      <TextInput
        ref={ref}
        placeholderTextColor={colors.muted2}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[styles.input, { borderColor, color: colors.label }, style]}
        {...rest}
      />
      {error ? (
        <Text size={12} color={colors.danger}>
          {error}
        </Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: { gap: spacing.sm },
  input: {
    height: 56,
    borderRadius: radii.md,
    borderCurve: 'continuous',
    borderWidth: 1.5,
    paddingHorizontal: spacing.lg,
    fontSize: 16,
    fontFamily: fontFamily.sansMedium,
  },
});
