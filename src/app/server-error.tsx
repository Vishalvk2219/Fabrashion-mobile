import { router } from 'expo-router';

import { StatusView } from '@/components/layout/status-view';

export default function ServerErrorScreen() {
  return (
    <StatusView
      showBack
      icon="cloud_off"
      iconColor="#B03A3A"
      circleBg="#FBEDED"
      title="Something went wrong"
      message="Our servers are having a moment. Please try again shortly."
      caption="Error 500 · ANDRO-SVC"
      primaryLabel="Try Again"
      primaryIcon="refresh"
      onPrimary={() => router.back()}
    />
  );
}
