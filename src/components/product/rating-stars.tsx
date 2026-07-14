import { StyleSheet, View } from 'react-native';

import { Icon, Text } from '@/components/ui';
import { colors } from '@/theme/colors';

/** Gold star + numeric rating. Renders nothing when rating is unknown (no reviews backend yet). */
export function RatingStars({
  rating,
  count,
  size = 13,
}: {
  rating: number | null;
  count?: number | null;
  size?: number;
}) {
  if (rating == null) return null;
  return (
    <View style={styles.row}>
      <Icon name="star" size={size} fill color={colors.accent} />
      <Text weight="600" size={size - 2} color={colors.label2}>
        {rating.toFixed(1)}
      </Text>
      {count != null ? (
        <Text size={size - 2} color={colors.muted2}>
          ({count})
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 3 },
});
