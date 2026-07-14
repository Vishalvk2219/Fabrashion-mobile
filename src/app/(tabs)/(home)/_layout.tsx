import { Stack } from 'expo-router/stack';

export default function HomeStack() {
  return (
    <Stack screenOptions={{ headerLargeTitle: true }}>
      <Stack.Screen name="index" options={{ title: 'Shop' }} />
      <Stack.Screen name="product/[id]" options={{ title: 'Product', headerLargeTitle: false }} />
    </Stack>
  );
}
