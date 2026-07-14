import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Pill, toneFor } from '@/components/backoffice/parts';
import { EmptyState } from '@/components/ui/empty-state';
import { Icon } from '@/components/ui/icon';
import { Loader } from '@/components/ui/loader';
import { Text } from '@/components/ui/text';
import { useAdminStaff } from '@/features/admin/hooks';
import { initials, ROLE_LABEL, STAFF_STATUS_META } from '@/features/admin/model';
import { fontFamily } from '@/theme/typography';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/tokens';

export default function ManageStaff() {
  const insets = useSafeAreaInsets();
  const { data, isPending, isError, refetch } = useAdminStaff();
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();
  const members = (data?.data ?? []).filter((m) =>
    q ? m.fullName.toLowerCase().includes(q) || (m.store?.name.toLowerCase().includes(q) ?? false) : true,
  );
  const boutiques = new Set((data?.data ?? []).map((m) => m.store?.id).filter(Boolean)).size;

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerRow}>
          <View>
            <Text serif weight="600" size={28}>
              Team
            </Text>
            <Text size={12} color={colors.muted2} style={{ marginTop: 2 }}>
              {data ? `${data.meta.total} members · ${boutiques} boutique${boutiques === 1 ? '' : 's'}` : '…'}
            </Text>
          </View>
          <Pressable style={styles.addBtn} hitSlop={{ top: 6, bottom: 6 }} onPress={() => router.push('/add-staff')}>
            <Icon name="person_add" size={20} color={colors.onPrimary} />
            <Text size={13} weight="600" color={colors.onPrimary}>
              Add Staff
            </Text>
          </Pressable>
        </View>
        <View style={styles.search}>
          <Icon name="search" size={20} color={colors.muted2} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search team members…"
            placeholderTextColor={colors.muted2}
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.searchInput}
          />
        </View>
      </View>

      {isPending ? (
        <Loader label="Loading the team…" />
      ) : isError ? (
        <EmptyState
          icon="cloud_off"
          title="Can't reach the store"
          message="Check your connection and try again."
          action={
            <Pressable style={styles.retry} onPress={() => void refetch()}>
              <Text size={14} weight="600" color={colors.onPrimary}>
                Retry
              </Text>
            </Pressable>
          }
        />
      ) : (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {members.map((m) => {
            const meta = STAFF_STATUS_META[m.status];
            return (
              <View key={m.id} style={styles.row}>
                <View style={[styles.avatar, { backgroundColor: toneFor(m.fullName) }]}>
                  <Text serif weight="600" size={17}>
                    {initials(m.fullName)}
                  </Text>
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <View style={styles.rowTop}>
                    <Text size={15} weight="600">
                      {m.fullName}
                    </Text>
                    <Pill bg={meta.bg} fg={meta.fg}>
                      {meta.label}
                    </Pill>
                  </View>
                  <Text size={12} color={colors.muted} style={{ marginTop: 3 }}>
                    {ROLE_LABEL[m.role]} · {m.store?.name ?? 'No boutique'}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.officeCanvas },
  header: { backgroundColor: colors.background, paddingHorizontal: 20, paddingBottom: 12 },
  headerRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  addBtn: {
    height: 42,
    paddingHorizontal: 16,
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    borderCurve: 'continuous',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  search: {
    marginTop: 14,
    height: 46,
    borderRadius: radii.md,
    borderCurve: 'continuous',
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: fontFamily.sansMedium,
    color: colors.label,
    paddingVertical: 0,
  },
  retry: {
    height: 48,
    paddingHorizontal: 28,
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { padding: 20, paddingBottom: 100, gap: 12 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderCurve: 'continuous',
    padding: 14,
  },
  avatar: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  rowTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
