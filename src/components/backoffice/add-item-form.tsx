import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/tokens';

/**
 * Add-inventory-item form — presentational per the design (no live submit yet; persistence is a
 * backend delta). Shared by the staff Inventory tab and the admin Catalog tab; `onBack` returns to
 * the caller and the CTA label differs ("Add to Inventory" vs "New Product").
 */
const SIZES = [
  { label: 'S', qty: 4 },
  { label: 'M', qty: 6, active: true },
  { label: 'L', qty: 3 },
  { label: 'XL', qty: 0, empty: true },
];
// Illustrative colour swatches (product content, not theme).
const SWATCHES = ['#3A3A38', '#8A6E4B', '#B7B2A6'];

export function AddItemForm({ cta, onBack }: { cta: string; onBack: () => void }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable style={styles.back} onPress={onBack} hitSlop={6}>
          <Icon name="arrow_back" size={22} color={colors.label} />
        </Pressable>
        <Text serif weight="600" size={24}>
          Add Inventory Item
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <View style={styles.photo}>
            <Icon name="add_a_photo" size={26} color={colors.accent} />
            <Text size={10} color={colors.muted}>
              Photo
            </Text>
          </View>
          <View style={styles.skuCol}>
            <FieldLabel>SKU</FieldLabel>
            <View style={styles.field}>
              <Text size={14} weight="500">
                AND-NEW-14
              </Text>
            </View>
          </View>
        </View>

        <FieldLabel>Product Name</FieldLabel>
        <View style={[styles.field, styles.fieldTall, styles.fieldStrong]}>
          <Text size={15} color={colors.faint}>
            e.g. Silk Slip Dress
          </Text>
        </View>

        <View style={styles.twoCol}>
          <View style={{ flex: 1 }}>
            <FieldLabel>Brand Line</FieldLabel>
            <View style={[styles.field, styles.fieldTall, styles.fieldBetween]}>
              <Text size={14}>Atelier</Text>
              <Icon name="expand_more" size={20} color={colors.disabled} />
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <FieldLabel>Price (₹)</FieldLabel>
            <View style={[styles.field, styles.fieldTall]}>
              <Text size={14} color={colors.faint}>
                0
              </Text>
            </View>
          </View>
        </View>

        <FieldLabel>Sizes &amp; Quantity</FieldLabel>
        <View style={styles.sizes}>
          {SIZES.map((s) => (
            <View key={s.label} style={[styles.sizeBox, s.active && styles.sizeBoxActive]}>
              <Text size={12} weight="700">
                {s.label}
              </Text>
              <Text size={16} weight="700" color={s.empty ? colors.disabled : colors.accent} style={{ marginTop: 4 }}>
                {s.qty}
              </Text>
            </View>
          ))}
        </View>

        <FieldLabel>Colour</FieldLabel>
        <View style={styles.swatches}>
          {SWATCHES.map((c, i) => (
            <View key={c} style={[styles.swatch, { backgroundColor: c }, i === 0 && styles.swatchActive]} />
          ))}
          <View style={styles.swatchAdd}>
            <Icon name="add" size={16} color={colors.muted2} />
          </View>
        </View>

        <View style={styles.info}>
          <Icon name="info" size={22} color={colors.accent} />
          <Text size={12} color={colors.label2} style={{ flex: 1, lineHeight: 18 }}>
            New items publish to the customer catalogue on next sync.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable style={styles.cta} onPress={onBack}>
          <Text size={15} weight="600" color={colors.onPrimary}>
            {cta}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function FieldLabel({ children }: { children: string }) {
  return (
    <Text uppercase size={11} track={0.1} color={colors.muted2} style={styles.fieldLabel}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingBottom: 12 },
  back: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 24 },
  topRow: { flexDirection: 'row', gap: 14, marginBottom: 20 },
  photo: {
    width: 88,
    height: 110,
    borderRadius: radii.md,
    borderCurve: 'continuous',
    backgroundColor: colors.officeCanvas,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  skuCol: { flex: 1, justifyContent: 'center' },
  fieldLabel: { marginBottom: 6 },
  field: {
    height: 46,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radii.chip,
    borderCurve: 'continuous',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  fieldTall: { height: 50 },
  fieldStrong: { borderColor: colors.borderStrong, marginBottom: 16 },
  fieldBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  twoCol: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  sizes: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  sizeBox: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radii.chip,
    borderCurve: 'continuous',
    padding: 10,
    alignItems: 'center',
  },
  sizeBoxActive: { borderColor: colors.accent },
  swatches: { flexDirection: 'row', gap: 12, marginBottom: 16, alignItems: 'center' },
  swatch: { width: 32, height: 32, borderRadius: 16 },
  // Selected swatch: gold ring (design uses a white+gold double ring; a single gold ring reads the same).
  swatchActive: { borderWidth: 2.5, borderColor: colors.accent },
  swatchAdd: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.disabled,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    backgroundColor: colors.officeCanvas,
    borderRadius: radii.md,
    borderCurve: 'continuous',
    padding: 14,
  },
  footer: { borderTopWidth: 1, borderTopColor: colors.hairline, paddingHorizontal: 16, paddingTop: 12 },
  cta: {
    height: 54,
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
