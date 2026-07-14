import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, Text } from '@/components/ui';
import { colors } from '@/theme/colors';
import type { IconName } from '@/theme/material-icons';

type Props = {
  icon: IconName;
  iconColor?: string;
  circleBg?: string;
  title: string;
  message: string;
  caption?: string;
  primaryLabel: string;
  primaryIcon?: IconName;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  showBack?: boolean;
};

/** Centered full-screen state (offline / error / session) — the design's shared empty-state layout. */
export function StatusView({
  icon,
  iconColor = colors.accent,
  circleBg = colors.surface,
  title,
  message,
  caption,
  primaryLabel,
  primaryIcon,
  onPrimary,
  secondaryLabel,
  onSecondary,
  showBack,
}: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.root}>
      {showBack ? (
        <Pressable style={[styles.back, { top: insets.top + 8 }]} onPress={() => router.back()} hitSlop={8}>
          <Icon name="arrow_back" size={22} color={colors.label} />
        </Pressable>
      ) : null}

      <View style={[styles.circle, { backgroundColor: circleBg }]}>
        <Icon name={icon} size={48} weight={300} color={iconColor} />
      </View>
      <Text serif weight="600" size={28} align="center" style={{ marginTop: 26 }}>
        {title}
      </Text>
      <Text muted size={14} align="center" style={styles.message}>
        {message}
      </Text>
      {caption ? (
        <Text size={11} color={colors.disabled} style={{ marginTop: 14 }}>
          {caption}
        </Text>
      ) : null}

      <View style={styles.actions}>
        <Pressable style={styles.primary} onPress={onPrimary}>
          {primaryIcon ? <Icon name={primaryIcon} size={20} color={colors.onPrimary} /> : null}
          <Text weight="600" size={15} color={colors.onPrimary}>
            {primaryLabel}
          </Text>
        </Pressable>
        {secondaryLabel && onSecondary ? (
          <Pressable style={styles.secondary} onPress={onSecondary}>
            <Text weight="600" size={15}>
              {secondaryLabel}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  back: {
    position: 'absolute',
    left: 16,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: { width: 104, height: 104, borderRadius: 52, alignItems: 'center', justifyContent: 'center' },
  message: { marginTop: 10, lineHeight: 22, maxWidth: 300 },
  actions: { marginTop: 26, alignSelf: 'stretch', gap: 12 },
  primary: {
    height: 54,
    backgroundColor: colors.primary,
    borderRadius: 14,
    borderCurve: 'continuous',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    alignSelf: 'center',
    paddingHorizontal: 34,
  },
  secondary: {
    height: 54,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
