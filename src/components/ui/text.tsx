import { Text as RNText, type TextProps, type TextStyle } from 'react-native';

import { colors } from '@/theme/colors';
import {
  sansFamily,
  serifFamily,
  tracking as trackEm,
  type SansWeight,
  type SerifWeight,
} from '@/theme/typography';

/** Convenience presets (also back-compat with Phase-0c screens that pass `variant`). */
type Variant = 'largeTitle' | 'title' | 'headline' | 'body' | 'caption';
const PRESETS: Record<Variant, { size: number; weight: SansWeight; serif?: boolean }> = {
  largeTitle: { size: 34, weight: '700', serif: true },
  title: { size: 22, weight: '700', serif: true },
  headline: { size: 16, weight: '600' },
  body: { size: 14, weight: '400' },
  caption: { size: 12, weight: '400' },
};

type Props = TextProps & {
  /** Preset (optional). Explicit `size`/`weight`/`serif` override it. */
  variant?: Variant;
  /** Use Cormorant Garamond (serif display) instead of Manrope (sans). */
  serif?: boolean;
  /** Font weight (sans: 300–700; serif: 500/600/700). */
  weight?: SansWeight | SerifWeight;
  /** Font size in pt. */
  size?: number;
  /** Serif italic (taglines). */
  italic?: boolean;
  /** Explicit color; otherwise resolves from `muted`/`faint`/label. */
  color?: string;
  /** Secondary muted color. */
  muted?: boolean;
  /** Faint tertiary color. */
  faint?: boolean;
  /** UPPERCASE the text (design's tracked eyebrow labels). */
  uppercase?: boolean;
  /** Letter-spacing in `em` (design values), converted to px against `size`. */
  track?: number;
  align?: TextStyle['textAlign'];
};

/**
 * ANDRÓ text primitive. Flexible by design — the mock uses many bespoke sizes/tracking, so this
 * exposes family/weight/size/tracking directly, with a small `variant` preset set for common cases.
 */
export function Text({
  variant,
  serif,
  weight,
  size,
  italic,
  color,
  muted,
  faint,
  uppercase,
  track,
  align,
  style,
  ...rest
}: Props) {
  const preset = variant ? PRESETS[variant] : undefined;
  const isSerif = serif ?? preset?.serif ?? false;
  const resolvedWeight = weight ?? preset?.weight ?? '400';
  const resolvedSize = size ?? preset?.size ?? 14;
  const family = isSerif
    ? serifFamily(resolvedWeight, italic)
    : sansFamily(resolvedWeight as SansWeight);
  const resolvedColor = color ?? (faint ? colors.faint : muted ? colors.muted : colors.label);
  return (
    <RNText
      style={[
        {
          fontFamily: family,
          fontSize: resolvedSize,
          color: resolvedColor,
          ...(track != null ? { letterSpacing: trackEm(resolvedSize, track) } : null),
          ...(uppercase ? { textTransform: 'uppercase' } : null),
          ...(align ? { textAlign: align } : null),
        },
        style,
      ]}
      {...rest}
    />
  );
}
