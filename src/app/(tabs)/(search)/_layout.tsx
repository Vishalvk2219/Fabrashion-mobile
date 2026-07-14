import { Stack } from 'expo-router/stack';

export default function SearchStack() {
  return (
    <Stack screenOptions={{ headerLargeTitle: true }}>
      <Stack.Screen
        name="index"
        options={{ title: 'Search', headerSearchBarOptions: { placeholder: 'Search products' } }}
      />
    </Stack>
  );
}
