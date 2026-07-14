import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui';
import { colors } from '@/theme';

export default function SplashScreen() {
  const insets = useSafeAreaInsets();
  return (
    <Pressable style={styles.root} onPress={() => router.push('/onboarding')}>
      {/* Decorative gold glows (approximating the design's radial gradients). */}
      <View style={[styles.glow, { top: -60, right: -60, width: 240, height: 240, opacity: 0.22 }]} />
      <View style={[styles.glow, { bottom: -40, left: -70, width: 220, height: 220, opacity: 0.14 }]} />

      <View style={styles.center}>
        <View style={styles.rule} />
        <Text serif weight="600" size={58} color={colors.white} track={0.14} style={styles.wordmark}>
          ANDRÓ
        </Text>
        <Text uppercase size={11} track={0.42} color={colors.accent} style={styles.tagline}>
          Maison de Mode
        </Text>
        <View style={[styles.rule, { marginTop: 26 }]} />
      </View>

      <View style={[styles.bottom, { bottom: insets.bottom + 48 }]}>
        <Text serif italic size={18} color={colors.onDark} align="center">
          Where wardrobes become collections.
        </Text>
        <Text uppercase size={10} track={0.3} color={colors.onDarkMuted} align="center" style={styles.enter}>
          Tap to enter
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.dark,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: colors.accent,
  },
  center: { alignItems: 'center' },
  rule: { width: 60, height: 1, backgroundColor: colors.accent, marginBottom: 26 },
  wordmark: { paddingLeft: 8 },
  tagline: { marginTop: 6, paddingLeft: 20 },
  bottom: { position: 'absolute', alignItems: 'center', paddingHorizontal: 24 },
  enter: { marginTop: 20 },
});
