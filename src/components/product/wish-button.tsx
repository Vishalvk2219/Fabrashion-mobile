import { StyleSheet } from 'react-native';

import { Icon, PressableScale } from '@/components/ui';
import { useWishlistStore } from '@/features/wishlist/store';
import { tap } from '@/lib/haptics';
import { colors } from '@/theme/colors';

/** Circular heart toggle used on product imagery. Filled gold when saved. */
export function WishButton({ id, size = 32 }: { id: string; size?: number }) {
  const wished = useWishlistStore((s) => s.ids.includes(id));
  const toggle = useWishlistStore((s) => s.toggle);
  return (
    <PressableScale
      scaleTo={0.82}
      onPressIn={tap}
      onPress={() => toggle(id)}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityLabel={wished ? 'Remove from wishlist' : 'Add to wishlist'}
      style={[styles.btn, { width: size, height: size, borderRadius: size / 2 }]}>
      <Icon name="favorite" size={size * 0.56} fill={wished} color={wished ? colors.accent : colors.label} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
