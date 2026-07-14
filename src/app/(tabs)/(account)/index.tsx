import { Screen } from '@/components/layout/screen';
import { Button, Card, Text } from '@/components/ui';
import { useSession } from '@/features/auth/hooks';
import { useAuthStore } from '@/features/auth/store';

export default function AccountScreen() {
  const { user } = useSession();
  const signOut = useAuthStore((s) => s.signOut);

  return (
    <Screen>
      <Card>
        <Text variant="title">{user?.fullName ?? 'Guest'}</Text>
        {user?.email ? (
          <Text muted selectable>
            {user.email}
          </Text>
        ) : null}
        {user?.phone ? (
          <Text muted selectable>
            {user.phone}
          </Text>
        ) : null}
        <Text variant="caption" muted>
          Role · {user?.role ?? 'CUSTOMER'}
        </Text>
      </Card>

      <Card>
        <Text variant="headline">Orders</Text>
        <Text variant="body" muted>
          Your order history appears here once checkout ships (Phase 4).
        </Text>
      </Card>

      <Button title="Sign out" variant="secondary" onPress={() => signOut()} />
    </Screen>
  );
}
