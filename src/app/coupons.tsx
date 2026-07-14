import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, Text } from '@/components/ui';
import { colors } from '@/theme/colors';
import { fontFamily } from '@/theme/typography';

const COUPONS = [
  { code: 'ANDRO40', title: '40% off Premium Coats', desc: 'Min. spend ₹9,999 · The Autumn Edit', saved: '₹8,000' },
  { code: 'WELCOME15', title: 'Flat 15% off first order', desc: 'For new members · Max ₹2,500', saved: '₹2,500' },
  { code: 'GOLD500', title: '₹500 off for Gold members', desc: 'No minimum spend', saved: '₹500' },
];

export default function CouponsScreen() {
  const insets = useSafeAreaInsets();
  const [code, setCode] = useState('');
  const [applied, setApplied] = useState<{ code: string; saved: string } | null>(null);

  const apply = (c: { code: string; saved: string }) => {
    setApplied(c);
    setCode('');
  };

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable style={styles.back} onPress={() => router.back()} hitSlop={6}>
          <Icon name="arrow_back" size={22} color={colors.label} />
        </Pressable>
        <Text serif weight="600" size={24}>
          Coupons
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.entry}>
          <Icon name="confirmation_number" size={22} color={colors.accent} />
          <TextInput
            value={code}
            onChangeText={setCode}
            placeholder="Enter coupon code"
            placeholderTextColor={colors.faint}
            autoCapitalize="characters"
            style={styles.input}
          />
          <Pressable
            style={styles.applyBtn}
            onPress={() => code.trim() && apply({ code: code.trim().toUpperCase(), saved: '₹500' })}>
            <Text weight="600" size={13} color={colors.onPrimary}>
              Apply
            </Text>
          </Pressable>
        </View>

        {applied ? (
          <View style={styles.appliedBanner}>
            <Icon name="check_circle" size={22} fill color="#1F8A5B" />
            <View style={{ flex: 1 }}>
              <Text weight="700" size={13}>
                ‘{applied.code}’ applied
              </Text>
              <Text size={12} color="#4A7A5E" style={{ marginTop: 1 }}>
                You saved {applied.saved} on this order.
              </Text>
            </View>
          </View>
        ) : null}

        <Text uppercase size={11} track={0.12} color={colors.muted2} style={styles.sectionLabel}>
          Available for you
        </Text>
        {COUPONS.map((c) => (
          <View key={c.code} style={styles.card}>
            <View style={styles.iconBox}>
              <Icon name="sell" size={24} color={colors.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text weight="700" size={14}>
                {c.title}
              </Text>
              <Text size={12} muted style={styles.desc}>
                {c.desc}
              </Text>
              <View style={styles.cardFooter}>
                <View style={styles.codeChip}>
                  <Text weight="700" size={12} track={0.08}>
                    {c.code}
                  </Text>
                </View>
                <Pressable onPress={() => apply({ code: c.code, saved: c.saved })}>
                  <Text weight="700" size={13} color={colors.accent}>
                    APPLY
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.backgroundAlt },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: colors.background,
  },
  back: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { padding: 20, paddingBottom: 24 },
  entry: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.background,
    borderRadius: 16,
    borderCurve: 'continuous',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#D8D2C6',
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
    marginBottom: 20,
  },
  input: { flex: 1, fontFamily: fontFamily.sansMedium, fontSize: 14, color: colors.label, letterSpacing: 1 },
  applyBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 20,
  },
  appliedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#E7F0EA',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
  },
  sectionLabel: { marginBottom: 12 },
  card: {
    flexDirection: 'row',
    gap: 14,
    backgroundColor: colors.background,
    borderRadius: 16,
    borderCurve: 'continuous',
    padding: 16,
    marginBottom: 12,
  },
  iconBox: {
    width: 52,
    backgroundColor: colors.accentSoft,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  desc: { lineHeight: 17, marginTop: 3 },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    borderStyle: 'dashed',
  },
  codeChip: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.disabled,
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
});
