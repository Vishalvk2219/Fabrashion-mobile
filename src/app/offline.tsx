import { router } from 'expo-router';

import { StatusView } from '@/components/layout/status-view';

export default function OfflineScreen() {
  return (
    <StatusView
      showBack
      icon="wifi_off"
      title="You're offline"
      message="Check your internet connection and try again."
      primaryLabel="Retry"
      primaryIcon="refresh"
      onPrimary={() => router.back()}
    />
  );
}
