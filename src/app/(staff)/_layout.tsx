import { useEffect } from 'react';
import { Tabs } from 'expo-router';

import { GlassTabBar, type TabConfig } from '@/components/layout/tab-bar';
import { useStaffStore } from '@/features/staff/store';

/** Staff (Store Ops) shell — Dashboard · Inventory · Orders · Profile. Reached when the signed-in
 * account's role is STAFF (see src/app/_layout.tsx). Each tab is a group with its own Stack; the
 * Inventory tab pushes Update Stock / Add Item / Sync Queue. Screens draw their own headers. */
const STAFF_TABS: TabConfig = {
  '(dashboard)': { icon: 'space_dashboard', label: 'Dashboard' },
  '(inventory)': { icon: 'inventory_2', label: 'Inventory' },
  '(orders)': { icon: 'local_shipping', label: 'Orders' },
  '(profile)': { icon: 'person', label: 'Profile' },
};

export default function StaffLayout() {
  const flush = useStaffStore((s) => s.flush);
  // Stock edits queued offline (persisted) upload as soon as the shell opens.
  useEffect(() => {
    void flush();
  }, [flush]);

  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <GlassTabBar {...props} tabs={STAFF_TABS} />}>
      <Tabs.Screen name="(dashboard)" />
      <Tabs.Screen name="(inventory)" />
      <Tabs.Screen name="(orders)" />
      <Tabs.Screen name="(profile)" />
    </Tabs>
  );
}
