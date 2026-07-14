import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/tokens';

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const SWATCHES = ['#3A3A38', '#8A6E4B', '#B7B2A6', '#5B6B5E', '#2C3A55', '#7A2E2E'];
const BRANDS = ['Atelier', 'Heritage', 'Milano', 'Studio'];
const FABRICS = ['Silk', 'Cashmere', 'Wool', 'Linen'];

function SectionLabel({ children }: { children: string }) {
  return (
    <Text uppercase size={11} track={0.12} color={colors.muted2} style={styles.sectionLabel}>
      {children}
    </Text>
  );
}

function Pill({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.pill,
        active ? { backgroundColor: colors.primary } : { borderWidth: 1.5, borderColor: colors.border },
      ]}>
      <Text weight="600" size={13} color={active ? colors.onPrimary : colors.label2}>
        {label}
      </Text>
    </Pressable>
  );
}

function useToggleSet(initial: string[]) {
  const [set, setSet] = useState<Set<string>>(new Set(initial));
  const toggle = (v: string) =>
    setSet((prev) => {
      const next = new Set(prev);
      if (next.has(v)) next.delete(v);
      else next.add(v);
      return next;
    });
  return { set, toggle, reset: () => setSet(new Set()) };
}

/** Bottom-sheet filter panel (size / colour / price / brand / fabric). Selections are local. */
export function FiltersSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const sizes = useToggleSet(['M']);
  const brands = useToggleSet(['Atelier']);
  const fabrics = useToggleSet(['Cashmere']);
  const [color, setColor] = useState(0);

  const resetAll = () => {
    sizes.reset();
    brands.reset();
    fabrics.reset();
    setColor(-1);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handleWrap}>
            <View style={styles.handle} />
          </View>
          <View style={styles.titleRow}>
            <Text serif weight="600" size={24}>
              Filters
            </Text>
            <Pressable onPress={resetAll} hitSlop={8}>
              <Text weight="700" size={12} track={0.06} color={colors.accent}>
                CLEAR ALL
              </Text>
            </Pressable>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            <SectionLabel>Size</SectionLabel>
            <View style={styles.wrap}>
              {SIZES.map((s) => (
                <Pill key={s} label={s} active={sizes.set.has(s)} onPress={() => sizes.toggle(s)} />
              ))}
            </View>

            <SectionLabel>Colour</SectionLabel>
            <View style={styles.swatchRow}>
              {SWATCHES.map((c, i) => (
                <Pressable key={c} onPress={() => setColor(i)}>
                  <View
                    style={[
                      styles.swatch,
                      { backgroundColor: c },
                      i === color && styles.swatchActive,
                    ]}
                  />
                </Pressable>
              ))}
            </View>

            <SectionLabel>Price Range</SectionLabel>
            <View style={styles.track}>
              <View style={styles.trackFill} />
              <View style={[styles.knob, { left: '15%' }]} />
              <View style={[styles.knob, { right: '30%' }]} />
            </View>
            <View style={styles.priceRow}>
              <Text weight="600" size={12} color={colors.label2}>
                ₹2,000
              </Text>
              <Text weight="600" size={12} color={colors.label2}>
                ₹18,000
              </Text>
            </View>

            <SectionLabel>Brand</SectionLabel>
            <View style={styles.wrap}>
              {BRANDS.map((b) => (
                <Pill key={b} label={b} active={brands.set.has(b)} onPress={() => brands.toggle(b)} />
              ))}
            </View>

            <SectionLabel>Fabric</SectionLabel>
            <View style={[styles.wrap, { marginBottom: 8 }]}>
              {FABRICS.map((f) => (
                <Pill key={f} label={f} active={fabrics.set.has(f)} onPress={() => fabrics.toggle(f)} />
              ))}
            </View>
          </ScrollView>

          <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
            <Pressable style={styles.resetBtn} onPress={resetAll}>
              <Text weight="600" size={14}>
                Reset
              </Text>
            </Pressable>
            <Pressable style={styles.showBtn} onPress={onClose}>
              <Text weight="600" size={14} color={colors.onPrimary}>
                Show Results
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(20,18,14,0.45)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radii.sheet,
    borderTopRightRadius: radii.sheet,
    maxHeight: '82%',
  },
  handleWrap: { paddingTop: 12, paddingBottom: 4, alignItems: 'center' },
  handle: { width: 38, height: 4, borderRadius: 2, backgroundColor: colors.divider },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
  body: { paddingHorizontal: 24, paddingTop: 20 },
  sectionLabel: { marginBottom: 12, marginTop: 4 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  pill: { paddingVertical: 9, paddingHorizontal: 18, borderRadius: 12, borderCurve: 'continuous' },
  swatchRow: { flexDirection: 'row', gap: 14, marginBottom: 24 },
  swatch: { width: 34, height: 34, borderRadius: 17 },
  swatchActive: {
    borderWidth: 3.5,
    borderColor: colors.accent,
    shadowColor: colors.white,
  },
  track: { height: 4, backgroundColor: colors.border, borderRadius: 2, marginHorizontal: 6, marginBottom: 8 },
  trackFill: {
    position: 'absolute',
    left: '15%',
    right: '30%',
    height: 4,
    backgroundColor: colors.accent,
    borderRadius: 2,
  },
  knob: {
    position: 'absolute',
    top: -6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
  },
  resetBtn: {
    flexBasis: '40%',
    height: 52,
    borderRadius: 14,
    borderCurve: 'continuous',
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  showBtn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    borderCurve: 'continuous',
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
