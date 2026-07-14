import { Stack } from 'expo-router/stack';

/** Land unauthenticated users on the login screen. */
export const unstable_settings = { anchor: 'login' };

export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
