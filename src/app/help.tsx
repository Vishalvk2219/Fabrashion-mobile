import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, Text } from '@/components/ui';
import { colors } from '@/theme/colors';
import type { IconName } from '@/theme/material-icons';

const CONTACTS: { icon: IconName; title: string; sub: string; dark?: boolean }[] = [
  { icon: 'chat_bubble', title: 'Chat Support', sub: 'Avg. reply 2 min', dark: true },
  { icon: 'call', title: 'Call Support', sub: '9 AM – 9 PM' },
  { icon: 'mail', title: 'Email Us', sub: '24h reply' },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: 'How does Try at Home work?',
    a: 'Select up to 10 pieces, book a slot, and our stylist brings them home. Keep what you love, pay only for those — the ₹499 fee is fully refundable.',
  },
  { q: 'What is the return policy?', a: 'Enjoy easy 15-day returns on all pieces, no questions asked, as long as tags are intact.' },
  { q: 'How do I track my order?', a: 'Open My Orders → Track Order for a live map and status timeline of your delivery.' },
  { q: 'Which payment methods are accepted?', a: 'UPI (GPay, PhonePe, Paytm), all major credit/debit cards, and net banking — securely via PhonePe.' },
];

export default function HelpScreen() {
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(0);

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable style={styles.back} onPress={() => router.back()} hitSlop={6}>
          <Icon name="arrow_back" size={22} color={colors.label} />
        </Pressable>
        <Text serif weight="600" size={24}>
          Help & Support
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.contacts}>
          {CONTACTS.map((c) => (
            <Pressable key={c.title} style={[styles.contact, c.dark ? styles.contactDark : styles.contactLight]}>
              <Icon name={c.icon} size={24} color={colors.accent} />
              <Text weight="600" size={13} color={c.dark ? colors.white : colors.label}>
                {c.title}
              </Text>
              <Text size={10} color={c.dark ? colors.onDarkMuted : colors.muted}>
                {c.sub}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text weight="700" size={13} style={{ marginBottom: 12 }}>
          Frequently Asked
        </Text>
        <View style={styles.faqGroup}>
          {FAQS.map((f, i) => {
            const isOpen = i === open;
            return (
              <View key={f.q} style={i < FAQS.length - 1 && styles.faqBorder}>
                <Pressable style={styles.faqRow} onPress={() => setOpen(isOpen ? -1 : i)}>
                  <Text weight="500" size={13} style={{ flex: 1 }}>
                    {f.q}
                  </Text>
                  <Icon name={isOpen ? 'expand_more' : 'chevron_right'} size={22} color={colors.disabled} />
                </Pressable>
                {isOpen ? (
                  <Text size={12} muted style={styles.faqAnswer}>
                    {f.a}
                  </Text>
                ) : null}
              </View>
            );
          })}
        </View>
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
  contacts: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  contact: { flex: 1, borderRadius: 16, borderCurve: 'continuous', padding: 16, gap: 8 },
  contactDark: { backgroundColor: colors.primary },
  contactLight: { backgroundColor: colors.background },
  faqGroup: { backgroundColor: colors.background, borderRadius: 16, borderCurve: 'continuous', overflow: 'hidden' },
  faqBorder: { borderBottomWidth: 1, borderBottomColor: colors.surface },
  faqRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
  faqAnswer: { paddingHorizontal: 16, paddingBottom: 16, lineHeight: 19, marginTop: -4 },
});
