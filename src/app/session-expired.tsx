import { StatusView } from '@/components/layout/status-view';
import { useAuthStore } from '@/features/auth/store';

export default function SessionExpiredScreen() {
  const signOut = useAuthStore((s) => s.signOut);
  return (
    <StatusView
      icon="lock_clock"
      title="Session Expired"
      message="For your security, you've been signed out. Please log in again to continue."
      primaryLabel="Log In Again"
      onPrimary={() => void signOut()}
    />
  );
}
