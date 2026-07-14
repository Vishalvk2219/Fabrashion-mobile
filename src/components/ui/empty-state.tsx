import { StyleSheet, View } from 'react-native';

import { colors } from '@/theme/colors';
import { radii, spacing } from '@/theme/tokens';
import { glyphs, type IconName } from '@/theme/material-icons';
import { Icon } from './icon';
import { Text } from './text';

type Props = {
  /** A Material Symbol name (rendered in a circle) OR an emoji/glyph string (back-compat). */
  icon?: string;
  title: string;
  message?: string;
  /** Optional call-to-action (e.g. a Button). */
  action?: React.ReactNode;
};

/** ANDRÓ empty/placeholder state: iconed circle, serif title, muted body, optional CTA. */
export function EmptyState({ icon, title, message, action }: Props) {
  const isGlyph = !!icon && icon in glyphs;
  return (
    <View style={styles.container}>
      {icon ? (
        isGlyph ? (
          <View style={styles.circle}>
            <Icon name={icon as IconName} size={40} weight={300} color={colors.accent} />
          </View>
        ) : (
          <Text style={styles.emoji}>{icon}</Text>
        )
      ) : null}
      <Text serif weight="600" size={26} align="center">
        {title}
      </Text>
      {message ? (
        <Text muted size={14} align="center" style={styles.message}>
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
    gap: spacing.md,
    padding: spacing.xxl,
    backgroundColor: colors.background,
  },
  circle: {
    width: 96,
    height: 96,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  emoji: { fontSize: 48, marginBottom: spacing.sm },
  message: { maxWidth: 280, lineHeight: 22 },
  action: { marginTop: spacing.lg, alignSelf: 'stretch' },
});
