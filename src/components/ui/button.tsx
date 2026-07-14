import {
  ActivityIndicator,
  type GestureResponderEvent,
  type PressableProps,
  StyleSheet,
  View,
} from 'react-native';

import { tap } from '@/lib/haptics';
import { colors } from '@/theme/colors';
import { radii, spacing } from '@/theme/tokens';
import { Icon } from './icon';
import { PressableScale } from './pressable-scale';
import { Text } from './text';
import type { IconName } from '@/theme/material-icons';

/** New ANDRÓ variants + Phase-0c aliases (`secondary`→soft, `ghost`→outline). */
type Variant = 'primary' | 'outline' | 'soft' | 'secondary' | 'ghost';
type Size = 'lg' | 'md';

type Props = Omit<PressableProps, 'children'> & {
  title: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  /** Leading Material Symbol icon. */
  icon?: IconName;
  iconFill?: boolean;
  /** Light tap on press-in. On by default (these are deliberate CTAs); pass `false` for
   * low-stakes / secondary buttons that shouldn't buzz. */
  haptic?: boolean;
};

/**
 * ANDRÓ button. `primary` = solid ink CTA (white text), `outline` = 1.5px ink border,
 * `soft` = light hairline border (social / secondary actions).
 *
 * Press feedback is a UI-thread scale (via `PressableScale`) plus an optional light haptic, both
 * firing on press-in so the touch is acknowledged within a frame — never waiting on `onPress`.
 */
export function Button({
  title,
  variant = 'primary',
  size = 'lg',
  loading,
  icon,
  iconFill,
  disabled,
  style,
  haptic = true,
  onPressIn,
  ...rest
}: Props) {
  const v: 'primary' | 'outline' | 'soft' =
    variant === 'secondary' ? 'soft' : variant === 'ghost' ? 'outline' : variant;
  const isDisabled = disabled || loading;
  const height = size === 'lg' ? 56 : 52;
  const radius = v === 'primary' ? radii.lg : radii.md;

  const bg = v === 'primary' ? colors.primary : 'transparent';
  const fg = v === 'primary' ? colors.onPrimary : colors.label;
  const borderColor = v === 'outline' ? colors.borderStrong : v === 'soft' ? colors.border : 'transparent';

  const handlePressIn = (e: GestureResponderEvent) => {
    if (!isDisabled && haptic) tap();
    onPressIn?.(e);
  };

  const base = [
    styles.base,
    {
      height,
      borderRadius: radius,
      backgroundColor: bg,
      borderWidth: v === 'primary' ? 0 : 1.5,
      borderColor,
      // Scale (not an opacity flip) now carries the pressed feedback; opacity only marks disabled.
      opacity: isDisabled ? 0.45 : 1,
    },
  ];

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityState={{ disabled: !!isDisabled }}
      disabled={isDisabled}
      onPressIn={handlePressIn}
      style={
        typeof style === 'function'
          ? (state) => [base, style(state)]
          : [base, style]
      }
      {...rest}>
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color={fg} />
        ) : (
          <>
            {icon ? <Icon name={icon} size={20} color={fg} fill={iconFill} /> : null}
            <Text
              weight="600"
              size={size === 'lg' ? 15 : 14}
              color={fg}
              track={0.03}
              numberOfLines={1}
              style={{ flexShrink: 1 }}>
              {title}
            </Text>
          </>
        )}
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    borderCurve: 'continuous',
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  content: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center', justifyContent: 'center' },
});
