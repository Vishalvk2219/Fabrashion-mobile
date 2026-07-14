import { Platform } from 'react-native';
import { Color } from 'expo-router';

/**
 * Semantic color tokens — the single source of truth for color in the app.
 * Components reference these (`colors.primary`, `colors.label`, …) and NEVER raw hex.
 *
 * Values resolve on-device via the native `Color` API: iOS UIKit system colors and
 * Android Material 3 dynamic colors. They auto-adapt to light/dark and accessibility
 * settings, so we don't maintain separate light/dark hex tables. Web gets a hex fallback.
 *
 * Rebranding later = point `primary` at a custom palette here; nothing else changes.
 *
 * NOTE: On Android these are `PlatformColor` values. Any component that renders them
 * must call `useColorScheme()` so it re-renders when the theme flips (React Compiler
 * memoizes otherwise). See `building-native-ui` skill.
 */
export const colors = {
  /** Brand / accent. Swap this to rebrand. */
  primary: Platform.select({
    ios: Color.ios.systemBlue,
    android: Color.android.dynamic.primary,
    default: '#0A84FF',
  })!,
  /** Foreground on top of `primary`. */
  onPrimary: Platform.select({
    ios: '#ffffff',
    android: Color.android.dynamic.onPrimary,
    default: '#ffffff',
  })!,
  /** Screen background. */
  background: Platform.select({
    ios: Color.ios.systemBackground,
    android: Color.android.dynamic.surface,
    default: '#ffffff',
  })!,
  /** Raised surfaces: cards, inputs, grouped rows. */
  surface: Platform.select({
    ios: Color.ios.secondarySystemBackground,
    android: Color.android.dynamic.surfaceVariant,
    default: '#f2f2f7',
  })!,
  /** Primary text. */
  label: Platform.select({
    ios: Color.ios.label,
    android: Color.android.dynamic.onSurface,
    default: '#000000',
  })!,
  /** Secondary / muted text. */
  secondaryLabel: Platform.select({
    ios: Color.ios.secondaryLabel,
    android: Color.android.dynamic.onSurfaceVariant,
    default: '#3c3c43',
  })!,
  /** Hairlines and borders. */
  border: Platform.select({
    ios: Color.ios.separator,
    android: Color.android.dynamic.outlineVariant,
    default: '#c6c6c8',
  })!,
  /** Errors, destructive actions, out-of-stock. */
  danger: Platform.select({
    ios: Color.ios.systemRed,
    android: Color.android.dynamic.error,
    default: '#ff3b30',
  })!,
  /** Success, in-stock. */
  success: Platform.select({
    ios: Color.ios.systemGreen,
    android: Color.android.dynamic.primary,
    default: '#34c759',
  })!,
} as const;

export type AppColors = typeof colors;
