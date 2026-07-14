import { Tabs } from 'expo-router';

import { AndroTabBar } from '@/components/layout/tab-bar';

/**
 * Bottom tab bar — a custom ANDRÓ "glass" bar (not NativeTabs; see plans/13-andro-redesign.md).
 * Five tabs; each is a route group with its own Stack so screens keep independent history.
 * Screens draw their own headers (headerShown: false), matching the design's bespoke top bars.
 */
export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <AndroTabBar {...props} />}>
      <Tabs.Screen name="(home)" />
      <Tabs.Screen name="(categories)" />
      <Tabs.Screen name="(wishlist)" />
      <Tabs.Screen name="(cart)" />
      <Tabs.Screen name="(profile)" />
    </Tabs>
  );
}
