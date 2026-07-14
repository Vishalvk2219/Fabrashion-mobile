import { Stack, useRouter } from 'expo-router';

import { Screen } from '@/components/layout/screen';
import { Button, EmptyState } from '@/components/ui';

export default function NotFoundScreen() {
  const router = useRouter();
  return (
    <>
      <Stack.Screen options={{ title: 'Not found' }} />
      <Screen contentContainerStyle={{ justifyContent: 'center' }}>
        <EmptyState
          icon="🧭"
          title="Page not found"
          message="That screen doesn't exist."
          action={<Button title="Go home" onPress={() => router.navigate('/')} />}
        />
      </Screen>
    </>
  );
}
