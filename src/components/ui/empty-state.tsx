import { StyleSheet, useColorScheme, View } from 'react-native';

import { spacing } from '@/theme/tokens';
import { Text } from './text';

type Props = {
  /** A glyph/emoji shown above the title (renders cross-platform). */
  icon?: string;
  title: string;
  message?: string;
  /** Optional call-to-action (e.g. a Button). */
  action?: React.ReactNode;
};

/** Friendly empty/placeholder state for screens with no data yet. */
export function EmptyState({ icon, title, message, action }: Props) {
  useColorScheme();
  return (
    <View style={styles.container}>
      {icon ? <Text style={styles.icon}>{icon}</Text> : null}
      <Text variant="title" style={styles.center}>
        {title}
      </Text>
      {message ? (
        <Text variant="body" muted style={styles.center}>
          {message}
        </Text>
      ) : null}
      {action ? <View style={styles.action}>{action}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.xl,
  },
  icon: { fontSize: 48, marginBottom: spacing.sm },
  center: { textAlign: 'center' },
  action: { marginTop: spacing.lg, alignSelf: 'stretch' },
});
