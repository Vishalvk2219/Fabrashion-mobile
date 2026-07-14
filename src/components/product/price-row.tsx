import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { formatPaiseCompact } from '@/lib/money';
import { colors } from '@/theme/colors';

type Props = {
  pricePaise: number;
  mrpPaise?: number;
  offerPct?: number;
  /** `sm` on cards, `lg` on the product page. */
  size?: 'sm' | 'lg';
  /** Show the struck-through MRP. */
  strike?: boolean;
  /** Show the gold discount percentage. */
  showOffer?: boolean;
};

/** Price + optional struck MRP + optional gold discount — the design's recurring price line. */
export function PriceRow({
  pricePaise,
  mrpPaise,
  offerPct,
  size = 'sm',
  strike = true,
  showOffer = false,
}: Props) {
  const lg = size === 'lg';
  const showStrike = strike && mrpPaise != null && mrpPaise > pricePaise;
  return (
    <View style={styles.row}>
      <Text weight="700" size={lg ? 22 : 13}>
        {formatPaiseCompact(pricePaise)}
      </Text>
      {showStrike ? (
        <Text size={lg ? 14 : 10} color={colors.strike} style={styles.strike}>
          {formatPaiseCompact(mrpPaise!)}
        </Text>
      ) : null}
      {showOffer && offerPct ? (
        <Text weight="700" size={lg ? 12 : 10} color={colors.accent}>
          {offerPct}% OFF
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  strike: { textDecorationLine: 'line-through' },
});
