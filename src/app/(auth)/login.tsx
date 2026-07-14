import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Icon, Text } from '@/components/ui';
import { useRequestOtp } from '@/features/auth/hooks';
import { colors } from '@/theme';
import { fontFamily } from '@/theme/typography';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const [phone, setPhone] = useState('');
  const requestOtp = useRequestOtp();

  const valid = /^[6-9]\d{9}$/.test(phone);

  const onContinue = () => {
    if (!valid) return;
    requestOtp.mutate(phone, {
      onSuccess: (res) =>
        router.push({ pathname: '/otp', params: { phone, devCode: res.devCode ?? '' } }),
    });
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 52, paddingBottom: insets.bottom + 24 }]}>
      <View>
        <Text serif weight="600" size={42} track={0.1}>
          ANDRÓ
        </Text>
        <Text serif weight="500" size={26} style={styles.welcome}>
          Welcome back.
        </Text>
        <Text muted size={14} style={styles.sub}>
          Sign in to continue to your curated world of fashion.
        </Text>
      </View>

      <View style={styles.form}>
        <Text uppercase size={11} track={0.12} color={colors.muted2} style={styles.label}>
          Phone Number
        </Text>
        <View style={styles.phoneField}>
          <Text weight="600" size={15}>
            🇮🇳 +91
          </Text>
          <View style={styles.divider} />
          <TextInput
            value={phone}
            onChangeText={(t) => setPhone(t.replace(/[^0-9]/g, '').slice(0, 10))}
            placeholder="98765 43210"
            placeholderTextColor={colors.muted2}
            keyboardType="phone-pad"
            style={styles.phoneInput}
            maxLength={10}
          />
        </View>

        {requestOtp.isError ? (
          <Text size={12} color={colors.danger} style={styles.error}>
            {requestOtp.error instanceof Error ? requestOtp.error.message : 'Could not send code. Try again.'}
          </Text>
        ) : null}

        <View style={styles.continue}>
          <Button
            title="Continue"
            onPress={onContinue}
            loading={requestOtp.isPending}
            disabled={!valid}
          />
        </View>

        <View style={styles.orRow}>
          <View style={styles.orLine} />
          <Text size={11} track={0.1} color={colors.faint}>
            OR
          </Text>
          <View style={styles.orLine} />
        </View>

        {/* Social sign-in is a later phase (backend delta); presentational for now. */}
        <Pressable style={[styles.social, styles.socialSpaced]} disabled>
          <Text serif weight="700" size={19} color="#4285F4">
            G
          </Text>
          <Text weight="600" size={14}>
            Continue with Google
          </Text>
        </Pressable>
        <Pressable style={styles.social} disabled>
          <Icon name="phone_iphone" size={20} color={colors.label} />
          <Text weight="600" size={14}>
            Continue with Apple
          </Text>
        </Pressable>
      </View>

      <Text size={11} align="center" color={colors.faint} style={styles.terms}>
        By continuing you agree to our{'\n'}
        <Text size={11} weight="600" color={colors.label}>
          Terms
        </Text>{' '}
        &amp;{' '}
        <Text size={11} weight="600" color={colors.label}>
          Privacy Policy
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 28 },
  welcome: { marginTop: 36 },
  sub: { marginTop: 8, lineHeight: 21 },
  form: { marginTop: 40 },
  label: { marginBottom: 10 },
  phoneField: {
    height: 56,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    borderRadius: 14,
    borderCurve: 'continuous',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  divider: { width: 1, height: 22, backgroundColor: colors.divider },
  phoneInput: {
    flex: 1,
    fontFamily: fontFamily.sansMedium,
    fontSize: 16,
    letterSpacing: 1,
    color: colors.label,
  },
  error: { marginTop: 12 },
  continue: { marginTop: 20 },
  orRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginVertical: 28 },
  orLine: { flex: 1, height: 1, backgroundColor: colors.hairline },
  social: {
    height: 54,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    borderCurve: 'continuous',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  socialSpaced: { marginBottom: 12 },
  terms: { marginTop: 'auto', lineHeight: 18 },
});
