import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Icon, Text } from '@/components/ui';
import { useRequestOtp, useVerifyOtp } from '@/features/auth/hooks';
import { colors } from '@/theme';

const LENGTH = 4;

export default function OtpScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ phone?: string; devCode?: string }>();
  const phone = params.phone ?? '';
  const devCode = params.devCode || '';
  const number = phone ? `+91 ${phone}` : '';

  const verifyOtp = useVerifyOtp();
  const requestOtp = useRequestOtp();

  const inputRef = useRef<TextInput>(null);
  // Prefill the dev code so the flow is one tap when there's no SMS provider.
  const [code, setCode] = useState(devCode);
  const [secs, setSecs] = useState(24);

  useEffect(() => {
    const id = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  // On success the auth store flips the gate and the root layout routes to the right shell.
  const verify = () => {
    if (code.length < LENGTH) {
      inputRef.current?.focus();
      return;
    }
    verifyOtp.mutate({ phone, code });
  };

  const resend = () => {
    if (secs > 0) return;
    requestOtp.mutate(phone, { onSuccess: () => setSecs(24) });
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 16 }]}>
      <Pressable style={styles.back} onPress={() => router.back()} hitSlop={8}>
        <Icon name="arrow_back" size={22} color={colors.label} />
      </Pressable>

      <View style={styles.header}>
        <Text serif weight="600" size={34}>
          Verify your number
        </Text>
        <Text muted size={14} style={styles.sub}>
          Enter the {LENGTH}-digit code sent to{'\n'}
          <Text weight="600" size={14} color={colors.label}>
            {number}
          </Text>
        </Text>
      </View>

      <Pressable style={styles.boxes} onPress={() => inputRef.current?.focus()}>
        {Array.from({ length: LENGTH }).map((_, i) => {
          const digit = code[i];
          const active = i === code.length;
          const borderColor = digit ? colors.borderStrong : active ? colors.accent : colors.border;
          return (
            <View key={i} style={[styles.box, { borderColor }]}>
              {digit ? (
                <Text weight="600" size={24}>
                  {digit}
                </Text>
              ) : active ? (
                <View style={styles.caret} />
              ) : null}
            </View>
          );
        })}
        <TextInput
          ref={inputRef}
          value={code}
          onChangeText={(t) => setCode(t.replace(/[^0-9]/g, '').slice(0, LENGTH))}
          keyboardType="number-pad"
          autoFocus
          maxLength={LENGTH}
          caretHidden
          style={styles.hiddenInput}
        />
      </Pressable>

      <View style={styles.resendRow}>
        <Text size={13} muted>
          Resend code in{' '}
          <Text size={13} weight="600" color={colors.label}>
            00:{String(secs).padStart(2, '0')}
          </Text>
        </Text>
        <Pressable onPress={resend} disabled={secs > 0} hitSlop={8}>
          <Text size={13} weight="600" color={secs === 0 ? colors.accent : colors.faint}>
            Resend OTP
          </Text>
        </Pressable>
      </View>

      {verifyOtp.isError ? (
        <Text size={12} color={colors.danger} style={styles.error}>
          {verifyOtp.error instanceof Error ? verifyOtp.error.message : 'Invalid code. Try again.'}
        </Text>
      ) : null}

      {__DEV__ && devCode ? (
        <Text size={11} align="center" color={colors.muted2} style={styles.devHint}>
          Dev code: {devCode}
        </Text>
      ) : null}

      <View style={styles.cta}>
        <Button title="Verify & Continue" onPress={verify} loading={verifyOtp.isPending} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 28 },
  back: {
    marginTop: 44,
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: { marginTop: 32 },
  sub: { marginTop: 10, lineHeight: 21 },
  boxes: { flexDirection: 'row', gap: 12, marginTop: 40 },
  box: {
    flex: 1,
    aspectRatio: 1,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
  caret: { width: 2, height: 26, backgroundColor: colors.accent },
  hiddenInput: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, opacity: 0 },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  error: { marginTop: 18, textAlign: 'center' },
  devHint: { marginTop: 14 },
  cta: { marginTop: 36 },
});
