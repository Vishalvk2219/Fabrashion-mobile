import { EmptyState } from '@/components/ui';

export default function TrialsScreen() {
  return (
    <EmptyState
      icon="🏠"
      title="No at-home trials yet"
      message="Book trial-eligible items to try at home, keep what you love, and return the rest. Trial booking arrives with backend Phase 6."
    />
  );
}
