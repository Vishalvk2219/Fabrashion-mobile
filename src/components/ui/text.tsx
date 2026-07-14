import { type ColorValue, Text as RNText, type TextProps, useColorScheme } from 'react-native';

import { colors } from '@/theme/colors';
import { fontSize } from '@/theme/tokens';

type Variant = 'largeTitle' | 'title' | 'headline' | 'body' | 'caption';

type Props = TextProps & {
  variant?: Variant;
  /** Explicit color override (defaults to the theme label color). Accepts theme tokens. */
  color?: ColorValue;
  /** Use the muted secondary-label color. */
  muted?: boolean;
};

const SIZES: Record<Variant, number> = {
  largeTitle: fontSize.largeTitle,
  title: fontSize.title2,
  headline: fontSize.headline,
  body: fontSize.body,
  caption: fontSize.caption,
};

const WEIGHTS: Record<Variant, '400' | '600' | '700'> = {
  largeTitle: '700',
  title: '700',
  headline: '600',
  body: '400',
  caption: '400',
};

/** Themed text primitive. Reads semantic colors; re-renders on theme flip. */
export function Text({ variant = 'body', color, muted, style, ...rest }: Props) {
  useColorScheme();
  return (
    <RNText
      style={[
        {
          color: color ?? (muted ? colors.secondaryLabel : colors.label),
          fontSize: SIZES[variant],
          fontWeight: WEIGHTS[variant],
        },
        style,
      ]}
      {...rest}
    />
  );
}
