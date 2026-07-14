import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import { ApiError } from '@/api/client';
import { Screen } from '@/components/layout/screen';
import { Button, Input, Text } from '@/components/ui';
import { useRegister } from '@/features/auth/hooks';
import { registerSchema, type RegisterInput } from '@/features/auth/schema';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/tokens';

export default function RegisterScreen() {
  const { control, handleSubmit } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', email: '', phone: '', password: '' },
  });
  const register = useRegister();

  return (
    <Screen contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text variant="largeTitle">Create account</Text>
        <Text variant="body" muted>
          Join to shop and book at-home trials.
        </Text>
      </View>

      <Controller
        control={control}
        name="fullName"
        render={({ field: { onChange, onBlur, value }, fieldState }) => (
          <Input
            label="Full name"
            placeholder="Priya Sharma"
            autoCapitalize="words"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            error={fieldState.error?.message}
          />
        )}
      />
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
        name="phone"
        render={({ field: { onChange, onBlur, value }, fieldState }) => (
          <Input
            label="Mobile number"
            placeholder="9876543210"
            keyboardType="phone-pad"
            autoComplete="tel"
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
            placeholder="At least 8 characters"
            secureTextEntry
            autoComplete="new-password"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            error={fieldState.error?.message}
          />
        )}
      />

      {register.isError ? (
        <Text variant="caption" color={colors.danger} selectable>
          {register.error instanceof ApiError
            ? register.error.message
            : 'Unable to register. Check your connection and try again.'}
        </Text>
      ) : null}

      <Button
        title="Create account"
        loading={register.isPending}
        onPress={handleSubmit((values) => register.mutate(values))}
      />

      <View style={styles.footer}>
        <Text variant="body" muted>
          Already have an account?{' '}
        </Text>
        <Link href="/login">
          <Text variant="body" color={colors.primary}>
            Sign in
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
