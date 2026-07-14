import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState, Icon } from '@/components/ui';
import { colors } from '@/theme/colors';

/**
 * Full-screen placeholder for routes whose screen ships in a later phase. Keeps navigation links
 * valid (no 404s) and honest — it clearly says the feature is coming, not fake content.
 */
export function ComingSoon({
  title,
  message,
  icon,
}: {
  title: string;
  message: string;
  icon: string;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.root}>
      <Pressable style={[styles.back, { top: insets.top + 8 }]} onPress={() => router.back()} hitSlop={8}>
        <Icon name="arrow_back" size={22} color={colors.label} />
      </Pressable>
      <EmptyState icon={icon} title={title} message={message} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  back: {
    position: 'absolute',
    left: 16,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
