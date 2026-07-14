import { Stack } from 'expo-router/stack';

export default function AdminStaffStack() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="add-staff" />
    </Stack>
  );
}
