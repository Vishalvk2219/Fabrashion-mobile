import { Stack } from 'expo-router/stack';

export default function AccountStack() {
  return (
    <Stack screenOptions={{ headerLargeTitle: true }}>
      <Stack.Screen name="index" options={{ title: 'Account' }} />
    </Stack>
  );
}
