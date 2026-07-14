import { router } from 'expo-router';

import { AddItemForm } from '@/components/backoffice/add-item-form';

export default function StaffAddItem() {
  return <AddItemForm cta="Add to Inventory" onBack={() => router.back()} />;
}
