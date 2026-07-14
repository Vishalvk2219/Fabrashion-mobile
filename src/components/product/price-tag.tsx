import { StyleSheet, useColorScheme, View } from 'react-native';

import { Text } from '@/components/ui';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/tokens';
import { discountPct, formatPaiseCompact } from '@/lib/money';

type Props = {
  pricePaise: number;
  mrpPaise?: number;
  size?: 'sm' | 'lg';
};

/** Selling price with struck-through MRP and a discount %, all formatted via `lib/money`. */
export function PriceTag({ pricePaise, mrpPaise, size = 'sm' }: Props) {
  useColorScheme();
  const pct = mrpPaise ? discountPct(pricePaise, mrpPaise) : 0;
  return (
    <View style={styles.row}>
      <Text variant={size === 'lg' ? 'title' : 'headline'}>{formatPaiseCompact(pricePaise)}</Text>
      {pct > 0 && mrpPaise ? (
        <>
          <Text variant="caption" muted style={styles.strike}>
            {formatPaiseCompact(mrpPaise)}
          </Text>
          <Text variant="caption" color={colors.success}>
            {pct}% off
          </Text>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm, flexWrap: 'wrap' },
  strike: { textDecorationLine: 'line-through' },
});
