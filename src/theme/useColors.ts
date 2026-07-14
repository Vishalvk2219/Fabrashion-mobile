import { useColorScheme } from 'react-native';

import { colors } from './colors';

/**
 * Returns the semantic color tokens and subscribes the calling component to system
 * theme changes, so it re-renders when light/dark flips. Required on Android, where the
 * native `PlatformColor` values resolve on-device and React Compiler may otherwise
 * memoize the component. Prefer this over importing `colors` directly in components.
 */
export function useColors() {
  useColorScheme();
  return colors;
}
