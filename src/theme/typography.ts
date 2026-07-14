/**
 * ANDRÓ typography — font families + helpers.
 *
 * Two families from the design (`design/andro-template.html`): Cormorant Garamond (serif display)
 * and Manrope (sans UI/body), plus Material Symbols Rounded for icons. Family name strings MUST
 * match the keys registered in `fonts.ts` (which are the `@expo-google-fonts` export names + our
 * local icon-font keys).
 */

export const fontFamily = {
  // Cormorant Garamond (serif display)
  serifMedium: 'CormorantGaramond_500Medium',
  serif: 'CormorantGaramond_600SemiBold',
  serifBold: 'CormorantGaramond_700Bold',
  serifItalic: 'CormorantGaramond_500Medium_Italic',

  // Manrope (sans UI / body)
  sansLight: 'Manrope_300Light',
  sans: 'Manrope_400Regular',
  sansMedium: 'Manrope_500Medium',
  sansSemibold: 'Manrope_600SemiBold',
  sansBold: 'Manrope_700Bold',

  // Material Symbols Rounded (icons) — subset ttf in assets/fonts
  iconThin: 'MaterialSymbolsRounded-Thin', // wght 300, FILL 0
  icon: 'MaterialSymbolsRounded', // wght 400, FILL 0
  iconFill: 'MaterialSymbolsRounded-Fill', // wght 400, FILL 1
} as const;

export type SansWeight = '300' | '400' | '500' | '600' | '700';
export type SerifWeight = '500' | '600' | '700';

const SANS: Record<SansWeight, string> = {
  '300': fontFamily.sansLight,
  '400': fontFamily.sans,
  '500': fontFamily.sansMedium,
  '600': fontFamily.sansSemibold,
  '700': fontFamily.sansBold,
};

const SERIF: Record<SerifWeight, string> = {
  '500': fontFamily.serifMedium,
  '600': fontFamily.serif,
  '700': fontFamily.serifBold,
};

/** Resolve a Manrope family for a weight. */
export const sansFamily = (weight: SansWeight = '400') => SANS[weight];

/** Resolve a Cormorant Garamond family for a weight (+ italic). Falls back to SemiBold. */
export const serifFamily = (weight: string = '600', italic = false) =>
  italic ? fontFamily.serifItalic : (SERIF[weight as SerifWeight] ?? fontFamily.serif);

/**
 * The web design tracks letters in `em`; React Native `letterSpacing` is absolute px.
 * Convert once here so callers can keep the design's em values.
 */
export const tracking = (fontSize: number, em: number) => Math.round(fontSize * em * 100) / 100;
