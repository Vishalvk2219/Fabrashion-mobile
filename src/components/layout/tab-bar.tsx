import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { colors } from '@/theme/colors';
import { radii, spacing } from '@/theme/tokens';
import type { IconName } from '@/theme/material-icons';

/** Minimal subset of react-navigation's BottomTabBarProps that this bar uses. */
type TabBarProps = {
  state: { index: number; routes: { key: string; name: string }[] };
  navigation: {
    emit: (event: {
      type: 'tabPress';
      target: string;
      canPreventDefault: true;
    }) => { defaultPrevented: boolean };
    navigate: (name: string) => void;
  };
};

export type TabMeta = { icon: IconName; label: string };
/** Route-group name → icon + label. Order follows the `Tabs.Screen` order in the layout. */
export type TabConfig = Record<string, TabMeta>;

/**
 * ANDRÓ custom bottom nav — translucent glass bar, gold active pill, filled active icon.
 * The presentational bar is role-agnostic; pass the route-group→meta map for the shell.
 */
export function GlassTabBar({ state, navigation, tabs }: TabBarProps & { tabs: TabConfig }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 14) }]}>
      {state.routes.map((route, index) => {
        const meta = tabs[route.name];
        if (!meta) return null;
        const focused = state.index === index;
        const color = focused ? colors.label : colors.navInactive;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityState={{ selected: focused }}
            style={styles.item}>
            <View style={[styles.pill, focused && { backgroundColor: colors.accentSoft }]}>
              <Icon name={meta.icon} size={23} weight={300} fill={focused} color={color} />
            </View>
            <Text size={10.5} weight="600" color={color}>
              {meta.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/** Customer shell tabs — Home · Categories · Wishlist · Cart · Profile. */
const CUSTOMER_TABS: TabConfig = {
  '(home)': { icon: 'home', label: 'Home' },
  '(categories)': { icon: 'grid_view', label: 'Categories' },
  '(wishlist)': { icon: 'favorite', label: 'Wishlist' },
  '(cart)': { icon: 'shopping_bag', label: 'Cart' },
  '(profile)': { icon: 'person', label: 'Profile' },
};

export function AndroTabBar(props: TabBarProps) {
  return <GlassTabBar {...props} tabs={CUSTOMER_TABS} />;
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  item: { flex: 1, alignItems: 'center', gap: 5 },
  pill: {
    width: 58,
    height: 30,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
