import { fontFamily } from './typography';

/** Spacing scale on a 4pt grid. Prefer flex `gap` over margins. */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

/**
 * Corner radii from the ANDRÓ design. Product imagery uses `card` (18px); pills/chips 12;
 * CTAs 14–16; bottom sheets 28. Pair with `{ borderCurve: 'continuous' }` for iOS squircles.
 */
export const radii = {
  chip: 12,
  sm: 12,
  md: 14,
  lg: 16,
  card: 18, // product image radius (design `--r`)
  sheet: 28,
  pill: 999,
} as const;

/** Type sizes that recur in the design (pt). Text primitive also accepts arbitrary sizes. */
export const fontSize = {
  overline: 10,
  micro: 11,
  caption: 12,
  footnote: 13,
  body: 14,
  callout: 15,
  headline: 16,
  title3: 20,
  title2: 22,
  title1: 26,
  display: 30,
  displayLg: 34,
  hero: 42,
} as const;

/**
 * Family aliases by role. Kept for back-compat with earlier code that referenced `fonts.sans`
 * etc.; prefer importing `fontFamily`/`sansFamily`/`serifFamily` from `./typography`.
 */
export const fonts = {
  sans: fontFamily.sans,
  serif: fontFamily.serif,
  rounded: fontFamily.sans,
  mono: fontFamily.sans,
} as const;
