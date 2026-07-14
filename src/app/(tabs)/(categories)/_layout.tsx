import { Stack } from 'expo-router/stack';

export default function CategoriesStack() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="listing" />
    </Stack>
  );
}
