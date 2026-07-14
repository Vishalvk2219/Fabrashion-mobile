import { Stack } from 'expo-router/stack';

export default function TrialsStack() {
  return (
    <Stack screenOptions={{ headerLargeTitle: true }}>
      <Stack.Screen name="index" options={{ title: 'My Trials' }} />
    </Stack>
  );
}
