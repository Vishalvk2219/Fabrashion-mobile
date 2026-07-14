import { Stack } from 'expo-router/stack';

export default function AdminCatalogStack() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="add-item" />
    </Stack>
  );
}
