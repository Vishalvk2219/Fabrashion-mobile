import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Pill, toneFor } from '@/components/backoffice/parts';
import { Icon } from '@/components/ui/icon';
import { Loader } from '@/components/ui/loader';
import { Text } from '@/components/ui/text';
import { useStaffInventoryView } from '@/features/staff/hooks';
import { deriveStatus, STATUS_PILL, totalUnits } from '@/features/staff/model';
import { useStaffStore } from '@/features/staff/store';
import type { StockDeltas } from '@/features/staff/schema';
import { formatPaiseCompact } from '@/lib/money';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/tokens';
import type { IconName } from '@/theme/material-icons';

export default function UpdateStock() {
  const insets = useSafeAreaInsets();
  const { rows, isPending } = useStaffInventoryView();
  const activeVariantId = useStaffStore((s) => s.activeVariantId);
  const enqueueAdjust = useStaffStore((s) => s.enqueueAdjust);

  const item = rows.find((it) => it.variantId === activeVariantId) ?? rows[0];

  if (isPending || !item) {
    return (
      <View style={styles.root}>
        <Loader label="Loading item…" />
      </View>
    );
  }

  const status = deriveStatus(item);
  const pill = STATUS_PILL[status];
  // Deltas queue locally (idempotent eventIds) and flush to the server when online.
  const adjust = (deltas: StockDeltas) => enqueueAdjust(item.variantId, deltas);

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable style={styles.back} onPress={() => router.back()} hitSlop={6}>
          <Icon name="arrow_back" size={22} color={colors.label} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text serif weight="600" size={22} style={{ lineHeight: 24 }}>
            Update Stock
          </Text>
          <Text size={11} color={colors.muted2} style={{ marginTop: 2 }}>
            {item.sku}
          </Text>
        </View>
        <View style={styles.syncDot}>
          <View style={[styles.dot, { backgroundColor: item.synced ? colors.okFg : colors.warnFg }]} />
          <Text size={11} weight="700" color={item.synced ? colors.okFg : colors.warnFg}>
            {item.synced ? 'Synced' : 'Pending'}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Item card */}
        <View style={styles.itemCard}>
          <View style={[styles.itemThumb, { backgroundColor: item.colorHex ?? toneFor(item.sku) }]} />
          <View style={{ flex: 1 }}>
            <Text uppercase size={9} track={0.1} color={colors.faint}>
              {item.brand ?? 'ANDRÓ'} · {item.size} · {item.colorName}
            </Text>
            <Text size={16} weight="600" style={{ marginTop: 3 }}>
              {item.name}
            </Text>
            <Text size={14} weight="700" style={{ marginTop: 6 }}>
              {formatPaiseCompact(item.pricePaise)}
            </Text>
            <View style={{ marginTop: 8 }}>
              <Pill bg={pill.bg} fg={pill.fg}>
                {status}
              </Pill>
            </View>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text size={26} weight="700">
              {totalUnits(item)}
            </Text>
            <Text size={9} color={colors.muted2}>
              total
            </Text>
          </View>
        </View>

        <Text uppercase size={11} track={0.12} color={colors.muted2} style={styles.sectionLabel}>
          Stock by location
        </Text>

        <Stepper
          icon="inventory"
          title="Floor / Rack"
          sub="Available to shoppers"
          value={item.floor}
          onDec={() => item.floor > 0 && adjust({ floor: -1 })}
          onInc={() => adjust({ floor: 1 })}
        />
        <Stepper
          icon="point_of_sale"
          title="On Counter"
          sub="Being tried / at billing"
          value={item.counter}
          highlight
          onDec={() => item.counter > 0 && adjust({ counter: -1 })}
          onInc={() => adjust({ counter: 1 })}
        />
        <Stepper
          icon="bookmark"
          title="Reserved / Held"
          sub="Online orders & try-at-home"
          value={item.reserved}
          onDec={() => item.reserved > 0 && adjust({ reserved: -1 })}
          onInc={() => adjust({ reserved: 1 })}
        />

        <Pressable
          style={styles.moveBtn}
          onPress={() => item.floor > 0 && adjust({ floor: -1, counter: 1 })}>
          <Icon name="move_up" size={20} color={colors.label} />
          <Text size={14} weight="600">
            Move 1 to Counter
          </Text>
        </Pressable>
        <Text size={11} color={colors.muted} align="center" style={styles.helper}>
          Changes update customer-facing availability instantly when online, or queue locally when offline.
        </Text>
      </ScrollView>

      {/* Save */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable style={styles.saveBtn} onPress={() => router.back()}>
          <Icon name="save" size={20} color={colors.onPrimary} />
          <Text size={15} weight="600" color={colors.onPrimary}>
            Done
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function Stepper({
  icon,
  title,
  sub,
  value,
  highlight,
  onDec,
  onInc,
}: {
  icon: IconName;
  title: string;
  sub: string;
  value: number;
  highlight?: boolean;
  onDec: () => void;
  onInc: () => void;
}) {
  return (
    <View style={[styles.stepRow, highlight && styles.stepRowHighlight]}>
      <Icon name={icon} size={24} color={colors.accent} />
      <View style={{ flex: 1 }}>
        <Text size={14} weight="600">
          {title}
        </Text>
        <Text size={11} color={colors.muted} style={{ marginTop: 1 }}>
          {sub}
        </Text>
      </View>
      <View style={styles.stepper}>
        <Pressable onPress={onDec} hitSlop={8}>
          <Icon name="remove" size={20} color={value > 0 ? colors.label : colors.disabled} />
        </Pressable>
        <Text size={16} weight="700" style={styles.stepValue}>
          {value}
        </Text>
        <Pressable onPress={onInc} hitSlop={8}>
          <Icon name="add" size={20} color={colors.label} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.officeCanvas },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  back: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  syncDot: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  scroll: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 },
  itemCard: {
    flexDirection: 'row',
    gap: 14,
    backgroundColor: colors.background,
    borderRadius: radii.card,
    borderCurve: 'continuous',
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  itemThumb: { width: 72, height: 90, borderRadius: radii.chip, borderCurve: 'continuous' },
  sectionLabel: { marginTop: 22, marginBottom: 10 },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    borderCurve: 'continuous',
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepRowHighlight: { borderWidth: 1.5, borderColor: colors.accent },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radii.chip,
    borderCurve: 'continuous',
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  stepValue: { minWidth: 20, textAlign: 'center' },
  moveBtn: {
    marginTop: 18,
    height: 52,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    borderRadius: radii.md,
    borderCurve: 'continuous',
    backgroundColor: colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  helper: { marginTop: 12, lineHeight: 17 },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  saveBtn: {
    height: 54,
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    borderCurve: 'continuous',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});
