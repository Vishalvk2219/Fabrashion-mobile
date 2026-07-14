import { Stack } from 'expo-router/stack';

export default function StaffInventoryStack() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="update-stock" />
      <Stack.Screen name="add-item" />
      <Stack.Screen name="sync-queue" />
    </Stack>
  );
}
