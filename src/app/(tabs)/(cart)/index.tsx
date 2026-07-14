import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/layout/screen';
import { Button, Card, EmptyState, Loader, Text } from '@/components/ui';
import { useCart } from '@/features/cart/hooks';
import { formatPaise } from '@/lib/money';
import { spacing } from '@/theme/tokens';

export default function CartScreen() {
  const router = useRouter();
  const { data: cart, isLoading, isError } = useCart();
  const items = cart?.items ?? [];

  if (isLoading) return <Loader label="Loading cart…" />;

  if (isError || items.length === 0) {
    return (
      <EmptyState
        icon="🛒"
        title="Your cart is empty"
        message="Items you add show up here with server-computed totals."
        action={<Button title="Start shopping" onPress={() => router.navigate('/')} />}
      />
    );
  }

  return (
    <Screen>
      {items.map((item) => (
        <Card key={item.id} style={styles.row}>
          <View style={styles.rowMain}>
            <Text variant="headline" numberOfLines={1}>
              {item.variant?.productName ?? item.variantId}
            </Text>
            <Text variant="caption" muted>
              {item.variant ? `${item.variant.size} · ${item.variant.colorName}` : ''} · Qty{' '}
              {item.quantity}
            </Text>
          </View>
          {item.variant ? (
            <Text variant="headline">{formatPaise(item.variant.pricePaise * item.quantity)}</Text>
          ) : null}
        </Card>
      ))}

      {cart ? (
        <Card>
          <View style={styles.totalRow}>
            <Text variant="body" muted>
              Subtotal
            </Text>
            <Text variant="body">{formatPaise(cart.subtotalPaise)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text variant="body" muted>
              Shipping
            </Text>
            <Text variant="body">{formatPaise(cart.shippingPaise)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text variant="headline">Total</Text>
            <Text variant="headline">{formatPaise(cart.totalPaise)}</Text>
          </View>
        </Card>
      ) : null}

      <Button title="Checkout" onPress={() => router.navigate('/')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowMain: { flex: 1, gap: spacing.xs, paddingRight: spacing.md },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between' },
});
