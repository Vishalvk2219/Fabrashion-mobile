import { Stack } from 'expo-router/stack';

import { colors } from '@/theme';

/** First-run brand flow: index redirects to splash (or straight to login if already onboarded). */
export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'fade',
      }}
    />
  );
}
