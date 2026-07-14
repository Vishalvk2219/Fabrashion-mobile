import { Text as RNText, type StyleProp, type TextStyle } from 'react-native';

import { colors } from '@/theme/colors';
import { fontFamily } from '@/theme/typography';
import { glyphs, type IconName } from '@/theme/material-icons';

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  /** Filled (FILL 1) glyph — used for active/selected states, stars, filled hearts. */
  fill?: boolean;
  /** Stroke weight of outline glyphs. 300 = thin/elegant (design default for nav & chrome). */
  weight?: 300 | 400;
  style?: StyleProp<TextStyle>;
};

/**
 * Material Symbols Rounded icon, rendered by codepoint from the subset fonts in `assets/fonts`.
 * `fill` swaps to the filled font; `weight` picks thin (300) vs regular (400) outline.
 */
export function Icon({ name, size = 22, color = colors.label, fill = false, weight = 400, style }: Props) {
  const family = fill
    ? fontFamily.iconFill
    : weight === 300
      ? fontFamily.iconThin
      : fontFamily.icon;
  return (
    <RNText
      accessible={false}
      allowFontScaling={false}
      style={[
        {
          fontFamily: family,
          fontSize: size,
          lineHeight: size,
          color,
          includeFontPadding: false,
          textAlignVertical: 'center',
        },
        style,
      ]}>
      {String.fromCodePoint(glyphs[name])}
    </RNText>
  );
}
