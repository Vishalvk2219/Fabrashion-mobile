import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import { ApiError } from '@/api/client';
import { Screen } from '@/components/layout/screen';
import { Button, Input, Text } from '@/components/ui';
import { useLogin } from '@/features/auth/hooks';
import { loginSchema, type LoginInput } from '@/features/auth/schema';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/tokens';

export default function LoginScreen() {
  const { control, handleSubmit } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });
  const login = useLogin();

  return (
    <Screen contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text variant="largeTitle">Welcome back</Text>
        <Text variant="body" muted>
          Sign in to continue shopping.
        </Text>
      </View>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value }, fieldState }) => (
          <Input
            label="Email"
            placeholder="you@example.com"
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value }, fieldState }) => (
          <Input
            label="Password"
            placeholder="••••••••"
            secureTextEntry
            autoComplete="current-password"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            error={fieldState.error?.message}
          />
        )}
      />

      {login.isError ? (
        <Text variant="caption" color={colors.danger} selectable>
          {login.error instanceof ApiError
            ? login.error.message
            : 'Unable to sign in. Check your connection and try again.'}
        </Text>
      ) : null}

      <Button
        title="Sign in"
        loading={login.isPending}
        onPress={handleSubmit((values) => login.mutate(values))}
      />

      <View style={styles.footer}>
        <Text variant="body" muted>
          New here?{' '}
        </Text>
        <Link href="/register">
          <Text variant="body" color={colors.primary}>
            Create an account
          </Text>
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { justifyContent: 'center', gap: spacing.lg },
  header: { gap: spacing.xs },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
});
