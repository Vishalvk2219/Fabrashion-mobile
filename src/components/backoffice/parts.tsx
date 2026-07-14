import { Pressable, StyleSheet, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { colors } from '@/theme/colors';

// Illustrative product/avatar tones from the ANDRÓ design (content, not theme) —
// deterministic per seed (SKU / name) so rows keep their colour between renders.
const THUMB_TONES = ['#E8E4DB', '#E2DBD0', '#ECE7DF', '#DDD6CA', '#E4DED3', '#EBE6DC'];
export function toneFor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return THUMB_TONES[Math.abs(hash) % THUMB_TONES.length] ?? '#E8E4DB';
}

/** Soft status pill (bg + saturated fg) used across inventory/orders/staff/catalog rows. */
export function Pill({ bg, fg, children }: { bg: string; fg: string; children: string }) {
  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <Text size={10} weight="700" color={fg}>
        {children}
      </Text>
    </View>
  );
}

/** Uppercase tracked eyebrow label above a section. */
export function SectionLabel({ children, style }: { children: string; style?: StyleProp<TextStyle> }) {
  return (
    <Text uppercase size={11} track={0.12} color={colors.muted2} style={style}>
      {children}
    </Text>
  );
}

/** Translucent stat tile on a dark dashboard hero (big figure + caption). */
export function HeroStat({ value, label, color = colors.white }: { value: string; label: string; color?: string }) {
  return (
    <View style={styles.heroStat}>
      <Text size={22} weight="700" color={color}>
        {value}
      </Text>
      <Text size={10} color={colors.heroMute} style={styles.heroStatLabel}>
        {label}
      </Text>
    </View>
  );
}

/** Amber "N changes waiting to sync" banner (Dashboard + Store Ops) → opens the Sync Queue. */
export function OfflineBanner({ pendingCount, onPress, style }: { pendingCount: number; onPress: () => void; style?: ViewStyle }) {
  return (
    <Pressable style={[styles.banner, style]} onPress={onPress}>
      <Icon name="sync_problem" size={22} color={colors.warnFg} />
      <View style={{ flex: 1 }}>
        <Text size={12} weight="700" color={colors.warnText}>
          {pendingCount} changes waiting to sync
        </Text>
        <Text size={11} color={colors.warnSub} style={{ marginTop: 1 }}>
          Saved locally — uploads when back online.
        </Text>
      </View>
      <Icon name="chevron_right" size={20} color={colors.warnChevron} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, borderCurve: 'continuous', alignSelf: 'flex-start' },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.warnBg,
    borderWidth: 1,
    borderColor: colors.warnBorder,
    borderRadius: 14,
    borderCurve: 'continuous',
    padding: 12,
  },
  heroStat: { flex: 1, backgroundColor: colors.heroTile, borderRadius: 14, borderCurve: 'continuous', paddingVertical: 12, paddingHorizontal: 14 },
  heroStatLabel: { marginTop: 1 },
});
