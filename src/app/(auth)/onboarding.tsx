import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Icon, Text } from '@/components/ui';
import { storage } from '@/lib/storage';
import { colors } from '@/theme';
import type { IconName } from '@/theme/material-icons';

const PAGES: { title: string; desc: string; icon: IconName }[] = [
  {
    title: 'Premium Fashion',
    desc: 'Curated collections from world-class ateliers, delivered with quiet luxury.',
    icon: 'diamond',
  },
  {
    title: 'Try at Home',
    desc: 'Handpick up to 10 pieces and try them in the comfort of home before you buy.',
    icon: 'checkroom',
  },
  {
    title: 'Fast Delivery',
    desc: 'Same-day dispatch from your nearest boutique, right on your schedule.',
    icon: 'local_shipping',
  },
  {
    title: 'Store Availability',
    desc: 'See live inventory across nearby ANDRÓ boutiques as you browse.',
    icon: 'storefront',
  },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const [page, setPage] = useState(0);
  const cur = PAGES[page];
  const last = page === PAGES.length - 1;

  const finish = () => {
    storage.set('app.onboarded', true);
    router.replace('/login');
  };
  const onNext = () => (last ? finish() : setPage((p) => p + 1));

  return (
    <View style={[styles.root, { paddingTop: insets.top + 12 }]}>
      <View style={styles.skipRow}>
        <Pressable onPress={finish} hitSlop={12}>
          <Text weight="600" size={13} track={0.04} color={colors.muted2}>
            Skip
          </Text>
        </Pressable>
      </View>

      <View style={styles.center}>
        <View style={styles.card}>
          <LinearGradient
            colors={['rgba(255,255,255,0.5)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.iconCircle}>
            <Icon name={cur.icon} size={44} weight={300} color={colors.accent} />
          </View>
        </View>

        <View style={styles.textBlock}>
          <Text serif weight="600" size={34} align="center" style={{ lineHeight: 36 }}>
            {cur.title}
          </Text>
          <Text muted size={14} align="center" style={styles.desc}>
            {cur.desc}
          </Text>
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.dots}>
          {PAGES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                { width: i === page ? 22 : 6, backgroundColor: i === page ? colors.accent : colors.divider },
              ]}
            />
          ))}
        </View>
        <Button title={last ? 'Get Started' : 'Continue'} onPress={onNext} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  skipRow: { paddingHorizontal: 24, alignItems: 'flex-end' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  card: {
    width: 230,
    height: 300,
    borderRadius: 24,
    borderCurve: 'continuous',
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 999,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1E1A12',
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
  },
  textBlock: { marginTop: 44, alignItems: 'center' },
  desc: { marginTop: 14, maxWidth: 270, lineHeight: 22 },
  footer: { paddingHorizontal: 32 },
  dots: { flexDirection: 'row', gap: 6, justifyContent: 'center', marginBottom: 28 },
  dot: { height: 6, borderRadius: 3 },
});
