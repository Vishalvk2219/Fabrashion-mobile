import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { DefaultTheme, ThemeProvider } from 'expo-router';
import { Stack } from 'expo-router/stack';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { queryClient } from '@/api/queryClient';
import { isAdmin, isStaff } from '@/features/auth/schema';
import { useAuthStore } from '@/features/auth/store';
import { colors, fontAssets } from '@/theme';

SplashScreen.preventAutoHideAsync();

/** Light-only navigation theme in ANDRÓ colors (design is a single fixed light theme). */
const navTheme: typeof DefaultTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.background,
    text: colors.label,
    primary: colors.accent,
    border: colors.hairline,
    notification: colors.accent,
  },
};

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);
  const status = useAuthStore((s) => s.status);
  const role = useAuthStore((s) => s.user?.role);
  const hydrate = useAuthStore((s) => s.hydrate);

  // Read persisted tokens once on boot to resolve the auth gate.
  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  const fontsReady = fontsLoaded || !!fontError;

  // Keep the splash up until fonts are ready AND we know whether the user is signed in.
  useEffect(() => {
    if (status !== 'loading' && fontsReady) void SplashScreen.hideAsync();
  }, [status, fontsReady]);

  if (status === 'loading' || !fontsReady) return null;

  const isAuthenticated = status === 'authenticated';
  // Role selects the shell: staff/admin get their own back-office stacks, customers the shop.
  const staff = isAuthenticated && isStaff(role);
  const admin = isAuthenticated && isAdmin(role);
  const customer = isAuthenticated && !staff && !admin;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <ThemeProvider value={navTheme}>
            <StatusBar style="dark" />
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
              <Stack.Protected guard={staff}>
                <Stack.Screen name="(staff)" />
              </Stack.Protected>
              <Stack.Protected guard={admin}>
                <Stack.Screen name="(admin)" />
              </Stack.Protected>
              <Stack.Protected guard={customer}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="product/[id]" />
                <Stack.Screen name="search" />
                <Stack.Screen name="checkout" />
                <Stack.Screen name="payment-success" />
                <Stack.Screen name="payment-failed" />
                <Stack.Screen name="order-tracking" />
                <Stack.Screen name="try-home" />
                <Stack.Screen name="trial/[id]" />
                <Stack.Screen name="notifications" />
                <Stack.Screen name="reviews" />
                <Stack.Screen name="coupons" />
                <Stack.Screen name="addresses" />
                <Stack.Screen name="address-form" />
                <Stack.Screen name="settings" />
                <Stack.Screen name="help" />
                <Stack.Screen name="orders" />
                <Stack.Screen name="offline" />
                <Stack.Screen name="server-error" />
                <Stack.Screen name="session-expired" />
              </Stack.Protected>
              <Stack.Protected guard={!isAuthenticated}>
                <Stack.Screen name="(auth)" />
              </Stack.Protected>
            </Stack>
          </ThemeProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
