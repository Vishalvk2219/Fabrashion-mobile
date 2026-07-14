/**
 * Font asset map for `useFonts` (expo-font). Keys become the `fontFamily` strings used across
 * the app (they match `typography.ts`). We import each weight by SUBPATH (not the package root),
 * so Metro bundles only the ttf we actually use — the package root would `require()` every weight.
 * The three Material Symbols Rounded ttf are subset to the ~74 glyphs the app uses.
 */
import { CormorantGaramond_500Medium } from '@expo-google-fonts/cormorant-garamond/500Medium';
import { CormorantGaramond_500Medium_Italic } from '@expo-google-fonts/cormorant-garamond/500Medium_Italic';
import { CormorantGaramond_600SemiBold } from '@expo-google-fonts/cormorant-garamond/600SemiBold';
import { CormorantGaramond_700Bold } from '@expo-google-fonts/cormorant-garamond/700Bold';
import { Manrope_300Light } from '@expo-google-fonts/manrope/300Light';
import { Manrope_400Regular } from '@expo-google-fonts/manrope/400Regular';
import { Manrope_500Medium } from '@expo-google-fonts/manrope/500Medium';
import { Manrope_600SemiBold } from '@expo-google-fonts/manrope/600SemiBold';
import { Manrope_700Bold } from '@expo-google-fonts/manrope/700Bold';

export const fontAssets = {
  CormorantGaramond_500Medium,
  CormorantGaramond_500Medium_Italic,
  CormorantGaramond_600SemiBold,
  CormorantGaramond_700Bold,
  Manrope_300Light,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  'MaterialSymbolsRounded-Thin': require('../../assets/fonts/MaterialSymbolsRounded-Thin.ttf'),
  MaterialSymbolsRounded: require('../../assets/fonts/MaterialSymbolsRounded-Outline.ttf'),
  'MaterialSymbolsRounded-Fill': require('../../assets/fonts/MaterialSymbolsRounded-Fill.ttf'),
};
