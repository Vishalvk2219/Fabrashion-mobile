import { Stack } from 'expo-router/stack';

export default function CartStack() {
  return (
    <Stack screenOptions={{ headerLargeTitle: true }}>
      <Stack.Screen name="index" options={{ title: 'Cart' }} />
    </Stack>
  );
}
