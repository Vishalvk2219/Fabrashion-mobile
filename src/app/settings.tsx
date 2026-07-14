import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, Text, Toggle } from '@/components/ui';
import { storage } from '@/lib/storage';
import { colors } from '@/theme/colors';
import type { IconName } from '@/theme/material-icons';

function SectionLabel({ children }: { children: string }) {
  return (
    <Text uppercase size={11} track={0.12} color={colors.muted2} style={styles.sectionLabel}>
      {children}
    </Text>
  );
}

function RowShell({ icon, label, children, last }: { icon: IconName; label: string; children: React.ReactNode; last?: boolean }) {
  return (
    <View style={[styles.row, !last && styles.rowBorder]}>
      <Icon name={icon} size={22} color={colors.label2} />
      <Text weight="500" size={14} style={{ flex: 1 }}>
        {label}
      </Text>
      {children}
    </View>
  );
}

function useSetting(key: string, fallback: boolean) {
  const [value, setValue] = useState(() => storage.get<boolean>(key, fallback));
  const set = (v: boolean) => {
    storage.set(key, v);
    setValue(v);
  };
  return [value, set] as const;
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const [push, setPush] = useSetting('settings.push', true);
  const [offers, setOffers] = useSetting('settings.offers', true);
  const [dark, setDark] = useSetting('settings.dark', false);

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable style={styles.back} onPress={() => router.back()} hitSlop={6}>
          <Icon name="arrow_back" size={22} color={colors.label} />
        </Pressable>
        <Text serif weight="600" size={24}>
          Settings
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <SectionLabel>Preferences</SectionLabel>
        <View style={styles.group}>
          <RowShell icon="notifications" label="Push Notifications">
            <Toggle value={push} onChange={setPush} />
          </RowShell>
          <RowShell icon="local_offer" label="Offers & Promotions">
            <Toggle value={offers} onChange={setOffers} />
          </RowShell>
          <RowShell icon="dark_mode" label="Dark Mode" last>
            <Toggle value={dark} onChange={setDark} />
          </RowShell>
        </View>

        <SectionLabel>General</SectionLabel>
        <View style={styles.group}>
          <RowShell icon="language" label="Language">
            <Text size={13} muted>
              English
            </Text>
            <Icon name="chevron_right" size={20} color={colors.disabled} />
          </RowShell>
          <RowShell icon="description" label="Terms of Service">
            <Icon name="chevron_right" size={20} color={colors.disabled} />
          </RowShell>
          <RowShell icon="shield" label="Privacy">
            <Icon name="chevron_right" size={20} color={colors.disabled} />
          </RowShell>
          <RowShell icon="info" label="About ANDRÓ" last>
            <Text size={13} muted>
              v2.4.0
            </Text>
          </RowShell>
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
  sectionLabel: { marginBottom: 10 },
  group: {
    backgroundColor: colors.background,
    borderRadius: 16,
    borderCurve: 'continuous',
    overflow: 'hidden',
    marginBottom: 20,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.surface },
});
