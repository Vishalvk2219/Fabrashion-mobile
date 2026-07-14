import { Tabs } from 'expo-router';

import { GlassTabBar, type TabConfig } from '@/components/layout/tab-bar';

/** Admin shell — Overview · Catalog · Staff · Orders. Reached when the signed-in account's role is
 * ADMIN (see src/app/_layout.tsx). Each tab is a group with its own Stack; the Staff tab pushes
 * Add Staff. Screens draw their own headers. */
const ADMIN_TABS: TabConfig = {
  '(overview)': { icon: 'monitoring', label: 'Overview' },
  '(catalog)': { icon: 'style', label: 'Catalog' },
  '(staff)': { icon: 'groups', label: 'Staff' },
  '(orders)': { icon: 'receipt_long', label: 'Orders' },
};

export default function AdminLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <GlassTabBar {...props} tabs={ADMIN_TABS} />}>
      <Tabs.Screen name="(overview)" />
      <Tabs.Screen name="(catalog)" />
      <Tabs.Screen name="(staff)" />
      <Tabs.Screen name="(orders)" />
    </Tabs>
  );
}
